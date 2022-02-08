#!/usr/bin/env node
"use strict";
const promptly = require("promptly");
const crypto = require("crypto");
const CoinKey = require("coinkey");
const chalk = require("chalk");
const QRCode = require("qrcode");


const helpString = `
btcbrain transforms a passphrase into a valid BTC wallet.

Options:
-p              Show private key in WIF format.
-q              Show also QR code.
--help, -h      Show help.

Usage example:
ethbrain -p -q  #Show private key in WIF format and QR code. 

`


async function getPass() {
    return await promptly.password("Passphrase:", { replace: "*" })
}

async function main() {
    let print_private_key = false;
    let print_qrcode = false;

    if (process.argv.indexOf("-p") !== -1) {
        print_private_key = true;
    }

    if (process.argv.indexOf("-q") !== -1) {
        print_qrcode = true;
    }

    if (process.argv.indexOf("-h") !== -1 || process.argv.indexOf("--help") !== -1) {
        console.log(helpString);
        process.exit(0);
    }

    let pass = await getPass();
    var wallet = new CoinKey(crypto.createHash("sha256").update(pass).digest());

    console.log(chalk.yellow("Wallet address: ") + chalk.greenBright(wallet.publicAddress));
    if (print_qrcode) {
        console.log(await QRCode.toString(wallet.publicAddress, { type: 'terminal' }));
    }

    if (print_private_key) {
        if (print_qrcode) {
            console.log("\n");
        }
        console.log(chalk.yellow("Private Key: ") + chalk.grey(wallet.privateWif));
        if (print_qrcode) {
            console.log(await QRCode.toString(wallet.privateWif, { type: 'terminal' }));
        }
    } else {
        console.log(chalk.yellowBright("Private key not printed. Use -p flag to print it or -h to see all options"));
    }
    console.log("");
}

main();


