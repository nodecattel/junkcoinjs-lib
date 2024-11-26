/**
 * Represents a Junkcoin network configuration, including messagePrefix, bech32, bip32, pubKeyHash, scriptHash, wif.
 * Supports junkcoin, junkcoin testnet, and junkcoin regtest.
 * @packageDocumentation
 */
export interface Network {
    messagePrefix: string;
    bech32: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
}
interface Bip32 {
    public: number;
    private: number;
}
/**
 * Represents the Junkcoin mainnet network configuration.
 */
export declare const junkcoin: Network;
/**
 * Represents the Junkcoin testnet network configuration.
 */
export declare const junkcoinTestnet: Network;
/**
 * Represents the Junkcoin regtest network configuration.
 */
export declare const junkcoinRegtest: Network;
/**
 * Aliases for compatibility with existing references to bitcoin, regtest, and testnet.
 */
export declare const bitcoin: Network;
export declare const testnet: Network;
export declare const regtest: Network;
export {};
