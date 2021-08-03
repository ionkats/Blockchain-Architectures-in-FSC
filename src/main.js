const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic curve used in ethereum
const {Transaction} = require('./transaction');
const {Blockchain} = require('./blockchain');

const privateKey = ec.keyFromPrivate('b5b4d99dabc9733ba8962910e58c3350c521f7657a161d8ea50de85671c7ab41');
const publicKey = privateKey.getPublic('hex');

console.log("line 7");
const ledger1 = new Blockchain("tryCoin");

console.log("line 10");
ledger1.mineBlock();

console.log("line 13");
const tx1 = new Transaction();
tx1.startSession(0, publicKey, 0x36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068, 0x36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145069);
tx1.signTransaction(privateKey);
ledger1.addTransaction(tx1);
console.log("line 17");

ledger1.mineBlock();
console.log("line 20");

console.log();
console.log('Blockchain valid?', ledger1.isChainValid() ? 'Yes' : 'No');

console.log(ledger1.chain);