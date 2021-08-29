import contractABI from "./ABI.js"

// deployment of the contracts for every web3 provider needed from the Remix environment

// data for server 0
var contract0 = "0x9B40924Ec83eeC3E480b1C691dA4D7D4340A193f"
// data for server 1
var contract1 = "0x35f6c6d49d9CC35dCcC08fA877726cca0DCB26CD"
// data for server 2
var contract2 = "0x519a24e631795b46167d3d73F83832c92632C127"
// data for server 3
var contract3 = "0x58E12eAa9a3B79Bf9DE06D573F52A3C4E9699c4E"
// data for server 4
var contract4 = "0x4C0Ce8850F6D931F92ce3ae4dd0c59a90CcA55Cb"
// data for server 5
var contract5 = "0xd69eD992A072F1c59dd04225A5ceBC14855E9448"
// data for server 6
var contract6 = "0x8F2DeED763a8DB8FC12EC357802e3FBc89a7CB0b"
// data for server 7
var contract7 = "0xA52b9a7BCdD15Bb206d3A0801E749188949f7F9A"
// data for server 8
var contract8 = "0x289E2FD30d203ddc5d5D68C76080a56aBD3c4Ab3"
// data for server 9
var contract9 = "0x0a3074056385C8b81a68fC69bF67eCcbFBA85A85"

var contractAddresses = []
var contractObjects = []
var addresses = []
var web3Instances = []

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
    
    // console.log([addresses, contractObjects, contractAddresses, web3Instances])
    return([addresses, contractObjects, contractAddresses, web3Instances])
}


function pushData(web3_instance, contractAdr) {
    web3_instance.eth.getAccounts().then( fetchedAccounts => {
        // console.log(fetchedAccounts)
        addresses.push(fetchedAccounts)
            })
    contractAddresses.push(contractAdr)
    var smartContract = new web3_instance.eth.Contract(contractABI, contractAdr)
    contractObjects.push(smartContract)
    web3Instances.push(web3_instance)
}
