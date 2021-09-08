import {initialize} from "./initializer.js"
import {initializeWithoutData} from "./initializerWithoutData.js"
import {random} from "./initializerWithoutData.js"
import {tracebackThroughBlockChain} from "./traceback.js"

// uncomment to initialize the servers and get the addresses of already deployed contracts 

// var data = initialize()
// var deployed = false
// setTimeout(function () {
//     deployed = true
//     listenAllEvents()
// }, 2000) // wait for 2 seconds for the addresses to be surely fetched


// uncomment to initialize servers and deploy the contracts from scratch

var data = initializeWithoutData()
var deployed = false
setTimeout(function () {
    deployed = true
    listenAllEvents()
}, 31000) // wait for 31 seconds for the contracts to be surely deployed (block every 30s)


// put the address of the deployed smart contracts here
var userAddresses = data[0]
var smartContractObjects =data[1] 
var smartContractAddresses = data[2]
var web3Instances = data[3]
var numberOfServers = data[4]

console.log("There are " + numberOfServers + " chains currently running.")

// connect the UI buttons
const startSessionButton = document.getElementById("newSession-button")
const endSessionButton = document.getElementById("endSession-button")
const HandoffButton = document.getElementById("Handoff-button")
const tracebackButton = document.getElementById("Traceback-button")

const GASLIMIT = 15000000
var activeSessionsPerChain = {}
var sessionToUserID = {} // key: sessionID, value: current UserID for sanity checks of handoffs
var sessionToTransactionHash = {} // dictionary key:sessionID, value: previous transaction hash that it passed
var sessionToChain = {}
var firstHandoff = true
// the userID that change chains are saved here
var changedUsers = {}


// initialize the active sessions per chain
for( var i=0; i < numberOfServers; i++) {
    activeSessionsPerChain[i] = 0
}


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
    var chainNumber = userToChainNumber(Number(values.userID))
    activeSessionsPerChain[chainNumber] += 1
}


 // this event will be called twice in every handoff, and will save 2 different chain values on each one.
async function handoffEvent(values) {
    values["nameOfEvent"] = "handoff"
    if (firstHandoff) {
        var previousChainNumber = userToChainNumber(Number(values.previousUserID))
        activeSessionsPerChain[previousChainNumber] -= 1
        firstHandoff = false
    } else {
        var newChainNumber = userToChainNumber(Number(values.newUserID))
        activeSessionsPerChain[newChainNumber] += 1
        firstHandoff = true
    }
}


async function endSessionEvent(values) { 
    var chainNumber = userToChainNumber(Number(values.userID))
    activeSessionsPerChain[chainNumber] -= 1
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
    
    // creates a random 6-digits number of userID
    var userID = createUserID()

    // the the chain number from the userID
    var chainNumber = getChainIndex(userID)

    coverAllContracts(chainNumber)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]
    try {
        // call the function from the smart contract
        var startTransactionObject = smartContract.methods.startSession(userID)
                                                .send({from: senderAddress})
                                                .then(function(receipt){ // called on event
                                                    // console.log(receipt)
                                                    var _sessionID = receipt.events.StartOfSession.returnValues.sessionID
                                                    console.log("Session "+ _sessionID + " Activated. TX send to server: " + chainNumber + " from user: " + userID)
                                                    sessionToUserID[_sessionID] = userID
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash
                                                    sessionToChain[_sessionID] = chainNumber // save the number of the chain saved last
                                                    // initialize the sensors for this session
                                                    initializeSensors(_sessionID)
                                                    // webInstance.eth.getTransactionReceipt(receipt.transactionHash).then(console.log)
                                                })
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
    } else if (!firstHandoff) {
        console.log("The second handoff transaction hasn't been mined yet, try again for handing off this session.")
        return
    }
    var _sessionID = document.getElementById("Handoff-sessionId").value
    var newuserID
    var same = false

    // create a newUserID that is different from the previousUserID
    while (!same) {
        newuserID = createUserID()
        same = (newuserID === sessionToUserID[_sessionID]) ? false : true
    }

    // get the last transaction hash of this session
    var previousTransactionHash = sessionToTransactionHash[_sessionID]
    var previousUserID = sessionToUserID[_sessionID]

    // the chain number from the previous userID
    var previousChainNumber = userToChainNumber(previousUserID)

    // get the address and the smart contract object of the proper chain from the previous user
    var previousSmartContract = smartContractObjects[previousChainNumber]
    var previousSenderAddress = userAddresses[previousChainNumber][0]
    try {
        // call the function from the smart contract for the previous user
        var handOffTransactionObject = await previousSmartContract.methods.handoff(
                                                _sessionID,
                                                previousUserID, // previous userID
                                                newuserID, // new userID
                                                previousTransactionHash,
                                                previousChainNumber // save the index of the previous chain
                                                ).send({from: previousSenderAddress})
                                                .on('receipt', function(receipt) {
                                                    console.log("Session "+ _sessionID + " Handed off. (TX saved to the previous User (" + previousUserID + ") to chain " + previousChainNumber + ")")
                                                    sessionToUserID[_sessionID] = newuserID // save new userID
                                                    previousTransactionHash = receipt.transactionHash
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
                                                    // stop the logging of sensors for this session
                                                    eval('clearInterval(window.session' + _sessionID + ')')
                                                })

        var newChainNumber = getChainIndex(newuserID)

        // get the address and the smart contract object of the proper chain from the new user
        var newSmartContract = smartContractObjects[newChainNumber]
        var newSenderAddress = userAddresses[newChainNumber][0]

        // call the function from the smart contract for the new user
        var handOffTransactionObject = await newSmartContract.methods.handoff(
                                                            _sessionID,
                                                            previousUserID, // previous userID
                                                            newuserID, // new userID
                                                            previousTransactionHash,
                                                            previousChainNumber // save the index of the previous chain
                                                            ).send({from: newSenderAddress})
                                                            .on('receipt', function(receipt) {
                                                                console.log("Session "+ _sessionID + " Handed off. (TX saved to the new User (" + newuserID + ") to chain " + newChainNumber + ")")
                                                                sessionToUserID[_sessionID] = newuserID // save new userID
                                                                sessionToChain[_sessionID] = newChainNumber // save the number of the chain saved last
                                                                sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
                                                                // begin logging sensors from the other user's chain
                                                                initializeSensors(_sessionID)
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
    } else if (!firstHandoff) {
        console.log("The second handoff transaction hasn't been mined yet, try again for ending this session.")
        return
    }
    var _sessionID = document.getElementById("endSession-sessionId").value
    var userID = sessionToUserID[_sessionID]

    // the chain number from the userID
    var chainNumber = userToChainNumber(userID)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]

    // get the last transaction hash of this session
    var previousTransactionHash = sessionToTransactionHash[_sessionID]
    try {
        // stop the logging of sensors for this session
        eval('clearInterval(window.session' + _sessionID + ')')
        // console.log("interval session" + _sessionID + " cleared.")

        // call the function from the smart contract
        var endTransactionObject = smartContract.methods.endSession(_sessionID, userID, previousTransactionHash)
                                            .send({from: senderAddress})
                                            .on('receipt', function(receipt) {
                                                console.log("Session "+ _sessionID + " Ended. TX send to server: " + chainNumber + " from user: " + userID)
                                                sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
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
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}


function createUserID() {
    return Math.floor(100000 + Math.random() * 900000)
}


async function initializeSensors(_sessionID) {
    // console.log("Initialize sensors for session" + _sessionID + ".")
    // repeat the interval session1, session2, etc very 5000milsec = 5sec.
    //window.variableName saves a global variable with dynamic naming for clearing the interval from another function
    eval('window.session' + _sessionID + ' = ' + setInterval(function() { sensorTransaction(_sessionID) }, 5000))
}


async function traceback() {
    var sessionID = document.getElementById("Traceback-sessionId").value
    
    tracebackThroughBlockChain(sessionToTransactionHash[sessionID], sessionToChain[sessionID], sessionID, web3Instances)

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
    var chainFromUser
    if (changedUsers[userID] === undefined) {
        chainFromUser = digitToServer(getFirstDigit(userID))
    } else {
        chainFromUser = changedUsers[userID]
    }
    return chainFromUser
}


// activate the session on all contratcs, for avoiding future errors on revert of transactions due to inactive session (eg handoff to different chain)
function coverAllContracts(chainNumber) {
    for (var i = 0; i < numberOfServers; i++) {
        if (i === chainNumber) {
            continue
        } else {
            var smartContract = smartContractObjects[i]
            var senderAddress = userAddresses[i][0]
            var transactionObject = smartContract.methods.getNextSessionID()
                                                         .send({from: senderAddress})
        }
    }
}


// get the chain number of this user by checking the load on the chain assigned to it
function getChainIndex(userID) {
    var validLoadNotFound = false
    var currentChain = userToChainNumber(userID)
    var _web3 = web3Instances[currentChain]

    if (decentLoadOnChain(_web3)) {
        return currentChain
    } 
    var chain = 0

    while (true) {
        if (chain >= web3Instances.length) {
            validLoadNotFound = true
            break
        } else if ((chain === currentChain)) {
            chain += 1
        } else {
            if (decentLoadOnChain(web3Instances[chain])) {
                console.log("User " + userID + " moved to chain " + chain)
                changedUsers[userID] = chain
                return chain
            }
        }
    }

    if (validLoadNotFound) {
        alert("You have to create a new server, everything is almost fully loaded")
        return
    } else {
        alert("An error on the getChainIndex function, it does not work")
        return
    }
    
}


// check if over 90% of gas is used on the last 2 blocks
async function decentLoadOnChain(web3_instance) {
    var result = true
    var blockNumber = await web3_instance.eth.getBlock("latest")

    for (var i=0; i < 1; i++) {
        var blockData = await web3_instance.eth.getBlock(blockNumber.number - i)
        // console.log(blockData)
        if (blockData.gasUsed > 0.90*GASLIMIT) {
            result = false
        } 
    }
    return result
}