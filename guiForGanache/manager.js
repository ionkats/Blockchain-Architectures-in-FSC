import { initialize } from "./initializer.js"
import { initializeWithoutData } from "./initializerWithoutData.js"
import { createNewServer } from "./initializerWithoutData.js"
import { random } from "./initializerWithoutData.js"
import { tracebackThroughBlockChain } from "./traceback.js"
import { searchForEndSession } from "./traceback.js"
import { getSensorData } from "./traceback.js"

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
}, 16000) // wait for 16 seconds for the contracts to be surely deployed (block every 15s)


// put the address of the deployed smart contracts here
var userAddresses = data[0]
var smartContractObjects = data[1]
var smartContractAddresses = data[2]
var web3Instances = data[3]
var numberOfServers = data[4]

console.log("There are " + numberOfServers + " chains currently running.")

// connect the UI buttons
const startSessionButton = document.getElementById("newSession-button")
const endSessionButton = document.getElementById("endSession-button")
const handoffButton = document.getElementById("Handoff-button")
const tracebackButton = document.getElementById("Traceback-button")
const sensorButton = document.getElementById("SensorData-button")

// const GASLIMIT = 15000000
const GASLIMIT = 2000000
var activeSessionsPerChain = {}
var activeSessions = []
var currentSession = 0
var sessionToCompanyID = {}// key: sessionID, value: current CompanyID
var sessionToUserID = {} // key: sessionID, value: current UserID for sanity checks of handoffs
var sessionToTransactionHash = {} // dictionary key:sessionID, value: previous transaction hash that it passed
var sessionToChain = {}
var firstHandoff = {}
var chainToCompanies = {} // the userID that change chains are saved here
var portsUsed = []


// initialize the active sessions per chain
for( var i=0; i < numberOfServers; i++) {
    activeSessionsPerChain[i] = 0
    portsUsed.push('854' + i)
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
    var chainNumber = IDToChainNumber(Number(values.userID))
    activeSessionsPerChain[chainNumber] += 1
    currentSession++;
    activeSessions.push(currentSession)
}


 // this event will be called twice in every handoff, and will save 2 different chain values on each one.
async function handoffEvent(values) {
    values["nameOfEvent"] = "handoff"
    if (firstHandoff[values.sessionID]) {
        var previousChainNumber = IDToChainNumber(Number(values.previousUserID))
        activeSessionsPerChain[previousChainNumber] -= 1
        firstHandoff[values.sessionID] = false
    } else {
        var newChainNumber = IDToChainNumber(Number(values.newUserID))
        activeSessionsPerChain[newChainNumber] += 1
        firstHandoff[values.sessionID] = true
    }
}


async function endSessionEvent(values) { 
    var chainNumber = IDToChainNumber(Number(values.userID))
    activeSessionsPerChain[chainNumber] -= 1
    const index = activeSessions.indexOf(values.sessionID);
    if (index > -1) {
        activeSessions.splice(index, 1);
    }
}


function addUiListeners() {
    // specified transactions
    startSessionButton.addEventListener("click", startTransaction)
    endSessionButton.addEventListener("click", endTransaction)
    handoffButton.addEventListener("click", handOffTransaction)
    tracebackButton.addEventListener("click", traceback)
    sensorButton.addEventListener("click", sensorData)
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
    var userID = createRandomID()
    // creates a random 6-digits number of companyID
    var companyID = createRandomID()

    // the the chain number from the userID
    var chainNumber = await getChainIndex(companyID)
    if (chainNumber === undefined || !deployed) {
        console.log("Not proceeding in activating any sessions")
        return
    }
    coverAllContracts(chainNumber)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]
    try {
        // call the function from the smart contract
        var startTransactionObject = smartContract.methods.startSession(companyID, userID)
                                                .send({from: senderAddress})
                                                .then(function(receipt){ // called on event
                                                    // console.log(receipt)
                                                    var _sessionID = receipt.events.StartOfSession.returnValues.sessionID
                                                    console.log("Session "+ _sessionID + " Activated to chain index: " + chainNumber + " from ID: " + companyID)
                                                    sessionToCompanyID[_sessionID] = companyID
                                                    sessionToUserID[_sessionID] = userID
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash
                                                    sessionToChain[_sessionID] = chainNumber // save the number of the chain saved last
                                                    // initialize the sensors for this session
                                                    initializeSensors(_sessionID)
                                                    firstHandoff[_sessionID] = true
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
    } 
    var _sessionID = document.getElementById("Handoff-sessionId").value
    if (!firstHandoff[_sessionID]) {
        console.log("The second handoff transaction hasn't been mined yet, try again for handing off this session.")
        document.getElementById("Handoff-sessionId").value = ""
        return
    }
    var newuserID
    var same = false

    // create a newUserID that is different from the previousUserID
    while (!same) {
        newuserID = createRandomID()
        same = (newuserID === sessionToUserID[_sessionID]) ? false : true
    }

    // creates a random 6-digits number of companyID
    var newCompanyID = createRandomID()

    // get the last transaction hash of this session
    var previousTransactionHash = sessionToTransactionHash[_sessionID]
    var previousUserID = sessionToUserID[_sessionID]
    var previousCompanyID = sessionToCompanyID[_sessionID]

    // the chain number from the previous companyID
    var previousChainNumber = IDToChainNumber(previousCompanyID)

    // get the address and the smart contract object of the proper chain from the previous user
    var previousSmartContract = smartContractObjects[previousChainNumber]
    var previousSenderAddress = userAddresses[previousChainNumber][0]
    try {
        // call the function from the smart contract for the previous user
        var handOffTransactionObject = await previousSmartContract.methods.handoff(
                                                _sessionID,
                                                previousCompanyID,
                                                previousUserID, // previous userID
                                                newCompanyID,
                                                newuserID, // new userID
                                                previousTransactionHash,
                                                previousChainNumber // save the index of the previous chain
                                                ).send({from: previousSenderAddress})
                                                .on('receipt', function(receipt) {
                                                    console.log("Session "+ _sessionID + " Handed off. (TX saved to the previous User (" + previousUserID + ") to chain index" + previousChainNumber + ")")
                                                    previousTransactionHash = receipt.transactionHash
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
                                                    // stop the logging of sensors for this session
                                                    eval('clearInterval(window.session' + _sessionID + ')')
                                                })

        var newChainNumber = await getChainIndex(newCompanyID)

        // get the address and the smart contract object of the proper chain from the new user
        var newSmartContract = smartContractObjects[newChainNumber]
        var newSenderAddress = userAddresses[newChainNumber][0]

        // call the function from the smart contract for the new user
        var handOffTransactionObject = await newSmartContract.methods.handoff(
                                                            _sessionID,
                                                            previousCompanyID,
                                                            previousUserID, // previous userID
                                                            newCompanyID,
                                                            newuserID, // new userID
                                                            previousTransactionHash,
                                                            previousChainNumber // save the index of the previous chain
                                                            ).send({from: newSenderAddress})
                                                            .on('receipt', function(receipt) {
                                                                console.log("Session "+ _sessionID + " Handed off. (TX saved to the new ID (" + newCompanyID + ") to chain index " + newChainNumber + ")")
                                                                sessionToCompanyID[_sessionID] = newCompanyID // save new companyID
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
    }
    var _sessionID = document.getElementById("endSession-sessionId").value

    if (!firstHandoff[_sessionID]) {
        console.log("The second handoff transaction hasn't been mined yet, try again for ending this session.")
        document.getElementById("endSession-sessionId").value = ""
        return
    }
    var userID = sessionToUserID[_sessionID]
    var companyID = sessionToCompanyID[_sessionID]

    // the chain number from the companyID
    var chainNumber = IDToChainNumber(companyID)

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
        var endTransactionObject = smartContract.methods.endSession(_sessionID, companyID, userID, previousTransactionHash)
                                            .send({from: senderAddress})
                                            .on('receipt', function(receipt) {
                                                console.log("Session "+ _sessionID + " Ended to chain index: " + chainNumber + " from ID: " + companyID)
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
    var companyID = sessionToCompanyID[_sessionID]

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]

    try {
        // call the function from the smart contract
        var sensorTransactionObject = smartContract.methods.sensorLogging(
                                                    _sessionID,
                                                    companyID,
                                                    information)
                                                    .send({from: senderAddress})
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}


function createRandomID() {
    return Math.floor(100000 + Math.random() * 900000)
}


async function initializeSensors(_sessionID) {
    // repeat the interval session1, session2, etc very 5000milsec = 5sec.
    // window.variableName saves a global variable with dynamic naming for clearing the interval from another function
    eval('window.session' + _sessionID + ' = ' + setInterval(function() { sensorTransaction(_sessionID) }, 5000))
}


async function traceback() {
    var sessionID = document.getElementById("Traceback-sessionId").value

    var result = await searchForEndSession(sessionID, smartContractObjects)
    if (result[1] === "") {
        console.log("The session hasn't ended yet")
        document.getElementById("Traceback-sessionId").value = ""
        return
    }

    tracebackThroughBlockChain(result[1], result[0], sessionID, web3Instances)

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
function IDToChainNumber(companyID) {
    var chainFromCompID
    if (chainToCompanies[companyID] === undefined) {
        chainFromCompID = digitToServer(getFirstDigit(companyID))
    } 
    if (deployed) {
        chainToCompanies[companyID] = chainFromCompID 
    }
    return chainFromCompID
}


// activate the session on all contracts, for avoiding future errors on revert of transactions due to inactive session (eg handoff to different chain)
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
async function getChainIndex(companyID) {
    var validLoadNotFound = false
    var currentChain = IDToChainNumber(companyID)
    var _web3 = web3Instances[currentChain]
    
    // check the load on the chain assigned to the user
    var firstResult = await decentLoadOnChain(_web3).then(function (result) {
                                        if (result) {
                                            // console.log("got in")
                                        }
                                        return result
                                    })    
    if (firstResult) {
        return currentChain
    }

    // check the load on the rest of the active chains, return the first valid
    var chain = 0
    while (true) {
        if (chain >= numberOfServers) {
            validLoadNotFound = true
            break
        } else if (chain != currentChain) {
            var currentResult = await decentLoadOnChain(web3Instances[chain]).then(function (result) {
                                                                                        if (result) {
                                                                                            console.log("Company with ID " + companyID + " moved to chain " + chain)
                                                                                            chainToCompanies[companyID] = chain
                                                                                        }
                                                                                        return result
                                                                                    }) 
            if (currentResult) {
                return chain
            }
        }
        chain += 1
    }

    if (validLoadNotFound) {
        var validPort = false
        deployed = false
        while (!validPort) {
            var port = window.prompt("You have to create a new server, everything is almost fully loaded. Insert a not used port of a new server.")
            validPort = !portsUsed.includes(port)
            if (port === undefined) {
                validPort = false
            }
        }
        var items = await createNewServer(port, currentSession, activeSessions)
        
        setTimeout(function () {
            deployed = true
        }, 16000) // wait for 16 seconds for the contracts to be surely deployed (block every 15s)
        
        smartContractAddresses.push(items[0])
        smartContractObjects.push(items[1])
        web3Instances.push(items[2])
        userAddresses.push(items[3])
        numberOfServers++
        // alert("Need to create new server.")
        return
    } else {
        alert("An error at the getChainIndex function, needs debugging.")
        return
    }
}


// check if over 85% of gas is used on the last 2 blocks
async function decentLoadOnChain(web3_instance) {
    var result = true
    var blockNumber = await web3_instance.eth.getBlock("latest")
    for (var i=0; i < 3; i++) {
        var blockData = await web3_instance.eth.getBlock(blockNumber.number - i)
                                                .then(function (block) {
                                                    if (block.gasUsed > 0.85*GASLIMIT) {
                                                        result = false
                                                    }
                                                })
    }
    return result
}


function sensorData() {
    var sessionID = document.getElementById("SensorData-sessionId").value
    var companyID = document.getElementById("SensorData-companyId").value

    getSensorData(sessionID, smartContractObjects, companyID)

    // reset values to the placeholder
    document.getElementById("SensorData-sessionId").value = ""
    document.getElementById("SensorData-companyId").value = ""
}