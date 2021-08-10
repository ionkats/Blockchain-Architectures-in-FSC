const { Keys } = require('./keygenerator');
const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

var flagForExtraLedger = false;
var keyPairs = {};
var counter = 0;
var ledgerCounter = 1;
var previousBlockTime;
var thisBlockTime;
// create the blockchain


while (true && counter<3) {
    var key = new Keys();
    var [publicKey, privateKey] = key.genKeyPair();
    key.printKeys();
    keyPairs[publicKey] = privateKey;

    if (counter === 0) {
        var miner = [publicKey, privateKey];
        // create genesis block
        var ledger1 = new Blockchain("ledger1");
        // eval('var ' + 'ledger' + ledgerCounter + '= ' + new Blockchain(String('ledger' + ledgerCounter)) + ';');
    }

    if ((thisBlockTime - previousBlockTime) >= 15) {
        // increase difficulty
    }
    counter++;
}

console.log(keyPairs);
// request and responds
// one single pont of failure?
// decentralized application, downloading the whole chain deciding where to send start of session