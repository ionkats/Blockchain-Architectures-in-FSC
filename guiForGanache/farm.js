import contractABI from "./ABI.js";
let smartContractAddress = "0x812bB35f555a37c3895Cf563DDAEF071dCa5f193";

const startSessionButton = document.getElementById("newSession-button");
const endSessionButton = document.getElementById("endSession-button");
const HandoffButton = document.getElementById("Handoff-button");
const sensorButton = document.getElementById("Sensor-button");

const web3 = new Web3 ("ws://localhost:7545");
const smartContract = new web3.eth.Contract(contractABI, smartContractAddress);
const senderAddress = "0x4F55a64D52c11B003415524c9a05ce812386FE5B";


let activeSessions = [];
let numberOfActiveSessions;
// dictionary key:sessionID, value: list of block hashes that it passed
let sessionToBlockHash = {}; 
// a queue of transaction data
let transactionData = [];
// var queue = [];
// queue.push(2);         // queue is now [2]
// queue.push(5);         // queue is now [2, 5]
// var i = queue.shift(); // queue is now [5]
// alert(i);

listenAllEvents();


function listenAllEvents() {
    smartContract.events.StartOfSession(specifiedEventHandler(startSessionEvent));
    smartContract.events.Handoff(specifiedEventHandler(handoffEvent));
    smartContract.events.SensorLog(specifiedEventHandler(sensorLogEvent));
    smartContract.events.EndOfSession(specifiedEventHandler(endSessionEvent));
}


function specifiedEventHandler(handler) {
    return function(error, result) {
        if (error) {
            console.error(error);
            return;
        }
    
        const values = result.returnValues;
        transactionData.push(values);
        handler(values);
        console.log(values)
    }
}

async function startSessionEvent(values) {
    activeSessions.push(values.sessionID);
    numberOfActiveSessions += 1;
}

async function handoffEvent(values) {
    sessionToBlockHash[values.sessionID].push(values.previousStateBlockHash);
}

async function sensorLogEvent(values) {
    //do nothing?
}

async function endSessionEvent(result) {    
    activeSessions.remove(values.sessionID);
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


async function getContractAddress() {
    var contractAddress = document.getElementById("contract-address-input");
    isEmpty(contractAddress);
    return contractAddress;
}


function isEmpty(item) {
    if (item === null) {
        throw new Error("Empty Item on input");
    }
}


async function startTransaction() {
    var _userId = document.getElementById("newSession-userId").value;
    var _previousStateBlockHash = document.getElementById("newSession-previousStateBlockHash").value;
    var _previousStateLedgerName = document.getElementById("newSession-previousStateLedgerName").value;
    
    isEmpty(_userId);
    isEmpty(_previousStateBlockHash);
    isEmpty(_previousStateLedgerName);

    try {
        startTransaction = smartContract.methods.startSession(
            _userId,
            _previousStateBlockHash,
            _previousStateLedgerName
            ).send({from: senderAddress});
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("newSession-userId").value = "";
    document.getElementById("newSession-previousStateBlockHash").value = "";
    document.getElementById("newSession-previousStateLedgerName").value = "";
}


async function handOffTransaction() {
    var _session = document.getElementById("Handoff-sessionId").value;  
    var _previousUserId = document.getElementById("Handoff-previousUserId").value;
    var _newuserId = document.getElementById("Handoff-newUserId").value;
    var _previousStateBlockHash = document.getElementById("Handoff-previousStateBlockHash").value;
    var _previousStateLedgerName = document.getElementById("Handoff-previousStateLedgerName").value;
    
    isEmpty(_session);
    isEmpty(_previousUserId);
    isEmpty(_newuserId);
    isEmpty(_previousStateBlockHash);
    isEmpty(_previousStateLedgerName);

    try {
        handOffTransaction = smartContract.methods.handoff(
            _session,
            _previousUserId,
            _newuserId,
            _previousStateBlockHash,
            _previousStateLedgerName
            ).send({from: senderAddress});
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("Handoff-sessionId").value = "";  
    document.getElementById("Handoff-previousUserId").value = "";
    document.getElementById("Handoff-newUserId").value = "";
    document.getElementById("Handoff-previousStateBlockHash").value = "";
    document.getElementById("Handoff-previousStateLedgerName").value = "";
}


async function sensorTransaction() {
    var _session = document.getElementById("Sensor-sessionId").value;  
    var _information = document.getElementById("Sensor-information").value;
    
    isEmpty(_session);
    isEmpty(_information);

    try {
        sensorTransaction = smartContract.methods.sensorLogging(
            _session,
            _information
            ).send({from: senderAddress});
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("Sensor-sessionId").value = ""; 
    document.getElementById("Sensor-information").value = ""; 
}


async function endTransaction() {
    var _session = document.getElementById("endSession-sessionId").value;  
    var _userId = document.getElementById("endSession-userId").value;

    isEmpty(_session);
    isEmpty(_userId);

    try {
        endTransaction = smartContract.methods.endSession(
            _session,
            _userId
            ).send({from: senderAddress});
    } catch (e) {
        console.error(e);
        alert(e.message);
    }

    document.getElementById("endSession-sessionId").value = "";
    document.getElementById("endSession-userId").value = "";
}



