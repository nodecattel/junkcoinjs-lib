import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import BIP32Factory from 'bip32';
import assert from 'assert';
import {
  initEccLib,
  networks,
  payments,
  address,
  Transaction
} from '../../ts_src/index.js';

// Initialize libraries
initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

describe('Junkcoin Transaction Tests', () => {
  const testVector = {
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    path: "m/44'/1'/0'/0/0"
  };

  let pubkey: Uint8Array;
  let testAddress: string;

  before(async () => {
    const seed = await bip39.mnemonicToSeed(testVector.mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(testVector.path);
    pubkey = child.publicKey;

    // Create mainnet P2PKH payment
    const payment = payments.p2pkh({
      pubkey: pubkey,
      network: networks.junkcoin
    });

    testAddress = payment.address!;
    console.log('\nTest address (P2PKH):', testAddress);
  });

  describe('Basic Transaction Tests', () => {
    it('should create P2PKH transaction', () => {
      const tx = new Transaction();
      tx.version = 2;

      // Add input (dummy data)
      const dummyTxId = Buffer.alloc(32, 0);
      tx.addInput(dummyTxId, 0);

      // Add output
      const amount = BigInt(100000000); // 1 JUNK
      const outputScript = address.toOutputScript(testAddress, networks.junkcoin);
      tx.addOutput(outputScript, amount);

      console.log('\nTransaction details:');
      console.log('Version:', tx.version);
      console.log('Input count:', tx.ins.length);
      console.log('Output count:', tx.outs.length);
      console.log('Transaction ID:', tx.getId());

      assert.strictEqual(tx.version, 2, 'Correct version');
      assert.strictEqual(tx.ins.length, 1, 'One input');
      assert.strictEqual(tx.outs.length, 1, 'One output');
    });

    it('should verify address formats', () => {
      // Test mainnet address
      const mainnetPayment = payments.p2pkh({
        pubkey: pubkey,
        network: networks.junkcoin
      });

      // Test testnet address
      const testnetPayment = payments.p2pkh({
        pubkey: pubkey,
        network: networks.junkcoinTestnet
      });

      console.log('\nAddress verification:');
      console.log('Mainnet:', mainnetPayment.address);
      console.log('Testnet:', testnetPayment.address);

      // Verify both addresses are valid
      assert(mainnetPayment.address, 'Valid mainnet address');
      assert(testnetPayment.address, 'Valid testnet address');
      
      // Verify scripts can be generated
      assert(address.toOutputScript(mainnetPayment.address!, networks.junkcoin));
      assert(address.toOutputScript(testnetPayment.address!, networks.junkcoinTestnet));
    });

    it('should calculate transaction properties', () => {
      const tx = new Transaction();
      tx.version = 2;
      
      // Add dummy input/output
      tx.addInput(Buffer.alloc(32, 0), 0);
      tx.addOutput(
        address.toOutputScript(testAddress, networks.junkcoin),
        BigInt(100000000)
      );

      const size = tx.byteLength();
      const vsize = tx.virtualSize();
      const weight = tx.weight();

      console.log('\nTransaction metrics:');
      console.log('Byte length:', size);
      console.log('Virtual size:', vsize);
      console.log('Weight:', weight);

      assert(size > 0, 'Has byte length');
      assert(vsize > 0, 'Has virtual size');
      assert(weight > 0, 'Has weight');
    });
  });
});
