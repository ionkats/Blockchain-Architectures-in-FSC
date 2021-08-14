import contractABI from "../ABI.js";

// put the address of the deployed smart contract here
var smartContractAddress = "0xfe3fc1f0FdAAB4CE1A1e47e49E9a563eee42E073";

// connect the transaction buttons
const startSessionButton = document.getElementById("newSession-button");
const endSessionButton = document.getElementById("endSession-button");
const HandoffButton = document.getElementById("Handoff-button");
const sensorButton = document.getElementById("Sensor-button");

// address of the server
const web3 = new Web3 ("ws://localhost:7545");
// create the object of the smart contract
const smartContract = new web3.eth.Contract(contractABI, smartContractAddress);
// put the address of a specified sender for the transactions
const senderAddress = "0xF90fbB93A02742Bbb25732344C13c4d7Ecf0E4c2";


var activeSessions = [];
var sessionToUserID = {} // key: sessionID, value: current UserID for sanity checks of handoffs
var numberOfActiveSessions;
var sessionToBlockHash = {}; // dictionary key:sessionID, value: previous block hash that it passed
// a queue of transaction data
var transactionData = [];


function listenAllEvents() {
    smartContract.events.StartOfSession(specifiedEventHandler(startSessionEvent));
    smartContract.events.Handoff(specifiedEventHandler(handoffEvent));
    smartContract.events.SensorLog(specifiedEventHandler(sensorLogEvent));
    smartContract.events.EndOfSession(specifiedEventHandler(endSessionEvent));
}
listenAllEvents();


function specifiedEventHandler(handler) {
    return function(error, result) {
        if (error) {
            console.error(error);
            return;
        }
    
        const values = result.returnValues;
        transactionData.push(values);
        handler(values);
        // console.log(transactionData);
    }
}


async function startSessionEvent(values) {
    activeSessions.push(values.sessionID);
    numberOfActiveSessions += 1;
    // console.log(activeSessions);
}


async function handoffEvent(values) {
    // sessionToBlockHash[values.sessionID].push(values.previousStateBlockHash);
}


async function sensorLogEvent(values) {
    //do nothing?
}


async function endSessionEvent(values) {    
    var sessionIndex = activeSessions.indexOf(values.sessionID);
    activeSessions.splice(sessionIndex, 1);
    numberOfActiveSessions -= 1;
}


function addUiListeners() {
    // specified transactions
    startSessionButton.addEventListener("click", startTransaction);
    endSessionButton.addEventListener("click", endTransaction);
    HandoffButton.addEventListener("click", handOffTransaction);
    sensorButton.addEventListener("click", sensorTransaction);
}
addUiListeners();


// called when the start new session button is pressed
// initializes the new sessionID available and creates a random 6-digits number of userID
async function startTransaction() {
    // from this point forward to call the sensor transaction 
    // every 5 sec to be to the queue of pending transactions
    var userID = createUserID();

    try {
        // call the function from the smart contract
        startTransaction = smartContract.methods.startSession(userID)
                                                .send({from: senderAddress})
                                                .then(function(receipt){ // called on event
                                                    // console.log(receipt);
                                                    var _sessionID = receipt.events.StartOfSession.returnValues.sessionID;
                                                    console.log("Session "+ _sessionID + " Activated.");
                                                    sessionToBlockHash[String[_sessionID]] = [receipt.blockHash]; 
                                                    sessionToUserID[String[_sessionID]] = userID;
                                                });
        initializeSensors();
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}


async function handOffTransaction() {

    var _sessionID = document.getElementById("Handoff-sessionId").value;
    var _userID;
    var same = false;
    while (!same) {
        _userID = createUserID();
        same = (_userID===sessionToUserID[String[_sessionID]]) ? false : true;
    }
    // get the last item of the block hashes of this session
    var hashArray = sessionToBlockHash[String[_sessionID]];
    var previousBlockHash = hashArray[hashArray.length - 1]; 
    try {
        
        // call the function from the smart contract
        handOffTransaction = smartContract.methods.handoff(
            _sessionID,
            sessionToUserID[String[_sessionID]], // previous userID
            _userID, // new userID
            previousBlockHash,
            previousBlockHash // currently for the previous ledger name
            ).send({from: senderAddress})
            .on('receipt', function(receipt) {
                console.log("Session "+ _sessionID + " Handed off.");
                sessionToBlockHash[String[_sessionID]].push(receipt.blockHash); // same previous block hash
                sessionToUserID[String[_sessionID]] = _userID; // save new userID
            });
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("Handoff-sessionId").value = "";
}


async function endTransaction() {
    var _sessionID = document.getElementById("endSession-sessionId").value;
    var userID = sessionToUserID[String[_sessionID]];

    try {
        // call the function from the smart contract
        endTransaction = smartContract.methods.endSession(
            _sessionID,
            userID
            ).send({from: senderAddress})
            .on('receipt', function(receipt) {
                console.log("Session "+ _sessionID + " Ended.")
                sessionToBlockHash[_sessionID].push(receipt.blockHash);
            });
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("endSession-sessionId").value = "";
}


 async function sensorTransaction(_sessionID) {
    var information = String(Math.random(98) + 1) + "C";
    try {
        // call the function from the smart contract
        sensorTransaction = smartContract.methods.sensorLogging(
            _sessionID,
            information)
            .send({from: senderAddress});
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}


function createUserID() {
    return Math.floor(100000 + Math.random() * 900000);
}


function initializeSensors() {
    
}