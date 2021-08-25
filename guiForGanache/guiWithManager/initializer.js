import contractABI from "./ABI.js"

// deployment of the contracts for every web3 provider needed from the Remix environment

// data for server 0
var address0 = "0xe42B94f361d9d1e1c2612F086874be583D8B7169"
var contract0 = "0xFdd0f11842640821CF269891Ba8182CaB4B9e02E"
// data for server 1
var address1 = "0x3ED59637C0E6f932843943E32C1F40Dd1AFeAa3c"
var contract1 = "0x0833ad0229Ed76C8d8da786Ad0Ce9631f00D12e9"
// data for server 2
var address2 = "0xf9271BEf90dc568bADB5586Fa454782F7b1124e4"
var contract2 = "0x872ABAf6Ab0bEb2e81afF8CB642BBb570Ec07DdB"
// data for server 3
var address3 = "0x6c5566D2F2A8f14B91C5a0BF2bcEbCc7814f167a"
var contract3 = "0x9a39dF1e0BDAa303912ab589c458C4E6385297D1"
// data for server 4
var address4 = "0xd65861530872DA517d62e471bB0b1f7c08623e69"
var contract4 = "0x7e241fa3f7456e8D595DDB6F1583B658d4e555E2"
// data for server 5
var address5 = "0xAC209887AeCD4F0081A19020534DBc00EE19f01f"
var contract5 = "0x53d838e117aFe124e882E42E2fB3186860BDf3d7"
// data for server 6
var address6 = "0x0be0c7344c2C32F9ec58E92bcA34e6019F4cFc3D"
var contract6 = "0x9EF827ca65E6a7cEA3030F227dA91D120530EBF4"
// data for server 7
var address7 = "0x075f849c0ab258C05Bc23Da5402746f7C9780631"
var contract7 = "0xDeE920d9AE825016f64f34Fbd30b6b6fa6DCa17E"
// data for server 8
var address8 = "0x28De9580FE2E9631BB903Ac2483b116aff8222E5"
var contract8 = "0x57cADe39E22c4Af5f9fc5c13DEe8315AC0D13749"
// data for server 9
var address9 = "0x009e89ebEf47A303aaB2b5fEe4c9b25468cF63C9"
var contract9 = "0x93fdD28401B8084ACc174D1Ed7024dd2A22ea6d5"

var contractAddresses = []
var contractObjects = []
var addresses = []

// uncomment the code blocks based on the number of servers you want to activate
export function initialize() {
    var web3_0 = new Web3('ws://localhost:8540')
    const smartContract0 = new web3_0.eth.Contract(contractABI, contract0)
    contractAddresses.push(contract0)
    addresses.push(address0)
    contractObjects.push(smartContract0)

    // var web3_1 = new Web3('ws://localhost:8541')
    // const smartContract1 = new web3_1.eth.Contract(contractABI, contract1)
    // contractAddresses.push(contract1)
    // addresses.push(address1)
    // contractObjects.push(smartContract1)

    // var web3_2 = new Web3('ws://localhost:8542')
    // const smartContract2 = new web3_2.eth.Contract(contractABI, contract2)
    // contractAddresses.push(contract2)
    // addresses.push(address2)
    // contractObjects.push(smartContract2)

    // var web3_3 = new Web3('ws://localhost:8543')
    // const smartContract3 = new web3_3.eth.Contract(contractABI, contract3)
    // contractAddresses.push(contract3)
    // addresses.push(address3)
    // contractObjects.push(smartContract3)

    // var web3_4 = new Web3('ws://localhost:8544')
    // const smartContract4 = new web3_4.eth.Contract(contractABI, contract4)
    // contractAddresses.push(contract4)
    // addresses.push(address4)
    // contractObjects.push(smartContract4)

    // var web3_5 = new Web3('ws://localhost:8545')
    // const smartContract5 = new web3_5.eth.Contract(contractABI, contract5)
    // contractAddresses.push(contract5)
    // addresses.push(address5)
    // contractObjects.push(smartContract5)

    // var web3_6 = new Web3('ws://localhost:8546')
    // const smartContract6 = new web3_6.eth.Contract(contractABI, contract6)
    // contractAddresses.push(contract6)
    // addresses.push(address6)
    // contractObjects.push(smartContract6)

    // var web3_7 = new Web3('ws://localhost:8547')
    // const smartContract7 = new web3_7.eth.Contract(contractABI, contract7)
    // contractAddresses.push(contract7)
    // addresses.push(address7)
    // contractObjects.push(smartContract7)

    // var web3_8 = new Web3('ws://localhost:8548')
    // const smartContract8 = new web3_8.eth.Contract(contractABI, contract8)
    // contractAddresses.push(contract8)
    // addresses.push(address8)
    // contractObjects.push(smartContract8)

    // var web3_9 = new Web3('ws://localhost:8549')
    // const smartContract9 = new web3_9.eth.Contract(contractABI, contract9)
    // contractAddresses.push(contract9)
    // addresses.push(address9)
    // contractObjects.push(smartContract9)

    return([addresses, contractObjects, contractAddresses])
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// INITIALIZATION WITH DYNAMIC NAMES WITH ADDRESS OF THE SMART CONTRACT (NOT WORKING)

// var numberOfServers = 3
// for (var i = 0; i < numberOfServers; i++) {
//     eval('var web3_' + i + ' = new Web3(\'ws://localhost:854'+i+'\')')
//     eval('const smartContract'+i+' = new web3_'+i+'.eth.Contract(contractABI, contract'+i+')')
//     eval('contractAddresses.push(contract'+i+')')
//     eval('addresses.push(address'+i+')')
//     eval('contractObjects.push(smartContract'+i+')')
// }

// DYNAMIC NAMING OF THE SERVERS AND AUTOMATE DEPLOYMENT OF THE CONTRACT (NOT WORKING)

// // address of the servers
// for (var i = 0; i <= 1; i++) {
//     eval('var web3_' + i + ' = new Web3()')
//     var x
//     eval('x = web3_' + i + '')
//     x.setProvider(new x.providers.HttpProvider('http://localhost:854' + i))
//     // eval('web3_' + i + '.setProvider(new web3_' + i + '.providers.HttpProvider(\'http://localhost:854' + i + '\'))')

//     // check if there is a connection
//     var flag
//     eval('flag = web3_'+ i + '.isConnected()')
//     if (!flag) {
//         console.log(i + 'is not connected.')
//     } else {
//         console.log(i + 'is connected.')
//     }
//     // create an object for the i_th contract
//     eval('var stateandsessionContract_' + i + ' = new web3_' + i + '.eth.Contract(contractABI)')
//     // deploy the contract in the i_th server
//     eval('var stateandsession_'+ i + '= stateandsessionContract_' + i + '.deploy({' +
//             +'data: contractData, arguments: []' +
//             +'}).send({'+
//             +'from: address' + i + ' ,'+
//             +'gas: \'20000000\''+
//             +'}, function (e, contract){'+
//                 // +'    console.log(e, contract)'+
//                 +'    if (typeof contract.address !== \'undefined\') {'+
//                         +'console.log(\'Contract mined! address: \' + contract.address + \' transactionHash: \' + contract.transactionHash)'+
//                         +'contactAddresses.push(contract.address)'+
//                 +'    }'+
//             +'}) ')
//     // get the object for further use
//     eval('contractObjects.push(statesandsessionContract_' + i + ')')

//     //create a list for the sender of transactions
//     eval('addresses.push(address' + i + ')')
// }