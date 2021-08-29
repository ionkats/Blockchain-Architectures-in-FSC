export async function tracebackThroughBlockChain(transaction, chainIndex, sessionID, web3Instances) {
    var currentChain = chainIndex
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

        if (isItStartSession(topics[0])) {
            values = handleStartEvent(data)
            tracebackDone = true
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("StartOfSession")

        }else if (isItHandoff(topics[0])) {
            console.log("gotIn")
            values = handleHandoffEvent(data)
            currentTransactionHash = "0x" + values[2]
            currentChain = values[3]
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("Handoff")

        }else if (isItEndSession(topics[0])){
            values = handleEndEvent(data)
            currentTransactionHash = "0x" + values[1]
            values.unshift("Session " + sessionID)
            values.unshift("Chain " + currentChain)
            values.unshift("EndOfSession")

        }else if (isItSensorLog(topics[0])) {
            console.log("found a sensor log at chain: " + currentChain + 
                        "info" + receipt)
            return false
        }

        console.log(values)
        transactionsChecked.push(currentTransactionHash)
    }
    console.log(transactionsChecked)
    return true
}


// check if the session of this transaction hash is the one that needs to be tracebacked
function rightSession(topic, sessionID) {
    var session = parseInt(topic, 16)
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
    // keccak256('StartOfSession(uint256,uint32,uint256)').toString('hex')
    var hash = "0x1bf43c4e75a7bff085adfa4cd1169f72e357c0b294df3682aa5e0a846fb49530"
    return (eventSignature === hash)
}


function isItHandoff(eventSignature) {
    // keccak256('Handoff(uint256,uint32,uint32,bytes32,uint32,uint256)').toString('hex')
    var hash =  "0x86d35a3e42d5a887505753c1790979e2cae4b70139b38a8e87e398deed56298f"
    return (eventSignature === hash)
}


function isItEndSession(eventSignature) {
    // keccak256('EndOfSession(uint256,uint32,bytes32,uint256)').toString('hex')
    var hash = "0xd10cf7e55fd1ee438dcbd3db7f77f6cf1e212df7868df78c9b21682b046b67b6"
    return (eventSignature === hash)
}


function isItSensorLog(eventSignature) {
    // keccak256('SensorLog(uint256,uint256,string)').toString('hex')
    var hash = "0x4303a873fbd8b09c053de5da9bd4246acb454c5c47b33a1446844caf71f86059"
    return (eventSignature === hash)
}


// // Convert a hex string to a byte array
// function hexToBytes(hex) {
//     for (var bytes = [], c = 0; c < hex.length; c += 2)
//     bytes.push(parseInt(hex.substr(c, 2), 16));
//     return bytes;
// }

// // Convert a byte array to a hex string
// function bytesToHex(bytes) {
//     for (var hex = [], i = 0; i < bytes.length; i++) {
//         var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
//         hex.push((current >>> 4).toString(16));
//         hex.push((current & 0xF).toString(16));
//     }
//     return hex.join("");
// }
