import * as bitcoin from './junkcoinjs-lib'; // Update with your library path
import * as bip39 from 'bip39'; // For mnemonic generation
import * as bip32 from 'bip32'; // To generate keys

// Select the Junkcoin network
const junkcoin = bitcoin.networks.junkcoin;

// Generate a mnemonic and derive keys
const mnemonic = bip39.generateMnemonic();
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed, junkcoin);

// Derive the first account
const child = root.derivePath("m/44'/0'/0'/0/0"); // Change 0' to your Junkcoin-specific derivation if applicable

// Get the public key hash address
const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: junkcoin });

console.log('Mnemonic:', mnemonic);
console.log('Address:', address);
