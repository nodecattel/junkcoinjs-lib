'use strict';
// networks.ts
// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731
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
  bech32: 'tj1q',
  bech32m: 'tj1p',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};
