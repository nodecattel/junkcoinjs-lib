import ECPairFactory from 'ecpair';
import { junkcoin, testnet } from '../ts_src/networks';
import * as bitcoin from '../ts_src/index';
import { Payment } from '../ts_src/payments';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

describe('JunkcoinJS Address Tests', () => {
  describe('Mainnet Address Generation', () => {
    let keyPair: ReturnType<typeof ECPair.makeRandom>;
    
    beforeEach(() => {
      keyPair = ECPair.makeRandom({ network: junkcoin });
    });

    test('should generate valid mainnet P2PKH address', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });
      console.log('Generated Mainnet P2PKH Address:', payment.address);
      expect(payment.address).toBeDefined();
      // Update regex to match addresses starting with 7
      expect(payment.address).toMatch(/^[7][a-km-zA-HJ-NP-Z1-9]{33}$/);
      expect(payment.address!.length).toBe(34);
    });

    test('should generate valid mainnet P2SH address', () => {
      const payment: Payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: Buffer.from(keyPair.publicKey),
          network: junkcoin,
        }),
        network: junkcoin,
      });
      console.log('Generated Mainnet P2SH Address:', payment.address);
      expect(payment.address).toBeDefined();
      expect(payment.address!.startsWith('3')).toBeTruthy();
    });

    test('should generate valid mainnet WIF', () => {
      const wif = keyPair.toWIF();
      console.log('Generated Mainnet WIF:', wif);
      // Update to expect 'N' prefix for mainnet WIF
      expect(wif[0]).toBe('N');
    });
  });

  describe('Testnet Address Generation', () => {
    let testnetKeyPair: ReturnType<typeof ECPair.makeRandom>;
    
    beforeEach(() => {
      testnetKeyPair = ECPair.makeRandom({ network: testnet });
    });

    test('should generate valid testnet P2PKH address', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(testnetKeyPair.publicKey),
        network: testnet,
      });
      console.log('Generated Testnet P2PKH Address:', payment.address);
      expect(payment.address).toBeDefined();
      // Update regex to match your testnet address format
      expect(payment.address).toMatch(/^[7][a-km-zA-HJ-NP-Z1-9]{33}$/);
      expect(payment.address!.length).toBe(34);
    });

    test('should generate valid testnet P2SH address', () => {
      const payment: Payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: Buffer.from(testnetKeyPair.publicKey),
          network: testnet,
        }),
        network: testnet,
      });
      console.log('Generated Testnet P2SH Address:', payment.address);
      expect(payment.address).toBeDefined();
      expect(payment.address!.startsWith('3')).toBeTruthy();
    });

    test('should generate valid testnet WIF', () => {
      const wif = testnetKeyPair.toWIF();
      console.log('Generated Testnet WIF:', wif);
      // Update to expect 'c' prefix for testnet WIF
      expect(wif[0]).toBe('c');
    });
  });
});
