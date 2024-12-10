'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.junkcoin = exports.testnet = void 0;

exports.junkcoin = {
  messagePrefix: '\u0018Junkcoin Signed Message:\n',
  bech32: 'jc1q',  // For SegWit addresses (when activated)
  bech32m: 'jc1p', // For Taproot addresses (when activated)
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x10,
  scriptHash: 0x05,
  wif: 0x99,
};

exports.testnet = {
  messagePrefix: '\u0018Junkcoin Testnet Signed Message:\n',
  bech32: 'tj1q',  // For SegWit addresses (when activated)
  bech32m: 'tj1p', // For Taproot addresses (when activated)
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  pubKeyHash: 0x16,
  scriptHash: 0x05,
  wif: 0x96,
};
