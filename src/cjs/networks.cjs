'use strict';
// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Junkcoin BIP32 configuration based on its chain parameters.
Object.defineProperty(exports, '__esModule', { value: true });
exports.regtest =
  exports.testnet =
  exports.bitcoin =
  exports.junkcoinRegtest =
  exports.junkcoinTestnet =
  exports.junkcoin =
    void 0;
/**
 * Represents the Junkcoin mainnet network configuration.
 */
exports.junkcoin = {
  messagePrefix: '\x19Junkcoin Signed Message:\n',
  bech32: 'junk',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x10,
  scriptHash: 0x05,
  wif: 0x90,
};
/**
 * Represents the Junkcoin testnet network configuration.
 */
exports.junkcoinTestnet = {
  messagePrefix: '\x19Junkcoin Testnet Signed Message:\n',
  bech32: 'tjunk',
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  pubKeyHash: 0x2f,
  scriptHash: 0x05,
  wif: 0x99,
};
/**
 * Represents the Junkcoin regtest network configuration.
 */
exports.junkcoinRegtest = {
  messagePrefix: '\x19Junkcoin Regtest Signed Message:\n',
  bech32: 'rjunk',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};
/**
 * Aliases for compatibility with existing references to bitcoin, regtest, and testnet.
 */
exports.bitcoin = exports.junkcoin; // Alias Junkcoin mainnet as Bitcoin
exports.testnet = exports.junkcoinTestnet; // Alias Junkcoin testnet
exports.regtest = exports.junkcoinRegtest; // Alias Junkcoin regtest
