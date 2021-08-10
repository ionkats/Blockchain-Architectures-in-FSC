
const EC = require('elliptic').ec;

// You can use any elliptic curve you want
const ec = new EC('secp256k1');

// Generate a new key pair and convert them to hex-strings
// const key = ec.genKeyPair();
// const publicKey = key.getPublic('hex');
// const privateKey = key.getPrivate('hex');

class Keys {
    genKeyPair() {
        // Generate a new key pair and convert them to hex-strings
        const key = ec.genKeyPair();
        const publicKey = key.getPublic('hex');
        this.publicKey = publicKey;
        const privateKey = key.getPrivate('hex');
        this.privateKey = privateKey;
        return [publicKey, privateKey];
    }


    // Print the keys to the console
    printKeys() {
        console.log();
        console.log('Your public key = ', this.publicKey);
        console.log('Your private key = ', this.privateKey);
        console.log();
    }
}

module.exports.Keys = Keys;