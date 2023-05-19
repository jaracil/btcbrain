#!/usr/bin/env node
"use strict";
const promptly = require('promptly');
const crypto = require('crypto');
const { promisify } = require('util');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { ECPairFactory } = require('ecpair');
const chalk = require('chalk');
const QRCode = require('qrcode');


const helpString = `
btcbrain transforms a passphrase into a valid BTC wallet.

Options:
-l              Generate legacy address.
-s              Use scrypt instead of sha256.
-p              Show private key in WIF format.
-q              Show also QR code.
--help, -h      Show help.

Usage examples:

$> btcbrain -p -q  #Show private key in WIF format and QR code.

$> btcbrain -s  #Generate address using more secure scrypt hash. 

`

const ECPair = ECPairFactory(ecc);

async function getPass() {
    return await promptly.password("Passphrase:", { replace: "*" })
}

async function main() {
    let print_private_key = false;
    let print_qrcode = false;
    let legacyAddress = false;
    let use_scrypt = false

    if (process.argv.indexOf('-l') !== -1) {
        legacyAddress = true;
    }

    if (process.argv.indexOf('-s') !== -1) {
        use_scrypt = true;
    }

    if (process.argv.indexOf('-p') !== -1) {
        print_private_key = true;
    }

    if (process.argv.indexOf('-q') !== -1) {
        print_qrcode = true;
    }

    if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
        console.log(helpString);
        process.exit(0);
    }

    let pass = await getPass();
    let hash
    if (use_scrypt) {
        hash =  await promisify(crypto.scrypt)(pass, 'salt', 32);
    } else {
        hash = crypto.createHash('sha256').update(pass).digest();
    } 
        

    const keyPair = ECPair.fromPrivateKey(hash);

    let address;
    if (!legacyAddress) {
        address = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }).address;
    } else {
        address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
    }


    console.log(chalk.yellow('Wallet address: ') + chalk.greenBright(address));
    if (print_qrcode) {
        console.log(await QRCode.toString(address, { type: 'terminal' }));
    }

    if (print_private_key) {
        let pk = keyPair.toWIF()
        if (!legacyAddress) {
            pk = 'p2wpkh:' + pk
        }
        if (print_qrcode) {
            console.log("\n");
        }
        console.log(chalk.yellow('Private Key: ') + chalk.grey(pk));
        if (print_qrcode) {
            console.log(await QRCode.toString(pk, { type: 'terminal' }));
        }
    } else {
        console.log(chalk.yellowBright('Private key not printed. Use -p flag to print it or -h to see all options'));
    }
    console.log("");
}

main();


