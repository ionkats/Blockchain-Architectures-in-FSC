const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic curve used in ethereum
const {Transaction} = require('./transaction');
const {Blockchain} = require('./blockchain');

const ledger1 = new Blockchain("tryCoin");

ledger1.mineBlock();

const tx1 = new Transaction();
tx1.startSession(0, 3343, 0x36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068, 0x36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145069);
ledger1.addTransaction(tx1);

const tx2 = new Transaction();
ledger1.addTransaction(tx2);

ledger1.mineBlock();


console.log();
console.log('Blockchain valid?', ledger1.isChainValid() ? 'Yes' : 'No');