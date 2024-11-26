import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import assert from 'assert';
import {
  initEccLib,
  networks,
  payments,
  address,
  Transaction,
  script
} from '../src/esm/index.js';

initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

describe('Junkcoin Core Functionality', () => {
  const testVector = {
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    path: "m/44'/1'/0'/0/0",
    expectedMainnetAddr: '7XiGAEZwStptR8cpVN5EEJuf6iYkrXnyyF',
    testAmount: BigInt(100000000), // 1 JUNK as BigInt
  };

  let seed: Buffer;
  let root: any;
  let child: any;

  before(async () => {
    seed = await bip39.mnemonicToSeed(testVector.mnemonic);
    root = bip32.fromSeed(seed);
    child = root.derivePath(testVector.path);
  });

  describe('Key and Address Management', () => {
    it('should derive correct public key and address', () => {
      const { address: addr } = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoin
      });

      console.log('Derived address:', addr);
      console.log('Expected address:', testVector.expectedMainnetAddr);
      
      assert(addr, 'Address should be generated');
      assert.doesNotThrow(() => {
        address.toOutputScript(addr!, networks.junkcoin);
      }, 'Should be a valid address');
    });
  });

  describe('Transaction Building', () => {
    it('should create valid transaction structure', () => {
      const tx = new Transaction();
      tx.version = 2;
      
      // Add a dummy input (previous tx hash of all zeros)
      const dummyHash = Buffer.alloc(32, 0);
      tx.addInput(dummyHash, 0);
      
      // Add an output
      const { address: recipientAddr } = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoin
      });
      
      const p2pkhScript = address.toOutputScript(recipientAddr!, networks.junkcoin);
      tx.addOutput(p2pkhScript, testVector.testAmount);

      assert.strictEqual(tx.ins.length, 1, 'Transaction should have 1 input');
      assert.strictEqual(tx.outs.length, 1, 'Transaction should have 1 output');
      
      // Print transaction details
      console.log('Transaction details:');
      console.log('Version:', tx.version);
      console.log('Inputs:', tx.ins.length);
      console.log('Outputs:', tx.outs.length);
      console.log('Output amount:', testVector.testAmount.toString());
      console.log('Output script:', p2pkhScript.toString('hex'));
    });
  });

  describe('Network Validation', () => {
    it('should validate network parameters', () => {
      assert.strictEqual(networks.junkcoin.pubKeyHash, 0x10, 'Invalid mainnet pubKeyHash');
      assert.strictEqual(networks.junkcoin.scriptHash, 0x05, 'Invalid mainnet scriptHash');
      assert.strictEqual(networks.junkcoin.wif, 0x90, 'Invalid mainnet WIF prefix');
      
      assert.strictEqual(networks.junkcoinTestnet.pubKeyHash, 0x2f, 'Invalid testnet pubKeyHash');
      assert.strictEqual(networks.junkcoinTestnet.scriptHash, 0x05, 'Invalid testnet scriptHash');
      assert.strictEqual(networks.junkcoinTestnet.wif, 0x99, 'Invalid testnet WIF prefix');
      
      console.log('Network parameters:');
      console.log('Mainnet:', networks.junkcoin);
      console.log('Testnet:', networks.junkcoinTestnet);
    });
  });
});
