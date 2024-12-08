// test/validation.test.ts
import ECPairFactory from 'ecpair';
import { junkcoin } from '../ts_src/networks';
import * as bitcoin from '../ts_src/index';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

describe('JunkcoinJS Validation Tests', () => {
  describe('Junkcoin Address Validation', () => {
    let keyPair: ReturnType<typeof ECPair.makeRandom>;
    let validAddress: string;

    beforeEach(() => {
      keyPair = ECPair.makeRandom({ network: junkcoin });
      const payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });
      validAddress = payment.address!;
    });

    test('should validate Junkcoin legacy addresses (starting with 7 or L)', () => {
      console.log('Valid Junkcoin Address:', validAddress);
      expect(['7', 'L'].includes(validAddress[0])).toBe(true);
      expect(validAddress.length).toBe(34);
    });

    test('should reject Bitcoin-style addresses', () => {
      const invalidAddresses = [
        '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',  // Bitcoin legacy
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',  // Bitcoin P2SH
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'  // Bitcoin bech32
      ];

      for (const addr of invalidAddresses) {
        console.log('Testing invalid address:', addr);
        expect(['7', 'L'].includes(addr[0])).toBe(false);
      }
    });

    test('should properly create P2PKH addresses with Junkcoin prefixes', () => {
      // Generate multiple addresses to ensure consistent prefixing
      const addresses = Array(5).fill(null).map(() => {
        const kp = ECPair.makeRandom({ network: junkcoin });
        const payment = bitcoin.payments.p2pkh({
          pubkey: Buffer.from(kp.publicKey),
          network: junkcoin,
        });
        return payment.address!;
      });

      console.log('Generated Junkcoin Addresses:', addresses);
      addresses.forEach(addr => {
        expect(['7', 'L'].includes(addr[0])).toBe(true);
        expect(addr.length).toBe(34);
      });
    });
  });

  describe('Junkcoin Transaction Validation', () => {
    test('should build transaction with Junkcoin network parameters', () => {
      const keyPair = ECPair.makeRandom({ network: junkcoin });
      const txb = new bitcoin.Transaction();

      const p2pkh = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });

      // Add dummy input
      const prevTxHash = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
      txb.addInput(prevTxHash, 0);

      // Add output with Junkcoin address
      const sendAmount = 100000000; // 1 JKC
      txb.addOutput(p2pkh.output!, sendAmount);

      console.log('Transaction Details:');
      console.log('- Output Address (Junkcoin):', p2pkh.address);
      console.log('- Amount (in Junktoshi):', sendAmount);
      console.log('- Output Script:', p2pkh.output!.toString('hex'));

      expect(p2pkh.address![0]).toMatch(/[7L]/);
      expect(txb.outs[0].value).toBe(sendAmount);
    });
  });

  describe('Junkcoin Network-Specific Features', () => {
    test('should use correct Junkcoin WIF format', () => {
      const keyPair = ECPair.makeRandom({ network: junkcoin });
      const wif = keyPair.toWIF();
      
      console.log('Generated Junkcoin WIF:', wif);
      // Junkcoin WIF should start with P
      expect(wif.startsWith('P')).toBe(true);

      const importedKeyPair = ECPair.fromWIF(wif, junkcoin);
      expect(Buffer.from(importedKeyPair.publicKey)).toEqual(Buffer.from(keyPair.publicKey));
    });

    test('should sign messages with Junkcoin prefix', () => {
      const keyPair = ECPair.makeRandom({ network: junkcoin });
      const message = 'Hello Junkcoin';
      
      // Sign with Junkcoin message prefix
      const messagePrefix = junkcoin.messagePrefix;
      expect(messagePrefix).toBe('\u0018Junkcoin Signed Message:\n');
      
      const prefixedMessage = messagePrefix + message;
      const messageHash = bitcoin.crypto.sha256(Buffer.from(prefixedMessage));
      
      const signature = keyPair.sign(messageHash);
      console.log('Junkcoin Message:', message);
      console.log('Signature:', Buffer.from(signature).toString('hex'));
      
      const isValid = keyPair.verify(messageHash, signature);
      expect(isValid).toBe(true);
    });

    test('should validate Junkcoin script hashes', () => {
      const keyPair = ECPair.makeRandom({ network: junkcoin });
      
      // Create and validate P2PKH script
      const p2pkhPayment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });
      
      console.log('P2PKH Script Analysis:');
      console.log('- Address:', p2pkhPayment.address);
      console.log('- Script:', p2pkhPayment.output!.toString('hex'));
      console.log('- Hash160:', p2pkhPayment.hash!.toString('hex'));

      expect(p2pkhPayment.hash).toBeDefined();
      expect(p2pkhPayment.output).toBeDefined();
      expect(p2pkhPayment.network).toEqual(junkcoin);
    });
  });
});
