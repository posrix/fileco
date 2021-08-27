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
