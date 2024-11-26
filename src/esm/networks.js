// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Junkcoin BIP32 configuration based on its chain parameters.
/**
 * Represents the Junkcoin mainnet network configuration.
 */
export const junkcoin = {
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
export const junkcoinTestnet = {
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
export const junkcoinRegtest = {
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
export const bitcoin = junkcoin; // Alias Junkcoin mainnet as Bitcoin
export const testnet = junkcoinTestnet; // Alias Junkcoin testnet
export const regtest = junkcoinRegtest; // Alias Junkcoin regtest
