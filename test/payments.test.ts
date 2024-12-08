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
    test('should generate valid legacy address starting with 7 or L', () => {
      const payment: Payment = bitcoin.payments.p2pkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      expect(payment.address).toBeDefined();
      expect(['7', 'L'].includes(payment.address![0])).toBeTruthy();
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
      // OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
      expect(payment.output![0]).toBe(0x76); // OP_DUP
      expect(payment.output![1]).toBe(0xa9); // OP_HASH160
      expect(payment.output![payment.output!.length - 2]).toBe(0x88); // OP_EQUALVERIFY
      expect(payment.output![payment.output!.length - 1]).toBe(0xac); // OP_CHECKSIG
    });
  });

  describe('P2SH (Pay to Script Hash)', () => {
    test('should wrap P2PKH in P2SH correctly', () => {
      const p2wpkh = bitcoin.payments.p2wpkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      const payment: Payment = bitcoin.payments.p2sh({
        redeem: p2wpkh,
        network: junkcoin,
      });

      expect(payment.address).toBeDefined();
      expect(payment.redeem).toBeDefined();
      expect(payment.output).toBeDefined();
      expect(payment.hash).toBeDefined();
    });
  });

  describe('P2WPKH (Pay to Witness Public Key Hash)', () => {
    test('should generate valid witness program', () => {
      const payment: Payment = bitcoin.payments.p2wpkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      expect(payment.hash).toBeDefined();
      expect(payment.output).toBeDefined();
      expect(payment.witness).toBeUndefined(); // No witness data yet
    });
  });

  describe('P2PK (Pay to Public Key)', () => {
    test('should create valid P2PK output', () => {
      const payment: Payment = bitcoin.payments.p2pk({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      expect(payment.output).toBeDefined();
      expect(payment.pubkey).toEqual(pubkeyBuffer);
    });
  });

  describe('Multiple Payment Types Interaction', () => {
    test('should create nested P2WPKH in P2SH', () => {
      // Create a P2WPKH
      const p2wpkh = bitcoin.payments.p2wpkh({
        pubkey: pubkeyBuffer,
        network: junkcoin,
      });

      // Wrap it in P2SH
      const payment: Payment = bitcoin.payments.p2sh({
        redeem: p2wpkh,
        network: junkcoin,
      });

      expect(payment.address).toBeDefined();
      expect(payment.redeem?.output).toEqual(p2wpkh.output);
      expect(payment.output).toBeDefined();
    });

    test('should create valid P2MS (multisig) output', () => {
      const pubkeys = [
        Buffer.from(ECPair.makeRandom({ network: junkcoin }).publicKey),
        Buffer.from(ECPair.makeRandom({ network: junkcoin }).publicKey),
      ];

      const payment: Payment = bitcoin.payments.p2ms({
        m: 1,
        pubkeys,
        network: junkcoin,
      });

      expect(payment.output).toBeDefined();
      expect(payment.pubkeys?.length).toBe(2);
      expect(payment.m).toBe(1);
    });
  });
});
