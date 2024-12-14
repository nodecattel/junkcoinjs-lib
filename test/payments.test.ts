// test/payments.test.ts
import ECPairFactory from 'ecpair';
import { junkcoin } from '../ts_src/networks';
import * as bitcoin from '../ts_src/index';
import { Payment } from '../ts_src/payments';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

describe('JunkcoinJS Payment Tests', () => {
  let keyPair: ReturnType<typeof ECPair.makeRandom>;
  let pubkeyBuffer: Buffer;

  beforeEach(() => {
    keyPair = ECPair.makeRandom({ network: junkcoin });
    pubkeyBuffer = Buffer.from(keyPair.publicKey);
  });

  describe('P2PKH (Pay to Public Key Hash)', () => {
    test('should generate valid legacy address starting with 7 or 8', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      console.log('Generated P2PKH Address:', payment.address);
      console.log('First Character of Address:', payment.address![0]);

      expect(payment.address).toBeDefined();
      expect(['7', '8'].includes(payment.address![0])).toBeTruthy(); // Corrected prefix
      expect(payment.address!.length).toBe(34);
      expect(payment.hash).toBeDefined();
      expect(payment.output).toBeDefined();
    });

    test('should have correct output script', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      expect(payment.output!.length).toBeGreaterThan(3);
      expect(payment.output![0]).toBe(0x76); // OP_DUP
      expect(payment.output![1]).toBe(0xa9); // OP_HASH160
      expect(payment.output![payment.output!.length - 2]).toBe(0x88); // OP_EQUALVERIFY
      expect(payment.output![payment.output!.length - 1]).toBe(0xac); // OP_CHECKSIG
    });
  });
});
