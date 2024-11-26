/**
 * Junkcoin address decode and encode tools, include base58, bech32 and output script.
 *
 * Supports Junkcoin mainnet, testnet, and regtest networks.
 * Addresses support P2PKH, P2SH, P2WPKH, P2WSH, P2TR, and others.
 *
 * @packageDocumentation
 */
import { Network } from './networks.js';
import * as networks from './networks.js';
import * as payments from './payments/index.js';
import * as bscript from './script.js';
import { Hash160bitSchema, UInt8Schema } from './types.js';
import { bech32, bech32m } from 'bech32';
import bs58check from 'bs58check';
import * as tools from 'uint8array-tools';
import * as v from 'valibot';

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

const FUTURE_SEGWIT_MAX_SIZE = 40;
const FUTURE_SEGWIT_MIN_SIZE = 2;
const FUTURE_SEGWIT_MAX_VERSION = 16;
const FUTURE_SEGWIT_MIN_VERSION = 2;
const FUTURE_SEGWIT_VERSION_DIFF = 0x50;
const FUTURE_SEGWIT_VERSION_WARNING =
  'WARNING: Sending to a future segwit version address can lead to loss of funds. ' +
  'End users MUST be warned carefully in the GUI and asked if they wish to proceed ' +
  'with caution. Wallets should verify the segwit version from the output of fromBech32, ' +
  'then decide when it is safe to use which version of segwit.';

function _toFutureSegwitAddress(output: Uint8Array, network: Network): string {
  const data = output.slice(2);

  if (
    data.length < FUTURE_SEGWIT_MIN_SIZE ||
    data.length > FUTURE_SEGWIT_MAX_SIZE
  )
    throw new TypeError('Invalid program length for segwit address');

  const version = output[0] - FUTURE_SEGWIT_VERSION_DIFF;

  if (
    version < FUTURE_SEGWIT_MIN_VERSION ||
    version > FUTURE_SEGWIT_MAX_VERSION
  )
    throw new TypeError('Invalid version for segwit address');

  if (output[1] !== data.length)
    throw new TypeError('Invalid script for segwit address');

  console.warn(FUTURE_SEGWIT_VERSION_WARNING);

  return toBech32(data, version, network.bech32);
}

export function fromBase58Check(address: string): Base58CheckResult {
  const payload = bs58check.decode(address);

  if (payload.length < 21) throw new TypeError(address + ' is too short');
  if (payload.length > 21) throw new TypeError(address + ' is too long');

  const version = tools.readUInt8(payload, 0);
  const hash = payload.slice(1);

  return { version, hash };
}

export function fromBech32(address: string): Bech32Result {
  let result;
  let version;
  try {
    result = bech32.decode(address);
  } catch (e) {}

  if (result) {
    version = result.words[0];
    if (version !== 0) throw new TypeError(address + ' uses wrong encoding');
  } else {
    result = bech32m.decode(address);
    version = result.words[0];
    if (version === 0) throw new TypeError(address + ' uses wrong encoding');
  }

  const data = bech32.fromWords(result.words.slice(1));

  return {
    version,
    prefix: result.prefix,
    data: Uint8Array.from(data),
  };
}

export function toBase58Check(hash: Uint8Array, version: number): string {
  v.parse(v.tuple([Hash160bitSchema, UInt8Schema]), [hash, version]);

  const payload = new Uint8Array(21);
  tools.writeUInt8(payload, 0, version);
  payload.set(hash, 1);

  return bs58check.encode(payload);
}

export function toBech32(
  data: Uint8Array,
  version: number,
  prefix: string,
): string {
  const words = bech32.toWords(data);
  words.unshift(version);

  return version === 0
    ? bech32.encode(prefix, words)
    : bech32m.encode(prefix, words);
}

export function fromOutputScript(
  output: Uint8Array,
  network: Network = networks.junkcoin,
): string {
  try {
    return payments.p2pkh({ output, network }).address as string;
  } catch (e) {}
  try {
    return payments.p2sh({ output, network }).address as string;
  } catch (e) {}
  try {
    return payments.p2wpkh({ output, network }).address as string;
  } catch (e) {}
  try {
    return payments.p2wsh({ output, network }).address as string;
  } catch (e) {}
  try {
    return payments.p2tr({ output, network }).address as string;
  } catch (e) {}
  try {
    return _toFutureSegwitAddress(output, network);
  } catch (e) {}

  throw new Error(bscript.toASM(output) + ' has no matching Address');
}

export function toOutputScript(
  address: string,
  network: Network = networks.junkcoin,
): Uint8Array {
  let decodeBase58: Base58CheckResult | undefined;
  let decodeBech32: Bech32Result | undefined;
  try {
    decodeBase58 = fromBase58Check(address);
  } catch (e) {}

  if (decodeBase58) {
    if (decodeBase58.version === network.pubKeyHash)
      return payments.p2pkh({ hash: decodeBase58.hash }).output as Uint8Array;
    if (decodeBase58.version === network.scriptHash)
      return payments.p2sh({ hash: decodeBase58.hash }).output as Uint8Array;
  } else {
    try {
      decodeBech32 = fromBech32(address);
    } catch (e) {}

    if (decodeBech32) {
      if (decodeBech32.prefix !== network.bech32)
        throw new Error(address + ' has an invalid prefix');
      if (decodeBech32.version === 0) {
        if (decodeBech32.data.length === 20)
          return payments.p2wpkh({ hash: decodeBech32.data })
            .output as Uint8Array;
        if (decodeBech32.data.length === 32)
          return payments.p2wsh({ hash: decodeBech32.data })
            .output as Uint8Array;
      } else if (decodeBech32.version === 1) {
        if (decodeBech32.data.length === 32)
          return payments.p2tr({ pubkey: decodeBech32.data })
            .output as Uint8Array;
      } else if (
        decodeBech32.version >= FUTURE_SEGWIT_MIN_VERSION &&
        decodeBech32.version <= FUTURE_SEGWIT_MAX_VERSION &&
        decodeBech32.data.length >= FUTURE_SEGWIT_MIN_SIZE &&
        decodeBech32.data.length <= FUTURE_SEGWIT_MAX_SIZE
      ) {
        console.warn(FUTURE_SEGWIT_VERSION_WARNING);

        return bscript.compile([
          decodeBech32.version + FUTURE_SEGWIT_VERSION_DIFF,
          decodeBech32.data,
        ]);
      }
    }
  }

  throw new Error(address + ' has no matching Script');
}
