//@ts-ignore
window.global = window;
//@ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const signer = require('src/utils/filecoin-signing-tools');
export default signer;
