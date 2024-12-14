export interface Network {
    messagePrefix: string;
    bech32: string;
    bech32m: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
}
interface Bip32 {
    public: number;
    private: number;
}
export declare const junkcoin: Network;
export declare const testnet: Network;
export {};
