# btcbrain
Transforms a passphrase into a valid BTC wallet.

It uses the SHA256 Hash function to derivate private key from passphrase.

## Why?
I needed a way to regain access to my wallets without depending on any physical instrument.

## Install
`npm install -g btcbrain`

## ... Or run directly
`npx btcbrain`

## Usage
```
btcbrain transforms a passphrase into a valid BTC wallet.

Options:
-p              Show private key in WIF format.
-q              Show also QR code.
--help, -h      Show help.

Usage example:
btcbrain -p -q  #Show private key in WIF format and QR code. 
```

## Tips
You can access your account with a wallet capable of importing private keys in **wif** format (Wallet Import Format) like [Electrum](https://electrum.org/#download).

Do not use simple phrases as these are vulnerable to dictionary attacks.


