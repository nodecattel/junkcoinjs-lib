// networks.ts
// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

export interface Network {
  messagePrefix: string;
  bech32: string;
  bech32m: string; // For Taproot addresses
  bip32: Bip32;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

interface Bip32 {
  public: number;
  private: number;
}

export const junkcoin: Network = {
  messagePrefix: '\u0018Junkcoin Signed Message:\n',
  bech32: 'jc1q', // For SegWit addresses (when activated)
  bech32m: 'jc1p', // For Taproot addresses (when activated)
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x10,
  scriptHash: 0x05,
  wif: 0x99,
};

export const testnet: Network = {
  messagePrefix: '\u0018Junkcoin Testnet Signed Message:\n',
  bech32: 'tj1q', // For SegWit addresses (when activated)
  bech32m: 'tj1p', // For Taproot addresses (when activated)
  bip32: {
    public: 0x02facafd,
    private: 0x02fac398,
  },
  pubKeyHash: 0x16,
  scriptHash: 0x05,
  wif: 0x96,
};
