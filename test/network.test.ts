// test/network.test.ts
import { junkcoin } from '../ts_src/networks';

describe('JunkcoinJS Network Tests', () => {
  test('should have correct network parameters', () => {
    const network = junkcoin;

    // Message prefix
    expect(network.messagePrefix).toBe('\u0018Junkcoin Signed Message:\n');
    console.log('Message Prefix:', network.messagePrefix);

    // Bech32 (SegWit)
    expect(network.bech32).toBe('jc1q');
    console.log('SegWit Prefix:', network.bech32);

    // Bech32m (Taproot)
    expect(network.bech32m).toBe('jc1p');
    console.log('Taproot Prefix:', network.bech32m);

    // PubKeyHash (Legacy address version)
    expect(network.pubKeyHash).toBe(0x11);
    console.log(
      'PubKeyHash (Legacy address version):',
      `0x${network.pubKeyHash.toString(16)} (${network.pubKeyHash})`,
    );

    // ScriptHash (P2SH address version)
    expect(network.scriptHash).toBe(0x05);
    console.log(
      'ScriptHash (P2SH address version):',
      `0x${network.scriptHash.toString(16)} (${network.scriptHash})`,
    );

    // WIF (Wallet Import Format prefix)
    expect(network.wif).toBe(0x90);
    console.log('WIF prefix:', `0x${network.wif.toString(16)} (${network.wif})`);

    // BIP32 Parameters
    expect(network.bip32.public).toBe(0x0488b21e);
    console.log(
      'BIP32 Public Key:',
      `0x${network.bip32.public.toString(16)} (${network.bip32.public})`,
    );

    expect(network.bip32.private).toBe(0x0488ade4);
    console.log(
      'BIP32 Private Key:',
      `0x${network.bip32.private.toString(16)} (${network.bip32.private})`,
    );
  });
});
