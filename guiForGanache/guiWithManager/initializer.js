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
