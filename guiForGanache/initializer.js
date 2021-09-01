import contractABI from "./ABI.js"

// deployment of the contracts for every web3 provider needed from the Remix environment

// data for server 0
var contract0 = "0xfac6463DD5658ddFb4BA6992d059A33fd936aEaF"
// data for server 1
var contract1 = "0x1C04ec2A594257ce47390f2A38757504614f4cd2"
// data for server 2
var contract2 = "0xA58307e8309E5d1c5027B5f78A3DD8Cd7D577B52"
// data for server 3
var contract3 = ""
// data for server 4
var contract4 = ""
// data for server 5
var contract5 = ""
// data for server 6
var contract6 = ""
// data for server 7
var contract7 = ""
// data for server 8
var contract8 = ""
// data for server 9
var contract9 = ""

var contractAddresses = []
var contractObjects = []
var addresses = []
var web3Instances = []
var counter = 0

// uncomment the code blocks based on the number of servers you want to activate
export function initialize() {
    var web3_0 = new Web3('ws://localhost:8540')
    pushData(web3_0, contract0)

    var web3_1 = new Web3('ws://localhost:8541')
    pushData(web3_1, contract1)

    var web3_2 = new Web3('ws://localhost:8542')
    pushData(web3_2, contract2)

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
    return([addresses, contractObjects, contractAddresses, web3Instances, counter])
}


function pushData(web3_instance, contractAdr) {
    counter++
    web3_instance.eth.getAccounts().then( fetchedAccounts => {
        // console.log(fetchedAccounts)
        addresses.push(fetchedAccounts)
        contractAddresses.push(contractAdr)
        var smartContract = new web3_instance.eth.Contract(contractABI, contractAdr)
        contractObjects.push(smartContract)
        web3Instances.push(web3_instance)
            })
}
