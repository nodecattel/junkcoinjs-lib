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
  wif: 0x90,
};

export const testnet: Network = {
  messagePrefix: '\u0018Junkcoin Testnet Signed Message:\n',
  bech32: 'tjc1q',     // For SegWit addresses (when activated)
  bech32m: 'tjc1p',    // For Taproot addresses (when activated)
  bip32: {
    public: 0x02facafd,  // From chainparams EXT_PUBLIC_KEY
    private: 0x02fac398, // From chainparams EXT_SECRET_KEY
  },
  pubKeyHash: 0x6f,    // From chainparams PUBKEY_ADDRESS
  scriptHash: 0x05,    // From chainparams SCRIPT_ADDRESS
  wif: 0xef,          // From chainparams SECRET_KEY
};
