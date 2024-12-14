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

    test('should generate valid P2PKH address starting with 7 or 8', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(keyPair.publicKey),
        network: junkcoin,
      });

      console.log('Generated P2PKH Address:', payment.address);
      console.log('First Character of Address:', payment.address![0]);

      expect(payment.address).toBeDefined();
      expect(['7', '8'].includes(payment.address![0])).toBeTruthy(); // Corrected prefix
      expect(payment.address!.length).toBe(34);
    });

    test('should generate valid P2SH address', () => {
      const payment: Payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: Buffer.from(keyPair.publicKey),
          network: junkcoin,
        }),
        network: junkcoin,
      });

      console.log('Generated P2SH Address:', payment.address);
      expect(payment.address).toBeDefined();
      expect(payment.address!.startsWith('3')).toBeTruthy();
    });

    test('should generate valid WIF', () => {
      const wif = keyPair.toWIF();
      console.log('Generated WIF:', wif);
      expect(wif[0]).toBe('N'); // Junkcoin WIF should start with 'N'
    });
  });
});
