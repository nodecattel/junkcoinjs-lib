# JunkcoinJS (junkcoinjs-lib)
[![Github CI](https://github.com/nodecattel/junkcoinjs-lib/actions/workflows/main_ci.yml/badge.svg)](https://github.com/nodecattel/junkcoinjs-lib/actions/workflows/main_ci.yml) [![NPM](https://img.shields.io/npm/v/junkcoinjs-lib.svg)](https://www.npmjs.org/package/junkcoinjs-lib) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A JavaScript Junkcoin library for Node.js and browsers. Written in TypeScript, but committing the JS files to verify.

Released under the terms of the [MIT LICENSE](LICENSE).

## Acknowledgments
Special thanks to the developers of [BitcoinJS](https://github.com/bitcoinjs/bitcoinjs-lib) and [LuckycoinJS](https://github.com/LuckyCoinProj/luckycoinjs-lib) for their inspiration and contributions to the crypto ecosystem. JunkcoinJS builds upon their exceptional work to provide a dedicated solution for Junkcoin.

## Should I use this in production?
If you are thinking of using the *master* branch of this library in production, **stop**.
Master is not stable; it is our development branch, and [only tagged releases may be classified as stable](https://github.com/nodecattel/junkcoinjs-lib/tags).

## Can I trust this code?
> Don't trust. Verify.

We recommend every user of this library and the [junkcoinjs](https://github.com/nodecattel/junkcoinjs-lib) ecosystem audit and verify any underlying code for its validity and suitability, including reviewing any and all of your project's dependencies.

Mistakes and bugs happen, but with your help in resolving and reporting [issues](https://github.com/nodecattel/junkcoinjs-lib/issues), together we can produce open source software that is:

- Easy to audit and verify
- Tested, with test coverage >95%
- Advanced and feature rich
- Standardized, using [prettier](https://github.com/prettier/prettier) and Node `Buffer`s throughout
- Friendly, with a strong and helpful community, ready to answer questions

## Features
- Junkcoin address generation and validation (Legacy addresses starting with '7' or 'L')
- Transaction building and signing
- Support for various payment types (P2PKH, P2SH, P2WPKH)
- Full TypeScript support
- Comprehensive test suite

## Installation
``` bash
npm install junkcoinjs-lib
# optionally, install key derivation libraries
npm install ecpair bip32
```

## Running Tests
```bash
# Install dependencies
npm install

# Run the test suite
npm test

# Run tests with coverage report
npm run coverage

# Watch mode during development
npm run test:watch
```

## Usage
Crypto is hard. Please note these important considerations:

1. The random number generator is crucial for security
2. We use the [`randombytes`](https://github.com/crypto-browserify/randombytes) module by default
3. This library uses [tiny-secp256k1](https://github.com/bitcoinjs/tiny-secp256k1) with [RFC6979](https://tools.ietf.org/html/rfc6979)
4. Verify everything in your target environment

Best practices:
* Don't reuse addresses
* Don't share BIP32 extended public keys ('xpubs')
* Don't use `Math.random`
* Have users verify decoded transactions before broadcast
* Don't generate mnemonics manually
* Use TypeScript or similar for better type safety

## Examples

### Generate a random address
```javascript
const junkcoinjs = require('junkcoinjs-lib');
const ECPair = require('ecpair');
const { junkcoin } = junkcoinjs.networks;

// Generate random key pair
const keyPair = ECPair.makeRandom({ network: junkcoin });

// Create P2PKH address
const { address } = junkcoinjs.payments.p2pkh({
  pubkey: Buffer.from(keyPair.publicKey),
  network: junkcoin,
});
```

### Import via WIF
```javascript
const keyPair = ECPair.fromWIF('YOUR_WIF_HERE', junkcoin);
const { address } = junkcoinjs.payments.p2pkh({
  pubkey: Buffer.from(keyPair.publicKey),
  network: junkcoin,
});
```

### Create Multi-sig Address
```javascript
const pubkeys = [
  Buffer.from(keyPair1.publicKey),
  Buffer.from(keyPair2.publicKey),
  Buffer.from(keyPair3.publicKey),
];

const { address } = junkcoinjs.payments.p2sh({
  redeem: junkcoinjs.payments.p2ms({
    m: 2,
    pubkeys,
    network: junkcoin,
  }),
  network: junkcoin,
});
```

## Network Parameters
Junkcoin specific network parameters:
- Message Prefix: '\u0018Junkcoin Signed Message:\n'
- Bech32 Prefix: 'jkc'
- Public Key Hash: 0x10
- Script Hash: 0x05
- WIF: 0x99
- BIP32 Public: 0x0488b21e
- BIP32 Private: 0x0488ade4

### Browser
The recommended method is through [browserify](http://browserify.org/):

```sh
npm install junkcoinjs-lib browserify
npx browserify --standalone junkcoin - -o junkcoinjs-lib.js <<<"module.exports = require('junkcoinjs-lib');"
```

Import as ESM module:
```javascript
<script type="module">import "/scripts/junkcoinjs-lib.js"</script>
```

## Development
```bash
# Build the project
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## Complementary Libraries
- [BIP21](https://github.com/bitcoinjs/bip21) - A BIP21 compatible URL encoding library
- [BIP38](https://github.com/bitcoinjs/bip38) - Passphrase-protected private keys
- [BIP39](https://github.com/bitcoinjs/bip39) - Mnemonic generation for deterministic keys
- [BIP32-Utils](https://github.com/bitcoinjs/bip32-utils) - A set of utilities for working with BIP32
- [Base58](https://github.com/cryptocoinjs/bs58) - Base58 encoding/decoding
- [Bech32](https://github.com/bitcoinjs/bech32) - A Bech32 encoding library

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## LICENSE
[MIT](LICENSE)
