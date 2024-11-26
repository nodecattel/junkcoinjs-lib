import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import assert from 'assert';
import {
  initEccLib,
  networks,
  payments,
  address,
  script
} from '../../src/esm/index.js';

initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

describe('Junkcoin Multisig Tests', () => {
  const testVectors = {
    mnemonic1: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    mnemonic2: 'ability able about above absent absorb abstract absurd abuse access accident',
    mnemonic3: 'zero zoo young worth work wish wisdom winter winner width wing witness',
    path: "m/44'/1'/0'/0/0"
  };

  let pubkeys: Buffer[];
  
  before(async () => {
    // Generate 3 keypairs
    const seeds = await Promise.all([
      bip39.mnemonicToSeed(testVectors.mnemonic1),
      bip39.mnemonicToSeed(testVectors.mnemonic2),
      bip39.mnemonicToSeed(testVectors.mnemonic3)
    ]);

    pubkeys = seeds.map(seed => {
      const root = bip32.fromSeed(seed);
      const child = root.derivePath(testVectors.path);
      return child.publicKey;
    });
  });

  describe('2-of-3 Multisig', () => {
    it('should create valid 2-of-3 multisig address', () => {
      const p2ms = payments.p2ms({
        m: 2,
        pubkeys: pubkeys,
        network: networks.junkcoin
      });

      const p2sh = payments.p2sh({
        redeem: p2ms,
        network: networks.junkcoin
      });

      console.log('\nMultisig details:');
      console.log('Redeem script:', p2ms.output!.toString('hex'));
      console.log('P2SH address:', p2sh.address);
      
      // Verify script structure
      const decodedScript = script.decompile(p2ms.output!);
      console.log('Decoded script:', decodedScript);

      assert(p2sh.address, 'Should generate multisig address');
      assert(p2ms.output, 'Should generate redeem script');
    });

    it('should create different address types for multisig', () => {
      // P2SH
      const p2shAddress = payments.p2sh({
        redeem: payments.p2ms({
          m: 2,
          pubkeys: pubkeys,
          network: networks.junkcoin
        }),
        network: networks.junkcoin
      }).address;

      // P2WSH (native segwit)
      const p2wshAddress = payments.p2wsh({
        redeem: payments.p2ms({
          m: 2,
          pubkeys: pubkeys,
          network: networks.junkcoin
        }),
        network: networks.junkcoin
      }).address;

      console.log('\nMultisig addresses:');
      console.log('P2SH:', p2shAddress);
      console.log('P2WSH:', p2wshAddress);

      assert(p2shAddress, 'Should generate P2SH address');
      assert(p2wshAddress, 'Should generate P2WSH address');
    });
  });
});
