import contractABI from "./ABI.js"

// deployment of the contracts for every web3 provider needed from the Remix environment

// data for server 0
var contract0 = "0xFdd0f11842640821CF269891Ba8182CaB4B9e02E"
// data for server 1
var contract1 = "0x0833ad0229Ed76C8d8da786Ad0Ce9631f00D12e9"
// data for server 2
var contract2 = "0x872ABAf6Ab0bEb2e81afF8CB642BBb570Ec07DdB"
// data for server 3
var contract3 = "0x9a39dF1e0BDAa303912ab589c458C4E6385297D1"
// data for server 4
var contract4 = "0x7e241fa3f7456e8D595DDB6F1583B658d4e555E2"
// data for server 5
var contract5 = "0x53d838e117aFe124e882E42E2fB3186860BDf3d7"
// data for server 6
var contract6 = "0x9EF827ca65E6a7cEA3030F227dA91D120530EBF4"
// data for server 7
var contract7 = "0xDeE920d9AE825016f64f34Fbd30b6b6fa6DCa17E"
// data for server 8
var contract8 = "0x57cADe39E22c4Af5f9fc5c13DEe8315AC0D13749"
// data for server 9
var contract9 = "0x93fdD28401B8084ACc174D1Ed7024dd2A22ea6d5"

var contractAddresses = []
var contractObjects = []
var addresses = []

// uncomment the code blocks based on the number of servers you want to activate
export function initialize() {
    var web3_0 = new Web3('ws://localhost:8540')
    pushData(web3_0, contract0)

    // var web3_1 = new Web3('ws://localhost:8541')
    // pushData(web3_1, contract1)

    // var web3_2 = new Web3('ws://localhost:8542')
    // pushData(web3_2, contract2)

    // var web3_3 = new Web3('ws://localhost:8543')
    // pushData(web3_3, contract3)

    // var web3_4 = new Web3('ws://localhost:8544')
    // pushData(web3_4, contract4)

    // var web3_5 = new Web3('ws://localhost:8545')
    // pushData(web3_5, contract5)

    // var web3_6 = new Web3('ws://localhost:8546')
    // pushData(web3_6, contract6)

    // var web3_7 = new Web3('ws://localhost:8547')
    // pushData(web3_7, contract7)

    // var web3_8 = new Web3('ws://localhost:8548')
    // pushData(web3_8, contract8)

    // var web3_9 = new Web3('ws://localhost:8549')
    // pushData(web3_9, contract9)

    return([addresses, contractObjects, contractAddresses])
}


function pushData(web3_instance, contractAdr) {
    web3_instance.eth.getAccounts().then( fetchedAccounts => {
        console.log(fetchedAccounts)
        addresses.push(fetchedAccounts)
        contractAddresses.push(contractAdr)
        contractObjects.push(new web3_instance.eth.Contract(contractABI, contractAdr))
            })
}
