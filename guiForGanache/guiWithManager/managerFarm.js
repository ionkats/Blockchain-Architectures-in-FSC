import contractABI from "./ABI.js";
import initialize from "./initalizer.js";

// put the address of the deployed smart contracts here
var smartContractAdresses;
var smartContractObjects;
var userAddresses;

// initialize the servers and deploy the contracts through initialize function
(userAddresses, smartContractAdresses, smartContractObjects) = initialize();
let numberOfServers = smartContractAdresses.length ;
console.log("There are " + numberOfServers + " chains currently running.");

// connect the transaction buttons
const startSessionButton = document.getElementById("newSession-button");
const endSessionButton = document.getElementById("endSession-button");
const HandoffButton = document.getElementById("Handoff-button");
const sensorButton = document.getElementById("Sensor-button");
const tracebackButton = document.getElementById("Traceback-button");


var activeSessions = [];
var sessionToUserID = {} // key: sessionID, value: current UserID for sanity checks of handoffs
var numberOfActiveSessions;
var sessionToBlockHash = {}; // dictionary key:sessionID, value: previous block hash that it passed
// a queue of transaction data for the traceback
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
        // transactionData.push(values);
        handler(values);
        // console.log(transactionData);
    }
}


async function startSessionEvent(values) {
    values["nameOfEvent"] = "startSession"; 
    transactionData.push(values);
    activeSessions.push(values.sessionID);
    numberOfActiveSessions += 1;
    // console.log(activeSessions);
}


async function handoffEvent(values) {
    values["nameOfEvent"] = "handoff"; 
    transactionData.push(values);
    // sessionToBlockHash[values.sessionID].push(values.previousStateBlockHash);
}


async function sensorLogEvent(values) {
    //do nothing?
}


async function endSessionEvent(values) {    
    values["nameOfEvent"] = "endSession"; 
    transactionData.push(values);
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
    tracebackButton.addEventListener("click", traceback);
}
addUiListeners();


// called when the start new session button is pressed
// initializes the new sessionID available and creates a random 6-digits number of userID
async function startTransaction() {
    // from this point forward to call the sensor transaction 
    // every 5 sec to be to the queue of pending transactions

    var userID = createUserID();

    // the the chain number from the userID
    var chainNumber = userToChainNumber(userID);
    console.log("Send to server: " + chainNumber + " from user: " + userID);

    // change appropriately with the amount of servers are opened
    var smartContract = smartContractObjects[chainNumber];
    var senderAddress = userAddresses[chainNumber];
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
                                                    // initialize the sensors for this session
                                                    initializeSensors(_sessionID);
                                                });
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
        // if (!(activeSessions.includes(_sessionID))){
        //     break;
        // }
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
        endTransaction = smartContract.methods.endSession(_sessionID, userID)
                                            .send({from: senderAddress})
                                            .on('receipt', function(receipt) {
                                                console.log("Session "+ _sessionID + " Ended.")
                                                sessionToBlockHash[String[_sessionID]].push(receipt.blockHash);
                                            });

        // stop the logging of sensors for this session
        eval('clearInterval(window.session' + _sessionID + ');');
        console.log("interval session" + _sessionID + " cleared.");
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
    
    // reset value to the placeholder
    document.getElementById("endSession-sessionId").value = "";
}


async function sensorTransaction(_sessionID) {
    var information = String(Math.random(98) + 1) + "C";
    try {
        // call the function from the smart contract
        var sensorTransaction = smartContract.methods.sensorLogging(
            _sessionID,
            information)
            .send({from: senderAddress});

        console.log("included sensor transaction");
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}


function createUserID() {
    return Math.floor(100000 + Math.random() * 900000);
}


async function initializeSensors(_sessionID) {
    console.log("Initialize interval for session" + _sessionID + ".");
    // repeat the interval session1, session2, etc very 5000milsec = 5sec.
    //window.variableName saves a global variable with dynamic naming for clearing the interval from another function
    eval('window.session' + _sessionID + ' = ' + setInterval(function() { sensorTransaction(_sessionID); }, 5000) + ';');
}


async function traceback(_sessionID) {
    var _sessionID = document.getElementById("Traceback-sessionId").value;
    
    var tracebackData = [];
    for (let i = 0; i < transactionData.length; i++) {
        if (transactionData[i].sessionID === _sessionID) {
            // add this event data to the end of the list
            tracebackData.push(transactionData[i]);
        }
    }

    console.log("The events for " + _sessionID + " are:");
    console.log(tracebackData);

}


// I want a function f: [9] -> [#servers] => f(x) = floor[x / (10/#servers)] with a max amount of servers of 10           
// e.g. for 2 servers f(4) = 4/5 = floor(0.8) = 0, f(5) = 1 => {0,1,2,3,4}->0, {5,6,7,8,9}->1
//      for 3 servers f(3) = fl(3/3.33) = 0, f(4) = 4/3.33 = 1, f(7) = 7/3.33 = 2 => {0,1,2,3}->0, {4,5,6}->1, {7,8,9}->2
function digitToServer(x) {
    return (Math.floor((x) / (10/numberOfServers)));
}


// get the first digit of the id number
function getFirstDigit(id) {
    return (Number(String(userID).charAt(0)));
}


// get the first digit of the userID and match it to a number from 0 to numberOfServers
function userToChainNumber(userID) {
    var firstDigit = getFirstDigit(userID);
    return (digitToServer(firstDigit));
}