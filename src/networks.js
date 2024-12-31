'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.testnet = exports.junkcoin = void 0;
exports.junkcoin = {
  messagePrefix: '\u0018Junkcoin Signed Message:\n',
  bech32: 'jc1q',
  bech32m: 'jc1p',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x10,
  scriptHash: 0x05,
  wif: 0x90,
};
exports.testnet = {
  messagePrefix: '\u0018Junkcoin Testnet Signed Message:\n',
  bech32: 'tjc1q',
  bech32m: 'tjc1p',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398, // From chainparams EXT_SECRET_KEY
  },
  pubKeyHash: 0x6f,
  scriptHash: 0x05,
  wif: 0xef, // From chainparams SECRET_KEY
};
