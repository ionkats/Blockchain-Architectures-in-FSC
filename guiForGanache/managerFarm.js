import contractABI from "./ABI.js"
import {initialize} from "./initializer.js"
import {initializeWithoutData} from "./initializerWithoutData.js"
import {random} from "./initializerWithoutData.js"

// put the address of the deployed smart contracts here
var smartContractAddresses = []
var smartContractObjects = []
var userAddresses = []

// uncomment to initialize the servers and get the addresses of already deployed contracts 

// [userAddresses, smartContractObjects, smartContractAddresses] = initialize()
// var deployed = true
// listenAllEvents()


// uncomment to initialize servers and deploy the contracts from scratch

[userAddresses, smartContractObjects, smartContractAddresses] = initializeWithoutData()
var deployed = false
setTimeout(function () {
    deployed = true
    listenAllEvents()
}, 31000) // wait for 31 seconds for the contracts to be surely deployed (block every 30s)


smartContractAddresses = Array(smartContractAddresses)
let numberOfServers = smartContractAddresses.length
console.log("There are " + numberOfServers + " chains currently running.")

// connect the UI buttons
const startSessionButton = document.getElementById("newSession-button")
const endSessionButton = document.getElementById("endSession-button")
const HandoffButton = document.getElementById("Handoff-button")
const tracebackButton = document.getElementById("Traceback-button")

var activeSessions = []
var sessionToUserID = {} // key: sessionID, value: current UserID for sanity checks of handoffs
var sessionToTransactionHash = {} // dictionary key:sessionID, value: previous transaction hash that it passed
// a queue of transaction data for the traceback
var transactionData = []
var sessionToChain = {}
var firstHandoff = true


// listen to all events from all the servers
async function listenAllEvents() {
    for ( var i = 0; i < smartContractAddresses.length; i++) {
        var smartContract = smartContractObjects[i]
        smartContract.events.StartOfSession(specifiedEventHandler(startSessionEvent))
        smartContract.events.Handoff(specifiedEventHandler(handoffEvent))
        smartContract.events.EndOfSession(specifiedEventHandler(endSessionEvent))
    }
}



function specifiedEventHandler(handler) {
    return function(error, result) {
        if (error) {
            console.error(error)
            return
        }
        const values = result.returnValues
        handler(values)
    }
}


async function startSessionEvent(values) {
    values["nameOfEvent"] = "startSession"
    values["chain"] = userToChainNumber(Number(values.userID))
    transactionData.push(values)
    activeSessions.push(values.sessionID)
}


 // this event will be called twice in every handoff, and will save 2 different chain values on each one.
async function handoffEvent(values) {
    values["nameOfEvent"] = "handoff"
    if (firstHandoff) {
        values["chain"] = userToChainNumber(Number(values.previousUserID))
        firstHandoff = false
    } else {
        values["chain"] = userToChainNumber(Number(values.newUserID))
        firstHandoff = true
    }
    transactionData.push(values)
}


async function endSessionEvent(values) { 
    values["nameOfEvent"] = "endSession"
    values["chain"] = userToChainNumber(Number(values.userID))
    transactionData.push(values)
    var sessionIndex = activeSessions.indexOf(values.sessionID)
    activeSessions.splice(sessionIndex, 1)
}


function addUiListeners() {
    // specified transactions
    startSessionButton.addEventListener("click", startTransaction)
    endSessionButton.addEventListener("click", endTransaction)
    HandoffButton.addEventListener("click", handOffTransaction)
    tracebackButton.addEventListener("click", traceback)
}
addUiListeners()


// called when the start new session button is pressed initializes the new sessionID available and 
// from this point forward to call the sensor transaction every 5 sec to be to the queue of pending transactions
async function startTransaction() {
    if (!deployed) {
        alert("Wait a little bit more for the contracts to be deployed")
        return
    }
    var transactionhash
    // creates a random 6-digits number of userID
    var userID = createUserID()

    // the the chain number from the userID
    var chainNumber = userToChainNumber(userID)
    // console.log("Start transaction send to server: " + chainNumber + " from user: " + userID)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]
    try {
        if (deployed) {
            // call the function from the smart contract
            var startTransactionObject = smartContract.methods.startSession(userID)
                                                    .send({from: senderAddress})
                                                    .on('transactionHash', function(hash) {
                                                        console.log(hash)
                                                        transactionhash = hash
                                                    }).then(function(receipt){ // called on event
                                                        var _sessionID = receipt.events.StartOfSession.returnValues.sessionID
                                                        console.log("Session "+ _sessionID + " Activated. TX send to server: " + chainNumber + " from user: " + userID)
                                                        sessionToUserID[_sessionID] = userID
                                                        sessionToTransactionHash[_sessionID] = [transactionhash]
                                                        sessionToChain[_sessionID] = chainNumber // save the number of the chain saved last
                                                        // initialize the sensors for this session
                                                        initializeSensors(_sessionID)
                                                    })
        } else {
            alert("Wait a little bit more for the contracts to be deployed")
        }
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}


// sends 2 handoff transactions one in each of the chains of the previous and the new user
async function handOffTransaction() {
    if (!deployed) {
        alert("Wait a little bit more for the contracts to be deployed")
        return
    }
    var _sessionID = document.getElementById("Handoff-sessionId").value
    var _userID
    var same = false

    // create a newUserID that is different from the previousUserID
    while (!same) {
        _userID = createUserID()
        same = (_userID===sessionToUserID[_sessionID]) ? false : true
    }

    // get the last item of the transaction hashes of this session
    var hashArray = sessionToTransactionHash[_sessionID]
    var previousTransactionHash = hashArray[hashArray.length - 1]
    var previousUserID = sessionToUserID[_sessionID]

    // the chain number from the previous userID
    var previousChainNumber = userToChainNumber(previousUserID)
    // console.log("Handoff Send to server: " + previousChainNumber + " from previous user: " + previousUserID)

    // get the address and the smart contract object of the proper chain from the previous user
    var previousSmartContract = smartContractObjects[previousChainNumber]
    var previousSenderAddress = userAddresses[previousChainNumber][0]
    try {
        // call the function from the smart contract for the previous user
        var handOffTransactionObject = previousSmartContract.methods.handoff(
                                                _sessionID,
                                                previousUserID, // previous userID
                                                _userID, // new userID
                                                previousTransactionHash,
                                                previousTransactionHash // currently for the previous ledger name
                                                ).send({from: previousSenderAddress})
                                                .on('receipt', function(receipt) {
                                                    console.log("Session "+ _sessionID + " Handed off. (TX saved to the previous User (" + previousUserID + ") to chain " + previousChainNumber + ")")
                                                    sessionToUserID[_sessionID] = _userID // save new userID
                                                    // stop the logging of sensors for this session
                                                    eval('clearInterval(window.session' + _sessionID + ')')
                                                    console.log("interval session" + _sessionID + " cleared from chain " + previousChainNumber)
                                                }).on('transactionHash', function(hash) {
                                                    console.log(hash)
                                                    sessionToTransactionHash[_sessionID].push(hash)
                                                })

        // get the last item of the transaction hashes of this session
        var hashArray = sessionToTransactionHash[_sessionID]
        var previousTransactionHash = hashArray[hashArray.length - 1]

        // the chain number from the new userID
        var newChainNumber = userToChainNumber(_userID)
        // console.log("Handoff Send to server: " + newChainNumber + " from new user: " + _userID)

        // get the address and the smart contract object of the proper chain from the new user
        var newSmartContract = smartContractObjects[newChainNumber]
        var newSenderAddress = userAddresses[newChainNumber][0]

        // call the function from the smart contract for the new user
        var handOffTransactionObject = newSmartContract.methods.handoff(
                                                _sessionID,
                                                previousUserID, // previous userID
                                                _userID, // new userID
                                                previousTransactionHash,
                                                previousTransactionHash // currently for the previous ledger name
                                                ).send({from: newSenderAddress})
                                                .on('receipt', function(receipt) {
                                                    console.log("Session "+ _sessionID + " Handed off. (TX saved to the new User (" + _userID + ") to chain " + newChainNumber + ")")
                                                    sessionToUserID[_sessionID] = _userID // save new userID
                                                    sessionToChain[_sessionID] = newChainNumber // save the number of the chain saved last
                                                    // begin logging sensors from the other user's chain
                                                    initializeSensors(_sessionID)
                                                }).on('transactionHash', function(hash) {
                                                    console.log(hash)
                                                    sessionToTransactionHash[_sessionID].push(hash)
                                                })
    } catch (e) {
        console.error(e)
        alert(e.message)
    }

    // reset the value to the placeholder
    document.getElementById("Handoff-sessionId").value = ""
}


async function endTransaction() {
    if (!deployed) {
        alert("Wait a little bit more for the contracts to be deployed")
        return
    }
    var _sessionID = document.getElementById("endSession-sessionId").value
    var userID = sessionToUserID[_sessionID]

    // the chain number from the userID
    var chainNumber = userToChainNumber(userID)
    // console.log("End transaction send to server: " + chainNumber + " from user: " + userID)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]

    // get the last item of the transaction hashes of this session
    var hashArray = sessionToTransactionHash[_sessionID]
    var previousTransactionHash = hashArray[hashArray.length - 1]
    try {
        // call the function from the smart contract
        var endTransactionObject = smartContract.methods.endSession(_sessionID, userID, previousTransactionHash)
                                            .send({from: senderAddress})
                                            .on('receipt', function(receipt) {
                                                console.log("Session "+ _sessionID + " Ended. TX send to server: " + chainNumber + " from user: " + userID)
                                                // stop the logging of sensors for this session
                                                eval('clearInterval(window.session' + _sessionID + ')')
                                                console.log("interval session" + _sessionID + " cleared.")
                                            }).on('transactionHash', function(hash) {
                                                console.log(hash)
                                                sessionToTransactionHash[_sessionID].push(hash)
                                            })
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
    // reset value to the placeholder
    document.getElementById("endSession-sessionId").value = ""
}


async function sensorTransaction(_sessionID) {
    var information = String(Math.random(98) + 1) + " C"
    var chainNumber = sessionToChain[_sessionID]

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]

    try {
        // call the function from the smart contract
        var sensorTransactionObject = smartContract.methods.sensorLogging(
                                                    _sessionID,
                                                    information)
                                                    .send({from: senderAddress})
        // console.log("included sensor transaction")
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}


function createUserID() {
    return Math.floor(100000 + Math.random() * 900000)
}


async function initializeSensors(_sessionID) {
    console.log("Initialize sensors for session" + _sessionID + ".")
    // repeat the interval session1, session2, etc very 5000milsec = 5sec.
    //window.variableName saves a global variable with dynamic naming for clearing the interval from another function
    eval('window.session' + _sessionID + ' = ' + setInterval(function() { sensorTransaction(_sessionID) }, 5000))
}


async function traceback() {
    var _sessionID = document.getElementById("Traceback-sessionId").value
    var tracebackData = []

    for (let i = 0; i < transactionData.length; i++) {
        if (transactionData[i].sessionID === _sessionID) {
            // add this event data to the end of the list
            tracebackData.push(transactionData[i])
        }
    }

    if (tracebackData.length === 0) {
        console.log("No events for this session.")
    } else {
        console.log("The events for " + _sessionID + " are: ")
        readTracebackData(tracebackData)
    }

    // console.log(sessionToTransactionHash[_sessionID])
    // reset value to the placeholder
    document.getElementById("Traceback-sessionId").value = ""
}


// I want a function f: [9] -> [#servers] => f(x) = floor[x / (10/#servers)] with a max amount of servers of 10           
// e.g. for 2 servers f(4) = 4/5 = floor(0.8) = 0, f(5) = 1 => {0,1,2,3,4}->0, {5,6,7,8,9}->1
//      for 3 servers f(3) = fl(3/3.33) = 0, f(4) = 4/3.33 = 1, f(7) = 7/3.33 = 2 => {0,1,2,3}->0, {4,5,6}->1, {7,8,9}->2
function digitToServer(x) {
    return (Math.floor((x) / (10/numberOfServers)))
}


// get the first digit of the id number
function getFirstDigit(id) {
    return (Number(String(id).charAt(0)))
}


// get the first digit of the userID and match it to a number from 0 to numberOfServers
function userToChainNumber(userID) {
    var firstDigit = getFirstDigit(userID)
    return (digitToServer(firstDigit))
}


function readTracebackData(tracebackData) {
    var description = ""
    for (var i = 0; i < tracebackData.length; i++) {
        var thisEvent = tracebackData[i]
        if (thisEvent.nameOfEvent === 'startSession') {
            description += "Session " + thisEvent.sessionID + " started from user: " + thisEvent.userID + " on chain: " + thisEvent.chain + " at time: " + thisEvent.time + ". \n"
        } else if (thisEvent.nameOfEvent === 'handoff') {
            description += "Handed off from user: " + thisEvent.previousUserID + " to user:" + thisEvent.newUserID + " on chain: " + thisEvent.chain + " at time: " + thisEvent.time + ". \n"
        } else if (thisEvent.nameOfEvent === 'endSession') {
            description += "Session " + thisEvent.sessionID + " ended from user: " + thisEvent.userID + " on chain: " + thisEvent.chain + " at time: " + thisEvent.time + ". \n"
        }
    }
    console.log(description)
}