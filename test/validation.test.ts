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

    test('should validate Junkcoin legacy addresses (starting with 7 or 8)', () => {
      console.log('Valid Junkcoin Address:', validAddress);
      expect(['7', '8'].includes(validAddress[0])).toBe(true);
      expect(validAddress.length).toBe(34);
    });

    test('should validate Junkcoin WIF format', () => {
      const wif = keyPair.toWIF();
      console.log('Generated WIF:', wif);
      expect(wif.startsWith('N')).toBe(true);
    });
  });
});
