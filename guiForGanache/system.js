import { initialize } from "./initializer.js"
import { initializeWithoutData } from "./initializerWithoutData.js"
import { random } from "./initializerWithoutData.js"
import { tracebackThroughBlockChain } from "./traceback.js"
import { searchForEndSession } from "./traceback.js"
import { getSensorData } from "./traceback.js"
import { getIndexThroughChains } from "./traceback.js"
import { getChainIndex } from "./chainManager.js"
import { initializeManager } from "./chainManager.js"

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
initializeManager(data)
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
var indexOfNewServers = []


// initialize the active sessions per chain
for( var i=0; i < numberOfServers; i++) {
    // activeSessionsPerChain[i] = 0
    portsUsed.push('854' + i)
}


// listen to all events from all the servers
async function listenAllEvents() {
    for ( var i = 0; i < smartContractObjects.length; i++) {
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
    // var chainNumber = chainToCompanies[Number(values.companyID)]
    // activeSessionsPerChain[chainNumber] += 1
    // activeSessions.push(currentSession)
}


 // this event will be called twice in every handoff, and will save 2 different chain values on each one.
async function handoffEvent(values) {
    // values["nameOfEvent"] = "handoff"
    if (firstHandoff[Number(values.sessionID)]) {
        // var previousChainNumber = Number(values.previousChainNumber)
        // activeSessionsPerChain[previousChainNumber] -= 1
        firstHandoff[Number(values.sessionID)] = true
    } else {
        // var newChainNumber = chainToCompanies[Number(values.newCompanyID)]
        // activeSessionsPerChain[newChainNumber] += 1
        firstHandoff[Number(values.sessionID)] = false
    }
}


async function endSessionEvent(values) { 
    // var chainNumber = await getIndexThroughChains(Number(values.sessionID), smartContractObjects, Number(values.companyID))
    // activeSessionsPerChain[chainNumber] -= 1
    // const index = activeSessions.indexOf(Number(values.sessionID));
    // if (index > -1) {
    //     activeSessions.splice(index, 1);
    // }
}


function addUiListeners() {
    // specified transactions
    startSessionButton.addEventListener("click", startTransaction)  // oneClick)
    endSessionButton.addEventListener("click", endTransaction)
    handoffButton.addEventListener("click", handOffTransaction)
    tracebackButton.addEventListener("click", traceback)
    sensorButton.addEventListener("click", sensorData)
}
addUiListeners()

function oneClick() {
    for (var i=0; i <= 50; i++) {
        startTransaction()
    }
}


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

    // get the chain number from the manager
    var chainNumber
    try {
        chainNumber = await connectWithLoadBalancer(companyID, chainToCompanies, currentSession, portsUsed)
        if (chainNumber === undefined) {
            return
        }
        chainToCompanies[companyID] = chainNumber
    } catch(e) {
        console.log(e)
        console.log("Error from manager, proceeding with last determined chain value for this company.")
        if (chainToCompanies[companyID] === undefined) {
            chainNumber = hashAndModulo(companyID)
            chainToCompanies[companyID] = chainNumber
        } else {
            chainNumber = chainToCompanies[companyID]
        }
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
                                                    var _sessionID = receipt.events.StartOfSession.returnValues.sessionID
                                                    console.log("Session "+ _sessionID + " Activated to chain index: " + chainNumber + " from ID: " + companyID)
                                                    sessionToCompanyID[_sessionID] = companyID
                                                    sessionToUserID[_sessionID] = userID
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash
                                                    sessionToChain[_sessionID] = chainNumber // save the number of the chain saved last
                                                    currentSession++
                                                    // initialize the sensors for this session
                                                    initializeSensors(_sessionID)
                                                    firstHandoff[Number(_sessionID)] = false
                                                })
    } catch (e) {
        console.log(e)
        console.log("Start Session Transaction reverted.")
    }
}


// sends 2 handoff transactions one in each of the chains of the previous and the new user
async function handOffTransaction() {
    if (!deployed) {
        alert("Wait a little bit more for the contracts to be deployed")
        return
    } 
    var _sessionID = document.getElementById("Handoff-sessionId").value
    if (firstHandoff[Number(_sessionID)]) {
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
    var previousChainNumber = await getIndexThroughChains(_sessionID, smartContractObjects, previousCompanyID)

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
                                                    console.log("Session "+ _sessionID + " Handed off. (TX saved to the previous ID (" + previousCompanyID + ") to chain index " + previousChainNumber + ")")
                                                    previousTransactionHash = receipt.transactionHash
                                                    sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
                                                    // stop the logging of sensors for this session
                                                    eval('clearInterval(window.session' + _sessionID + ')')
                                                })

        var newChainNumber 
        // get the new chain number from the manager
        try {
            newChainNumber = await connectWithLoadBalancer(newCompanyID, chainToCompanies, currentSession, portsUsed)
            if (newChainNumber === undefined) {
                return
            }
            chainToCompanies[newCompanyID] = newChainNumber
            await checkAndActivateSession(newChainNumber, _sessionID)
        } catch(e) {
            console.log(e)
            console.log("Error from manager, proceeding with last determined chain value for this company.")
            if (chainToCompanies[newCompanyID] === undefined) {
                newChainNumber = hashAndModulo(newCompanyID)
                chainToCompanies[newCompanyID] = newChainNumber
            } else {
                newChainNumber = chainToCompanies[newCompanyID]
            }
        }

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
        console.log(e)
        console.log("Handoff Transaction reverted.")
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

    if (firstHandoff[Number(_sessionID)]) {
        console.log("The second handoff transaction hasn't been mined yet, try again for ending this session.")
        document.getElementById("endSession-sessionId").value = ""
        return
    }
    var userID = sessionToUserID[_sessionID]
    var companyID = sessionToCompanyID[_sessionID]

    // the chain number from the companyID
    var chainNumber = await getIndexThroughChains(_sessionID, smartContractObjects, companyID)

    // get the address and the smart contract object of the proper chain
    var smartContract = smartContractObjects[chainNumber]
    var senderAddress = userAddresses[chainNumber][0]

    // get the last transaction hash of this session
    var previousTransactionHash = sessionToTransactionHash[_sessionID]
    try {
        // stop the logging of sensors for this session
        eval('clearInterval(window.session' + _sessionID + ')')

        // call the function from the smart contract
        var endTransactionObject = smartContract.methods.endSession(_sessionID, companyID, userID, previousTransactionHash)
                                            .send({from: senderAddress})
                                            .on('receipt', function(receipt) {
                                                console.log("Session "+ _sessionID + " Ended to chain index: " + chainNumber + " from ID: " + companyID)
                                                sessionToTransactionHash[_sessionID] = receipt.transactionHash // update the last transaction hash
                                            })
    } catch (e) {
        console.log(e)
        console.log("End Session Transaction reverted.")
    }
    // reset value to the placeholder
    document.getElementById("endSession-sessionId").value = ""
}


async function sensorTransaction(_sessionID) {
    var information = Number(random(0,50)) + " C"
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
        console.log(e)
        console.log("Sensor Transaction reverted.")
    }
}


function createRandomID() {
    return Math.floor(100000 + Math.random() * 900000)
}


async function initializeSensors(_sessionID) {
    // repeat the interval session1, session2, etc very 60000milsec = 60sec.
    // window.variableName saves a global variable with dynamic naming for clearing the interval from another function
    eval('window.session' + _sessionID + ' = ' + setInterval(function() { sensorTransaction(_sessionID) }, 60000))
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


function sensorData() {
    var sessionID = document.getElementById("SensorData-sessionId").value
    var companyID = document.getElementById("SensorData-companyId").value

    getSensorData(sessionID, smartContractObjects, companyID)

    // reset values to the placeholder
    document.getElementById("SensorData-sessionId").value = ""
    document.getElementById("SensorData-companyId").value = ""
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


// hash the ID with keccak256 and get modulo the number of servers
export function hashAndModulo(x) {
    var hash = keccak256(x)
    var number = Number((hash[31]) % numberOfServers)
    // console.log("ID: " + x + " chain: " + number)
    return number
}


async function connectWithLoadBalancer(companyID, chainToCompanies, currentSession, portsUsed) {
    var chainNumber = await getChainIndex(companyID, chainToCompanies, currentSession, portsUsed, deployed)
    if (chainNumber.length === 5) {
        // a new chain is activated
        var items = chainNumber
        // smartContractAddresses.push(items[0])
        // smartContractObjects.push(items[1])
        // web3Instances.push(items[2])
        // userAddresses.push(items[3])
        portsUsed.push(items[4])
        numberOfServers++
        console.log("A new server was created.")
        indexOfNewServers.push(numberOfServers - 1)
        return numberOfServers - 1
    }
    return chainNumber
}


// if a transaction of this session is to be sent on a new chain we need to make sure that it is active and save its activity.
async function checkAndActivateSession(chainIndex, _sessionID) {
    const index = indexOfNewServers.indexOf(chainIndex);
    if (index > -1) {
        var oldSmartContract = smartContractObjects[0]
        var oldActive = await oldSmartContract.methods.isActive(_sessionID).call()

        var newSmartContract = smartContractObjects[chainIndex]
        var newActive = await newSmartContract.methods.isActive(_sessionID).call()

        if ((oldActive === true) && (newActive === false)) {
            var activateTransaction = await newSmartContract.methods.activateSession(_sessionID)
                                                              .send({from: userAddresses[chainIndex][0]})
        }
    }
}