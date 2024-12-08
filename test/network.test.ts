// test/network.test.ts
import { Network, junkcoin } from '../ts_src/networks';

describe('JunkcoinJS Network Tests', () => {
  test('should have correct network parameters', () => {
    const network: Network = junkcoin;
    
    expect(network.messagePrefix).toBe('\u0018Junkcoin Signed Message:\n');
    expect(network.bech32).toBe('jkc');
    expect(network.pubKeyHash).toBe(0x10);
    expect(network.scriptHash).toBe(0x05);
    expect(network.wif).toBe(0x99);
  });

  test('should have correct BIP32 parameters', () => {
    expect(junkcoin.bip32.public).toBe(0x0488b21e);
    expect(junkcoin.bip32.private).toBe(0x0488ade4);
  });
});
