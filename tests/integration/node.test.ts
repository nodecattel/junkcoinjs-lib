import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import assert from 'assert';
import {
  initEccLib,
  networks,
  payments,
  address,
  Transaction
} from '../../src/esm/index.js';

// Initialize libraries
initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

// RPC configuration
const rpcConfig = {
  protocol: 'http',
  host: '127.0.0.1',
  port: port,
  user: 'user',
  pass: 'password'
};

async function rpcCall(method: string, params: any[] = []) {
  try {
    const response = await fetch(`${rpcConfig.protocol}://${rpcConfig.host}:${rpcConfig.port}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${rpcConfig.user}:${rpcConfig.pass}`).toString('base64')
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'junkcoinjs-test',
        method: method,
        params: params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      console.error('RPC Error:', data.error);
      throw new Error(data.error.message);
    }
    return data.result;
  } catch (error) {
    console.error('RPC Call failed:', error);
    throw error;
  }
}

describe('Junkcoin Node Integration', () => {
  const testWallet = {
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    path: "m/44'/1'/0'/0/0"
  };

  let testAddress: string;
  let seed: Buffer;
  let child: any;

  before(async () => {
    seed = await bip39.mnemonicToSeed(testWallet.mnemonic);
    const root = bip32.fromSeed(seed);
    child = root.derivePath(testWallet.path);

    const { address: addr } = payments.p2pkh({
      pubkey: child.publicKey,
      network: networks.junkcoin
    });
    testAddress = addr!;

    console.log('\nTest address:', testAddress);
  });

  describe('Basic Node Connectivity', () => {
    it('should connect to node and get info', async () => {
      const info = await rpcCall('getinfo');
      console.log('\nNode info:', JSON.stringify(info, null, 2));
      assert(info.version !== undefined, 'Node should return version');
      assert(info.blocks !== undefined, 'Node should return block height');
    });

    it('should get blockchain info', async () => {
      const blockchainInfo = await rpcCall('getblockchaininfo');
      console.log('\nBlockchain info:', JSON.stringify(blockchainInfo, null, 2));
      assert(blockchainInfo.chain, 'Should return chain type');
      assert(blockchainInfo.blocks >= 0, 'Should have valid block height');
    });
  });

  describe('Address Validation', () => {
    it('should validate generated address', async () => {
      const validationInfo = await rpcCall('validateaddress', [testAddress]);
      console.log('\nAddress validation result:', JSON.stringify(validationInfo, null, 2));
      assert(validationInfo.isvalid, 'Generated address should be valid');
      console.log('\nScriptPubKey:', validationInfo.scriptPubKey);
    });

    it('should create valid addresses for both networks', () => {
      // Create mainnet address from our keypair
      const mainnetAddr = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoin
      }).address;

      // Create testnet address from same keypair
      const testnetAddr = payments.p2pkh({
        pubkey: child.publicKey,
        network: networks.junkcoinTestnet
      }).address;

      console.log('\nGenerated addresses:');
      console.log('Mainnet:', mainnetAddr);
      console.log('Testnet:', testnetAddr);

      // Verify addresses can be decoded
      assert.doesNotThrow(() => {
        address.toOutputScript(mainnetAddr!, networks.junkcoin);
      }, 'Should be valid mainnet address');

      assert.doesNotThrow(() => {
        address.toOutputScript(testnetAddr!, networks.junkcoinTestnet);
      }, 'Should be valid testnet address');
    });
  });

  describe('Network Parameters', () => {
    it('should verify network configuration', async () => {
      const netInfo = await rpcCall('getnetworkinfo');
      console.log('\nNetwork info:', JSON.stringify(netInfo, null, 2));
      
      // Verify network parameters
      console.log('\nNetwork parameters:');
      console.log('Mainnet:', {
        pubKeyHash: networks.junkcoin.pubKeyHash,
        scriptHash: networks.junkcoin.scriptHash,
        wif: networks.junkcoin.wif
      });
      
      console.log('Testnet:', {
        pubKeyHash: networks.junkcoinTestnet.pubKeyHash,
        scriptHash: networks.junkcoinTestnet.scriptHash,
        wif: networks.junkcoinTestnet.wif
      });

      // Print transaction fee info
      console.log('\nFee info:');
      console.log('Relay fee:', netInfo.relayfee);
      console.log('Incremental fee:', netInfo.incrementalfee);
    });
  });
});
