const crypto = require('crypto');

var session = 0;
var activeSessions = [];


class Transaction {

    constructor() {
        this.hasType = false;
        this.gasRequired = 0;
    }

    getTransactionHash(){
        if (this.previousStateBlockHash !== undefined) {
            // start session transaction
            return crypto.createHash('sha256').update(this.sessionID + this.userIDID + this.previousStateBlockHash + this.previousStateLedgerName + this.timestamp).digest('hex');
        }

        if (this.userID !== undefined) {
            // end session transaction
            return crypto.createHash('sha256').update(this.sessionID + this.userID + this.timestamp).digest('hex');
        }

        if (this.information !== undefined) {
            // sensor data transaction
            return crypto.createHash('sha256').update(this.sessionID + this.information + this.timestamp).digest('hex');
        }

        if (this.newUserID !== undefined) {
            // handoff session transaction
            return crypto.createHash('sha256').update(this.sessionID + this.previousUserID + this.newUserID + this.previousStateBlockHash + this.previousStateLedgerName + this.timestamp).digest('hex');
        }
       
        // mining transaction
        return crypto.createHash('sha256').update(this.timestamp).digest('hex');
    }

    startSession(sessionID = 0, userID, previousStateBlockHash, previousStateLedgerName) {
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
        this.hasType = true;
    }


    endSession(sessionID, userID) {
        this.checkActiveSession(sessionID);
        this.sessionID = sessionID;
        this.userID = userID;
        this.timestamp = Date.now();
        activeSessions.remove(this.sessionID);
        this.gasRequired = 14627; 
        this.hasType = true;
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
        this.hasType = true;
    }


    sensorData(sessionID, information) {
        this.checkActiveSession(sessionID);
        this.sessionID = sessionID;
        this.info = information;
        this.timestamp = Date.now();
        this.gasRequired = (information.length)*2540;
        this.hasType = true;
    }


    miningTransaction() {
        this.timestamp = Date.now();
        this.gasRequired = 0;
        this.hasType = true;
    }

    signTransaction(signKey) {
        if (this.userID !== undefined) {
            if (signKey.getPublic('hex') !== this.userID) {
                throw new Error('You cannot sign transactions with another userID.')
            }
        } else if (this.newUserID !== undefined) {
            if (signKey.getPublic('hex') !== this.newUserID) {
                throw new Error('You cannot sign transactions with another userID.')
            }
        } else {
            // it is a mining transaction, the miner must sign it.
        }

        const transactionHash = this.getTransactionHash();
        const signature = signKey.sign(transactionHash, 'base64');

        this.signature = signature.toDER('hex');
    }

    checkActiveSession(sessionID) {
        if (!activeSessions.includes(sessionID)) {
            throw new Error('This session is not active');
        }
    }
    

    getNextSessionID() {
        session += 1;
        return session;
    }


    isValid() {
        if (this.sessionID === undefined || this.information !== undefined) return true;

        if (!this.signature || this.signature.length ===0) {
            throw new Error('No signature in this transaction');
        }

        if (this.newUserID !== undefined) {
            const publicKey = ec.keyFromPublic(this.newUserID, 'hex');
            return publicKey.verify(this.getHash(), this.signature);
        }

        if (this.userID !== undefined) {
            const publicKey = ec.keyFromPublic(this.userID, 'hex');
            return publicKey.verify(this.getHash(), this.signature);
        }
        
        console.log('Didn\'t get into any of the cases.')
        return false
    }
}

module.exports.Transaction = Transaction;