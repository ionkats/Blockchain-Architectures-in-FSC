import { createNewServer } from "./initializerWithoutData.js"
import { hashAndModulo } from "./system.js"

var userAddresses
var smartContractObjects
var smartContractAddresses
var web3Instances
var numberOfServers
const GASLIMIT = 15000000


export function initializeManager(data) {
    userAddresses = data[0]
    smartContractObjects = data[1]
    smartContractAddresses = data[2]
    web3Instances = data[3]
    numberOfServers = data[4]
}


// get the first digit of the userID and match it to a number from 0 to numberOfServers
function IDToChainNumber(companyID, chainToCompanies, deployed) {
    var chainFromCompID = chainToCompanies[companyID]
    var hasAlready = true
    if (chainFromCompID === undefined) {
        // chainFromCompID = digitToServer(getFirstDigit(companyID))
        chainFromCompID = hashAndModulo(companyID)
        hasAlready = true
    } 
    if (deployed) {
        chainToCompanies[companyID] = chainFromCompID 
    }
    return chainFromCompID
}


// get the chain number of this company by checking the load on the chain assigned to it
export async function getChainIndex(companyID, chainToCompanies, currentSession, activeSessions, portsUsed, deployed) {
    var validLoadNotFound = false
    var currentChain = IDToChainNumber(companyID, chainToCompanies, deployed)
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
        items.push(port)
        // alert("Need to create new server.")
        return items
    } else {
        alert("An error at the getChainIndex function, needs debugging. Sorry for the inconvenience")
        return
    }
}


// check if over 85% of gas is used on the last 5 blocks
async function decentLoadOnChain(web3_instance) {
    var result = true
    var blockNumber = await web3_instance.eth.getBlock("latest")
    var pendingTransactions = await web3_instance.eth.getPendingTransactions
    // console.log("There are " + pendingTransactions.length + " pending transactions.")
    for (var i=0; i < 1; i++) {
        var blockData = await web3_instance.eth.getBlock(blockNumber.number - i)
                                                .then(function (block) {
                                                    // console.log("Block number " + block.number + " has size " + block.size + " bytes.")
                                                    if (block.gasUsed > 0.15*GASLIMIT) {
                                                        result = false
                                                    }
                                                })
    }
    return result
}


// I want a function f: [9] -> [#servers] => f(x) = floor[x / (10/#servers)] with a max amount of servers of 10           
// e.g. for 2 servers f(4) = 4/5 = floor(0.8) = 0, f(5) = 1 => {0,1,2,3,4}->0, {5,6,7,8,9}->1
//      for 3 servers f(3) = fl(3/3.33) = 0, f(4) = 4/3.33 = 1, f(7) = 7/3.33 = 2 => {0,1,2,3}->0, {4,5,6}->1, {7,8,9}->2
export function digitToServer(x) {
    return (Math.floor((x) / (10/numberOfServers)))
}


// get the first digit of the id number
export function getFirstDigit(id) {
    return (Number(String(id).charAt(0)))
}