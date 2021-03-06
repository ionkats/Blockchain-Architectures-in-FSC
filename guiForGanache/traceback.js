export async function tracebackThroughBlockChain(transaction, chainIndex, sessionID, web3Instances) {
    
    var currentChain = Number(chainIndex)
    var currentTransactionHash = transaction
    var tracebackDone = false
    var transactionsChecked = [currentTransactionHash]
    while (!tracebackDone) {
        var values
        var web3_instance = web3Instances[currentChain]
        var receipt = await web3_instance.eth.getTransactionReceipt(currentTransactionHash);

        while(receipt == null){
            receipt = await web3_instance.eth.getTransactionReceipt(currentTransactionHash);
        }

        var topics = receipt.logs[0].topics
        var data = receipt.logs[0].data
        
        if (!rightSession(topics[1], Number(sessionID))) {
            alert("Not right session with the Transaction Hash")
            return false
        }
        
        transactionsChecked.push(currentTransactionHash)

        if (isItStartSession(topics[0])) {
            values = handleStartEvent(data)
            tracebackDone = true
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("StartOfSession")

        }else if (isItHandoff(topics[0])) {
            values = handleHandoffEvent(data)
            currentTransactionHash = "0x" + values[4]
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("Handoff")
            currentChain = values[8]
            
        }else if (isItEndSession(topics[0])){
            values = handleEndEvent(data)
            currentTransactionHash = "0x" + values[2]
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("EndOfSession")

        }else if (isItSensorLog(topics[0])) {
            console.log("Found a sensor log at chain: " + currentChain + 
                        "info" + receipt)
            return false
        }

        console.log(values)
    }
    // console.log(transactionsChecked)
    return true
}


// check if the session of this transaction hash is the one that needs to be tracebacked
function rightSession(topic, sessionID) {
    var session = parseInt(topic, 16)
    return (session === sessionID)
}


function handleStartEvent(data) {
    // 3 values in data 
    // companyID || userID || time
    var companyID = parseInt(data.slice(data.length - 192, data.length - 128), 16)
    var userID = data.slice(data.length - 128, data.length - 64)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    var date = new Date(timestamp*1000)
    return [companyID, userID, date]
}


function handleHandoffEvent(data) {
    // 7 values in data 
    // previousCompanyID || previousUserID || newCompanyID || newUserID || previousStateTransactionHash || previousChainIndex || time
    var previousCompanyID = parseInt(data.slice(data.length - 448, data.length - 384), 16)
    var previousUserID = parseInt(data.slice(data.length - 384, data.length - 320), 16)
    var newCompanyID = parseInt(data.slice(data.length - 320, data.length - 256), 16)
    var newUserID = parseInt(data.slice(data.length - 256, data.length - 192), 16)
    var previousStateTransactionHash = data.slice(data.length - 192, data.length - 128)
    var previousChainIndex = parseInt(data.slice(data.length - 128, data.length - 64), 16)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    var date = new Date(timestamp*1000)
    return [previousCompanyID, previousUserID, newCompanyID, newUserID, previousStateTransactionHash, previousChainIndex, date]
}


function handleEndEvent(data) {
    // 4 values in data
    // companyID || userID || previousTransactionHash || time
    var companyID = parseInt(data.slice(data.length - 256, data.length - 192), 16)
    var userID = parseInt(data.slice(data.length - 192, data.length - 128), 16)
    var previousTransactionHash = data.slice(data.length - 128, data.length - 64)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    var date = new Date(timestamp*1000)
    return [companyID, userID, previousTransactionHash, date]
}


function isItStartSession(eventSignature) {
    // keccak256('StartOfSession(uint256,uint32,uint32,uint256)').toString('hex')
    var hash = "0xe49c753973c097158927b5bacda348e5d3e7b9662f88bc97727320f8774fc9d4"
    return (eventSignature === hash)
}


function isItHandoff(eventSignature) {
    // keccak256('Handoff(uint256,uint32,uint32,uint32,uint32,bytes32,uint32,uint256)').toString('hex')
    var hash =  "0x9d87175ef8e1fec360aa582266352274b86963b1c6c91d27eed1db8bcfef3bec"
    return (eventSignature === hash)
}


function isItEndSession(eventSignature) {
    // keccak256('EndOfSession(uint256,uint32,uint32,bytes32,uint256)').toString('hex')
    var hash = "0xe6655d3159cc6b5ce597695101ccc8db461698722e61567bd06e3add094898f2"
    return (eventSignature === hash)
}


function isItSensorLog(eventSignature) {
    // keccak256('SensorLog(uint256,uint32,string,uint256)').toString('hex')
    var hash = "0x26bcc523a5e3b94458b5967eece5212cfdc664966710cb8648480b5b0d343956"
    return (eventSignature === hash)
}


export async function searchForEndSession(_sessionID, contracts) {
    var exitLoop = false
    var i = 0
    while (!exitLoop) {
        var events = await contracts[i].getPastEvents('EndOfSession', {
                                                        filter: {sessionID: _sessionID},
                                                        fromBlock: 'earliest',
                                                        toBlock: 'latest'})
                                        .then(function(events) {
                                            if (events.length === 1) {
                                                return [events[0].transactionHash, true]
                                            } else if (events.length > 1) {
                                                console.log("Found more that one events.")
                                                console.log(events)
                                            }
                                            if (i < (contracts.length - 1)) {
                                                console.log("End of session not found on chain " + i + ".")
                                                i++
                                                return ["", false]
                                            } else {
                                                console.log("Filtering did not work, maybe the session hasn't ended.")
                                            }
                                            //for exiting the loop 
                                            return ["", true]
                                        })
        exitLoop = events[1]
    }
    return [i, events[0]]
}


export async function getSensorData(_sessionID, contracts, _companyID) {
    var exitLoop = false
    var i = 0
    while (!exitLoop) {
        var data = await contracts[i].getPastEvents('SensorLog', {
                                                        filter: {sessionID: _sessionID, companyID: _companyID},
                                                        fromBlock: 'earliest',
                                                        toBlock: 'latest'})
                                        .then(function(events) {
                                            for (var j = 0; j < events.length; j++) {
                                                var thisEvent = events[j].returnValues
                                                var date = new Date(Number(thisEvent.time)*1000)
                                                console.log(["Sensor Log", thisEvent.sessionID, thisEvent.companyID, thisEvent.info, date])
                                                exitLoop = true
                                            }
                                            if (exitLoop) {return true}
                                            if (events.length === 0 || i < (contracts.length - 1)) {
                                                console.log("Sensor logs not found on chain " + i +".")
                                                i += 1
                                            } else {
                                                console.log("Sensor data not found.")
                                                return true
                                            }
                                        })
        exitLoop = data
    }
    return
}


// get the index of the chain for the company by retrieving the data of the events from the chains,
// only in case of the first handoff transaction and the end session. 
export async function getIndexThroughChains(_sessionID, contracts, _companyID) {
    var exitLoop = false
    var i = 0
    var specificEvents = []
    var gotHandoff = false

    if (contracts.length === 1) {
        return 0
    }

    while (!exitLoop) {
        // search for start of session transaction
        if (!gotHandoff) {
            var startIndex = await contracts[i].getPastEvents('StartOfSession', {
                                                            filter: {sessionID: _sessionID},
                                                            fromBlock: 'earliest',
                                                            toBlock: 'latest'})
                                            .then(function(events) {
                                                if (events.length != 0) {
                                                    if (Number(events[0].returnValues.companyID) === _companyID) {
                                                        // console.log("Found Here start session at " + i)
                                                        return i
                                                    }
                                                } 
                                                return "Not Found Here"
                                            })
            if (startIndex != "Not Found Here") {
                return startIndex
            }
        }

        // search for handoff transaction
        var handoffIndex = await contracts[i].getPastEvents('Handoff', {
                                                        filter: {sessionID: _sessionID},
                                                        fromBlock: 'earliest',
                                                        toBlock: 'latest'})
                                            .then(function(events) {
                                                for (var j = 0; j < events.length; j++) {
                                                    if (Number(events[j].returnValues.newCompanyID) === _companyID) {
                                                        specificEvents.push([events[j], i])
                                                        gotHandoff = true
                                                        // console.log("Found a handoff at " + i)
                                                    }
                                                }
                                                return "No"
                                            })
        if ((i + 1) < contracts.length) {
            i++ 
        } else {
            exitLoop = true
        } 
    }

    if (specificEvents.length >= 2) {
        var maxTime = Number(specificEvents[0][0].returnValues.time)
        var index = 0
        for (var k = 1; k < specificEvents.length; k++) {
            if (Number(specificEvents[k][0].returnValues.time) > maxTime) {
                maxTime = Number(specificEvents[k][0].returnValues.time)
                index = specificEvents[k][1]
            }
        }
        return index
    } else {
        console.log("Haven't found an event for this session an all the chains. ")
        return 0
        // throw new Error("Problem at getting index through chains function.")
    }
} 