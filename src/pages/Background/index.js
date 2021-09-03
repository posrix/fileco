let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

// manifest v3 does not support background persistence,
// so we need to use hack way (runtime ports) to keep it alive
// ref: https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
async function keepAlive() {
  if (lifeline) return;
  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => chrome.runtime.connect({ name: 'keepAlive' }),
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive();
  }
}

const runtimeStorage = {
  password: '',
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SET_PASSWORD':
      runtimeStorage.password = message.password;
      sendResponse({ password: message.password });
      break;
    case 'GET_PASSWORD':
      sendResponse({ password: runtimeStorage.password });
      break;
  }
});
