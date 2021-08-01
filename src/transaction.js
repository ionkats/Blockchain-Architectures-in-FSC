const crypto = require('crypto');

const session = 0;
const activeSessions = [];


class Transaction {

    constructor() {
        this.hasType = false;
        this.gasRequired = 0;
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

module.exports.Transaction = Transaction;