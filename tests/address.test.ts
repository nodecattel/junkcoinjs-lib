import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import assert from 'assert';
import { initEccLib, networks, payments, address } from '../src/esm/index.js';

// Initialize ECC library first
initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

describe('Junkcoin Address Generation', () => {
  const testVector = {
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    derivationPath: "m/44'/1'/0'/0/0"  // BIP44 for legacy addresses
  };

  let seed: Buffer;
  let root: any;

  before(async () => {
    seed = await bip39.mnemonicToSeed(testVector.mnemonic);
    root = bip32.fromSeed(seed);
  });

  describe('Legacy Addresses (P2PKH)', () => {
    it('should create valid mainnet P2PKH address', () => {
      const child = root.derivePath(testVector.derivationPath);
      const { address: addr } = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoin
      });

      console.log('Mainnet address:', addr);
      console.log('Private key (WIF):', child.toWIF());
      
      // Verify address is valid
      assert.doesNotThrow(() => {
        const script = address.toOutputScript(addr!, networks.junkcoin);
        console.log('Output script:', script.toString('hex'));
      }, 'Should be a valid mainnet address');
    });

    it('should create valid testnet P2PKH address', () => {
      const child = root.derivePath(testVector.derivationPath);
      const { address: addr } = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoinTestnet
      });

      console.log('Testnet address:', addr);
      console.log('Private key (WIF):', child.toWIF());
      
      // Verify address is valid
      assert.doesNotThrow(() => {
        const script = address.toOutputScript(addr!, networks.junkcoinTestnet);
        console.log('Output script:', script.toString('hex'));
      }, 'Should be a valid testnet address');
    });

    it('should validate address network type', () => {
      const child = root.derivePath(testVector.derivationPath);
      
      // Generate mainnet address
      const { address: mainnetAddr } = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoin
      });

      // Should throw when using mainnet address with testnet
      assert.throws(() => {
        address.toOutputScript(mainnetAddr!, networks.junkcoinTestnet);
      }, /has no matching Script/);
    });
  });
});
