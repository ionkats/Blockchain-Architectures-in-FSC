const crypto = require('crypto');


class Block {
    constructor(previousBlockHash, transactions, timestamp){
        this.previousBlockHash = previousBlockHash;
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.nonce = 0;
        this.blockHash = this.getHash();
    }


    getHash() {
        return crypto.createHash('sha256')
                    .update(String(this.previousBlockHash) + JSON.stringify(this.transactions) + String(this.timestamp) + String(this.nonce))
                    .digest('hex');
    }


    mineNewBlock(difficulty) {
        while (this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.blockHash = this.getHash();
        }
        console.log(`Block mined: ${this.blockHash}`);
    }


    checkValidity() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Block = Block;