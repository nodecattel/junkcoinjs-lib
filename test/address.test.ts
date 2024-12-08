// test/address.test.ts
import ECPairFactory from 'ecpair';
import { junkcoin } from '../ts_src/networks';
import * as bitcoin from '../ts_src/index';
import { Payment } from '../ts_src/payments';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

describe('JunkcoinJS Address Tests', () => {
  describe('Address Generation', () => {
    let keyPair: ReturnType<typeof ECPair.makeRandom>;

    beforeEach(() => {
      keyPair = ECPair.makeRandom({ network: junkcoin });
    });

    test('should generate valid P2PKH address', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });

      expect(payment.address).toBeDefined();
      expect(['7', 'L'].includes(payment.address![0])).toBeTruthy();
      expect(payment.address!.length).toBe(34);
    });

    test('should generate unique addresses for different keypairs', () => {
      const keyPair2 = ECPair.makeRandom({ network: junkcoin });

      const payment1: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });

      const payment2: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair2.publicKey),
        network: junkcoin,
      });

      expect(payment1.address).not.toBe(payment2.address);
    });

    test('should generate valid P2SH address', () => {
      const payment: Payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: Buffer.from(keyPair.publicKey),
          network: junkcoin,
        }),
        network: junkcoin,
      });

      expect(payment.address).toBeDefined();
      expect(payment.address!.startsWith('3')).toBeTruthy();
    });
  });

  describe('Key Import/Export', () => {
    test('should import private key from WIF', () => {
      const originalKeyPair = ECPair.makeRandom({ network: junkcoin });
      const wif = originalKeyPair.toWIF();
      
      const importedKeyPair = ECPair.fromWIF(wif, junkcoin);
      
      const originalPubKey = Buffer.from(originalKeyPair.publicKey);
      const importedPubKey = Buffer.from(importedKeyPair.publicKey);
      
      expect(importedPubKey).toEqual(originalPubKey);
    });

    test('should fail on invalid WIF import', () => {
      expect(() => {
        ECPair.fromWIF('invalid-wif', junkcoin);
      }).toThrow();
    });
  });
});
