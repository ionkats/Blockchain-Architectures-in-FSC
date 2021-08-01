const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic curve used in ethereum


const session = 0;
const activeSessions = [];


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
                    .update(this.previousBlockHash + JSON.stringify(this.transactions) + this.timestamp + this.nonce)
                    .digest('hex');
    }


    mineNewBlock(difficulty) {
        while (this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
      
        debug(`Block mined: ${this.blockHash}`);
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


class Transaction {
    startSession(sessionID, userID, previousStateBlockHash, previousStateLedgerName) {
        if (sessionID === 0) {
            this.sessionID = this.getNextSessionID();
        } else {
            if (!activeSessions.includes(sessionID)) {
                throw new Error('This session is not active, put 0 for new session activation.');
            }
            this.sessionID = sessionID;
        }
        this.userID = userID;
        this.previousStateBlockHash = previousStateBlockHash;
        this.previousStateLedgerName = previousStateLedgerName;
        this.timestamp = Date.now();
        activeSessions.push(this.sessionID);
        this.gasRequired = 70760;
    }


    endSession(sessionID, userID) {
        this.checkActiveSession(sessionID);
        this.sessionID = sessionID;
        this.userID = userID;
        this.timestamp = Date.now();
        activeSessions.remove(this.sessionID);
        this.gasRequired = 14627; 
    }


    handoverSession(sessionID, previousUserID, newUserID, previousStateBlockHash, previousStateLedgerName) {
        this.checkActiveSession(sessionID);
        this.sessionID = sessionID;
        this.previousUserID = previousUserID;
        this.newUserID = newUserID;
        this.previousStateBlockHash = previousStateBlockHash;
        this.previousStateLedgerName = previousStateLedgerName;
        this.timestamp = Date.now();
        this.gasRequired = 30407;
    }


    sensorData(sessionID, information) {
        this.checkActiveSession(sessionID);
        this.sessionID = sessionID;
        this.info = information;
        this.timestamp = Date.now();
        this.gasRequired = (information.length)*2540;
    }


    miningTransaction() {

    }


    checkActiveSession(sessionID) {
        if (!activeSessions.includes(sessionID)) {
            throw new Error('This session is not active');
        }
    }


    getNextSessionID() {
        session++;
        return session;
    }


    isValid() {
        return true
    }
}


class Blockchain {
    constructor(ledgerName) {
        this.chain = [this.genesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.ledgerName = ledgerName;
    }


    genesisBlock() {
        return new Block("", [], Date.now());
    }


    lastBlock() {
        return this.chain[this.chain.length - 1];
    }


    mineTransactions() {
        
    }
}


module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
module.exports.Block = Block;