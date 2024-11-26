/**
 * Junkcoin address decode and encode tools, include base58, bech32 and output script.
 *
 * Supports Junkcoin mainnet, testnet, and regtest networks.
 * Addresses support P2PKH, P2SH, P2WPKH, P2WSH, P2TR, and others.
 *
 * @packageDocumentation
 */
import { Network } from './networks.js';
/** base58check decode result */
export interface Base58CheckResult {
    hash: Uint8Array;
    version: number;
}
/** bech32 decode result */
export interface Bech32Result {
    version: number;
    prefix: string;
    data: Uint8Array;
}
export declare function fromBase58Check(address: string): Base58CheckResult;
export declare function fromBech32(address: string): Bech32Result;
export declare function toBase58Check(hash: Uint8Array, version: number): string;
export declare function toBech32(data: Uint8Array, version: number, prefix: string): string;
export declare function fromOutputScript(output: Uint8Array, network?: Network): string;
export declare function toOutputScript(address: string, network?: Network): Uint8Array;
