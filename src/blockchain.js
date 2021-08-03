const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic curve used in ethereum
const {Block} = require('./block');
const {Transaction} = require('./transaction');


class Blockchain {

    constructor(ledgerName) {
        this.chain = [this.genesisBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.ledgerName = ledgerName;
    }


    genesisBlock() {
        return new Block("", [], Date.parse("2021-01-01"));
    }


    lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // every 15" a block is mined
    mineBlock() {
        const blockMined = new Transaction();
        // console.log(`Gas: ${blockMined.miningTransaction().gasRequired}`);
        blockMined.miningTransaction();
        this.pendingTransactions.unshift(blockMined);
        var remainingGas = 15000000;
        const blockTransactions = [];
        while (remainingGas >= 0 && this.pendingTransactions.length !== 0){
            blockTransactions.push(this.pendingTransactions[0]);
            remainingGas -= this.pendingTransactions[0].gasRequired;
            this.pendingTransactions.shift(); // removes first element of array
        }
        console.log(`Transactions remaining: ${this.pendingTransactions.length}`);
        const block = new Block(this.lastBlock().blockHash, blockTransactions, Date.now());
        block.mineNewBlock(this.difficulty);
        console.log('Block succesfully mined');
        this.chain.push(block);
        // console.log(`Transactions remaining: ${this.pendingTransactions.length}`);
        
    }


    addTransaction(transaction) {
        if (!transaction.hasType) {
            throw new Error('Transaction must have a specific type');
        }

        if (!transaction.isValid()) {
            throw new Error('Transaction not valid');
        }


        this.pendingTransactions.push(transaction);
        console.log('Transaction added: %s', transaction);
    }


    isChainValid() {
        const validGenesisBlock = JSON.stringify(this.genesisBlock());
        // console.log(validGenesisBlock, "kk", JSON.stringify(this.chain[0]));
        if (validGenesisBlock !== JSON.stringify(this.chain[0])) {
            return false;
        }
        // console.log("not the genesis");
        // console.log("this.chain.length= ", this.chain.length);
        for (var i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            // console.log(previousBlock.blockHash, "kk", currentBlock.previousBlockHash);
            if (previousBlock.blockHash !== currentBlock.previousBlockHash) {
                return false;
            }
            // console.log(i, "not previous block hash");

            if (!currentBlock.checkValidity()) {
                return false;
            }
            // console.log(i, "not block validity");

            if (currentBlock.blockHash !== currentBlock.getHash()) {
                return false;
            }
            // console.log(i, "not current block hash");
        }
        return true;
    }
}


module.exports.Blockchain = Blockchain;