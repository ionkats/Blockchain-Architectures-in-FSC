// const keccak256 = require('keccak256')

export function tracebackThroughBlockChain(transaction, chainIndex, sessionID, web3Instances) {
    var currentChain = chainIndex
    var currentTransactionHash = transaction
    var tracebackDone = false
    while (!tracebackDone) {
        var web3_instance = web3Instances[currentChain]
        // console.log(web3_instance.eth.getTransactionReceipt(currentTransactionHash))
        // console.log(web3_instance.eth.getTransactionReceipt(currentTransactionHash).logs)
        var topics = web3_instance.eth.getTransactionReceipt(currentTransactionHash).logs[0].topics
        console.log(topics)
        var data = web3_instance.eth.getTransactionReceipt(currentTransactionHash).logs[0].data
        console.log(data)

        if (!rightSession(topics[1], sessionID)) {
            alert("Not right session with the Transaction Hash")
            return false
        }

        if (isItStartSession(topics[0])) {
            values = handleStartEvent(data)
            tracebackDone = true

        }else if (isItHandoff(topics[0])) {
            values = handleHandoffEvent(data)
            currentTransactionHash = values[2]
            currentChain = values[3]

        }else if (isItEndSession(topics[0])){
            values = handleEndEvent(data)
            currentTransactionHash = values[1]

        }else if (isItSensorLog(topics[0])) {
            console.log("found a sensor log at chain: " + currentChain + 
                        "info" + web3_instance.eth.getTransactionReceipt(currentTransactionHash))
            return false
        }

        console.log(values)
    }
    return true
}


// check if the session of this transaction hash is the one that needs to be tracebacked
function rightSession(topic, sessionID) {
    var hexString = bytesToHex(topic)
    var session = parseInt(hexString, 16)
    return (session === sessionID)
}


function handleStartEvent(data) {
    // 2 values in data 
    // userID || time
    var userID = parseInt(data.slice(0, data.length - 64), 16)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    return [userID, timestamp]
}


function handleHandoffEvent(data) {
    // 5 values in data 
    // previousUserID || newUserID || previousStateTransactionHash || previousChainIndex || time
    var previousUserID = parseInt(data.slice(data.length - 320, data.length - 256), 16)
    var newUserID = parseInt(data.slice(data.length - 256, data.length - 192), 16)
    var previousStateTransactionHash = data.slice(data.length - 192, data.length - 128)
    var previousChainIndex = parseInt(data.slice(data.length - 128, data.length - 64), 16)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    return [previousUserID, newUserID, previousStateTransactionHash, previousChainIndex, timestamp]
}


function handleEndEvent(data) {
    // 3 values in data
    // userID || previousTransactionHash || time
    var userID = parseInt(data.slice(data.length - 192, data.length - 128), 16)
    var previousTransactionHash = data.slice(data.length - 128, data.length - 64)
    var timestamp = parseInt(data.slice(data.length - 64), 16)
    return [userID, previousTransactionHash, timestamp]
}


function isItStartSession(eventSignature) {
    var hash = keccak256('StartOfSession(uint256,uint32,uint256)').toString('hex')
    // var hash = Crypto.createHash('keccak256').update("StartOfSession(uint256,uint32,uint256)").digest('hex');
    return (eventSignature === hash)
}


function isItHandoff(eventSignature) {
    var hash = keccak256('Handoff(uint256,uint32,uint32,bytes32,uint32,uint256)').toString('hex')
    // var hash = crypto.createHash('keccak256').update("Handoff(uint256,uint32,uint32,bytes32,uint32,uint256)").digest('hex');
    return (eventSignature === hash)
}


function isItEndSession(eventSignature) {
    var hash = keccak256('EndOfSession(uint256,uint32,bytes32,uint256)').toString('hex')
    // var hash = crypto.createHash('keccak256').update("EndOfSession(uint256,uint32,bytes32,uint256)").digest('hex');
    return (eventSignature === hash)
}


function isItSensorLog(eventSignature) {
    var hash = keccak256('SensorLog(uint256,uint256,string)').toString('hex')
    // var hash = crypto.createHash('keccak256').update("SensorLog(uint256,uint256,string)").digest('hex');
    return (eventSignature === hash)
}


// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}
