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

- Easy to audit and verify,
- Tested, with test coverage >95%,
- Advanced and feature rich,
- Standardized, using [prettier](https://github.com/prettier/prettier) and Node `Buffer`'s throughout, and
- Friendly, with a strong and helpful community, ready to answer questions.

## Documentation
Presently, we do not have any formal documentation other than our [examples](#examples). Please [ask for help](https://github.com/nodecattel/junkcoinjs-lib/issues/new) if our examples aren't enough to guide you.

## How can I contact the developers outside of GitHub?
**Most of the time, this is not appropriate. Creating issues and pull requests in the open will help others with similar issues, so please try to use public issues and pull requests for communication.**

That said, sometimes developers might be open to taking things off the record (i.e., you want to share code that you don't want public to get help with it). In that case, please negotiate on the public issues as to where you will contact.

We have created public rooms on IRC (`#junkcoinjs` on `libera.chat`) and Matrix (`#junkcoinjs-dev:matrix.org`). These two channels have been joined together in a Matrix "Space" which has the Matrix room AND an IRC bridge room that can converse with the IRC room. The "Space" is `#junkcoinjs-space:matrix.org`.

Matrix and IRC both have functions for direct messaging, but IRC is not end-to-end encrypted, so Matrix is recommended for most communication. The official Matrix client maintained by the Matrix core team is called "Element" and can be downloaded here: https://element.io/download (Account creation is free on the matrix.org server, which is the default setting for Element.)

No, we will not make a Discord.

## Installation
``` bash
npm install junkcoinjs-lib
# optionally, install a key derivation library as well
npm install ecpair bip32
# ecpair is the ECPair class for single keys
# bip32 is for generating HD keys
```

Previous versions of the library included classes for key management (ECPair, HDNode(->"bip32")) but now these have been separated into different libraries. This lowers the bundle size significantly if you don't need to perform any crypto functions (converting private to public keys and deriving HD keys).

Typically we support the [Node Maintenance LTS version](https://github.com/nodejs/Release). TypeScript target will be set to the ECMAScript version in which all features are fully supported by current Active Node LTS.
However, depending on adoption among other environments (browsers, etc.), we may keep the target back a year or two.

**WARNING**: We presently don't provide any tooling to verify that the release on `npm` matches GitHub. As such, you should verify anything downloaded by `npm` against your own verified copy.

## Usage
Crypto is hard.

When working with private keys, the random number generator is fundamentally one of the most important parts of any software you write.
For random number generation, we *default* to the [`randombytes`](https://github.com/crypto-browserify/randombytes) module, which uses [`window.crypto.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues) in the browser, or Node.js' [`crypto.randomBytes`](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback), depending on your build system.
Although this default is ~OK, there is no simple way to detect if the underlying RNG provided is good enough, or if it is **catastrophically bad**.
You should always verify this yourself to your own standards.

This library uses [tiny-secp256k1](https://github.com/bitcoinjs/tiny-secp256k1), which uses [RFC6979](https://tools.ietf.org/html/rfc6979) to help prevent `k` re-use and exploitation.
Unfortunately, this isn't a silver bullet.
Often, JavaScript itself is working against us by bypassing these counter-measures.

Problems in [`Buffer (UInt8Array)`](https://github.com/feross/buffer), for example, can trivially result in **catastrophic fund loss** without any warning.
It can do this through undermining your random number generation, accidentally producing a [duplicate `k` value](https://www.nilsschneider.net/2013/01/28/recovering-bitcoin-private-keys.html), sending Junkcoin to a malformed output script, or any of a million different ways.
Running tests in your target environment is important and a recommended step to verify continuously.

Finally, **adhere to best practice**.
We are not an authoritative source of best practice, but, at the very least:

* [Don't reuse addresses](https://en.bitcoin.it/wiki/Address_reuse).
* Don't share BIP32 extended public keys ('xpubs'). [They are a liability](https://bitcoin.stackexchange.com/questions/56916/derivation-of-parent-private-key-from-non-hardened-child), and it only takes 1 misplaced private key (or a buggy implementation!) and you are vulnerable to **catastrophic fund loss**.
* [Don't use `Math.random`](https://security.stackexchange.com/questions/181580/why-is-math-random-not-designed-to-be-cryptographically-secure) - in any way - don't.
* Enforce that users always verify (manually) a freshly-decoded human-readable version of their intended transaction before broadcast.
* [Don't *ask* users to generate mnemonics](https://en.bitcoin.it/wiki/Brainwallet#cite_note-1), or 'brain wallets'; humans are terrible random number generators.
* Lastly, if you can, use [TypeScript](https://www.typescriptlang.org/) or similar.

### Browser
The recommended method of using `junkcoinjs-lib` in your browser is through [browserify](http://browserify.org/).

If you'd like to use a different (more modern) build tool than `browserify`, you can compile just this library and its dependencies into a single JavaScript file:

```sh
$ npm install junkcoinjs-lib browserify
$ npx browserify --standalone junkcoin - -o junkcoinjs-lib.js <<<"module.exports = require('junkcoinjs-lib');"
```

Which you can then import as an ESM module:

```javascript
<script type="module">import "/scripts/junkcoinjs-lib.js"</script>
```

**NOTE**: We use Node Maintenance LTS features. If you need strict ES5, use [`--transform babelify`](https://github.com/babel/babelify) in conjunction with your `browserify` step (using an [`es2015`](https://babeljs.io/docs/plugins/preset-es2015/) preset).

**WARNING**: iOS devices have [problems](https://github.com/feross/buffer/issues/136). Use at least [buffer@5.0.5](https://github.com/feross/buffer/pull/155) or greater, and enforce the test suites (for `Buffer`, and any other dependency) pass before use.

### TypeScript or VSCode Users
Type declarations for TypeScript are included in this library. Normal installation should include all the needed type information.

## Examples
The examples listed below are implemented as integration tests, which should be easy to understand. If you have additional use cases or feel examples are insufficient, feel free to [open an issue](https://github.com/nodecattel/junkcoinjs-lib/issues/new).

- [Generate a random address](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/addresses.spec.ts)
- [Import an address via WIF](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/addresses.spec.ts)
- [Generate a 2-of-3 P2SH multisig address](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/addresses.spec.ts)
- [Generate a SegWit address](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/addresses.spec.ts)
- [Create a 1-to-1 Transaction](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/transactions.spec.ts)
- [Create a Transaction with a SegWit input](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/transactions.spec.ts)
- [Create a Transaction and sign with an HDSigner interface (bip32)](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/transactions.spec.ts)
- [Import a BIP32 xpriv and export to WIF](https://github.com/nodecattel/junkcoinjs-lib/blob/main/test/integration/bip32.spec.ts)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).

### Running the test suite

```bash
npm test
npm run-script coverage
```

## Complementary Libraries
- [BIP21](https://github.com/bitcoinjs/bip21) - A BIP21 compatible URL encoding library
- [BIP38](https://github.com/bitcoinjs/bip38) - Passphrase-protected private keys
- [BIP39](https://github.com/bitcoinjs/bip39) - Mnemonic generation for deterministic keys
- [BIP32-Utils](https://github.com/bitcoinjs/bip32-utils) - A set of utilities for working with BIP32
- [Base58](https://github.com/cryptocoinjs/bs58) - Base58 encoding/decoding
- [Bech32](https://github.com/bitcoinjs/bech32) - A Bech32 encoding library

## Alternatives
- [BCoin](https://github.com/indutny/bcoin)
- [Bitcore](https://github.com/bitpay/bitcore)

## LICENSE [MIT](LICENSE)

