import contractABI from "./ABI.js"

// used for the deployment of the contract along the ABI
var contractData = "0x608060405234801561001057600080fd5b50610b28806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063b6dbd8251161005b578063b6dbd825146100da578063ba256b5c146100f6578063c6e5a41914610112578063ce651c1a146101425761007d565b806333133b41146100825780636b856cd7146100a0578063b5a7ea06146100bc575b600080fd5b61008a61015e565b604051610097919061076f565b60405180910390f35b6100ba60048036038101906100b5919061062c565b6101ae565b005b6100c46101f2565b6040516100d1919061076f565b60405180910390f35b6100f460048036038101906100ef919061055e565b6101f8565b005b610110600480360381019061010b91906105b1565b6102c3565b005b61012c600480360381019061012791906104d5565b610369565b6040516101399190610714565b60405180910390f35b61015c60048036038101906101579190610502565b610389565b005b6000600180600082825461017291906108df565b925050819055506001600080600154815260200190815260200160002060006101000a81548160ff021916908315150217905550600154905090565b6101b661015e565b7f1bf43c4e75a7bff085adfa4cd1169f72e357c0b294df3682aa5e0a846fb4953082426040516101e79291906107f1565b60405180910390a250565b60015481565b60008084815260200190815260200160002060009054906101000a900460ff16610257576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161024e9061072f565b60405180910390fd5b827fd10cf7e55fd1ee438dcbd3db7f77f6cf1e212df7868df78c9b21682b046b67b683834260405161028b939291906107ba565b60405180910390a2600080600085815260200190815260200160002060006101000a81548160ff021916908315150217905550505050565b60008086815260200190815260200160002060009054906101000a900460ff16610322576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103199061074f565b60405180910390fd5b847f86d35a3e42d5a887505753c1790979e2cae4b70139b38a8e87e398deed56298f858585854260405161035a95949392919061081a565b60405180910390a25050505050565b60006020528060005260406000206000915054906101000a900460ff1681565b60008083815260200190815260200160002060009054906101000a900460ff166103e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103df9061072f565b60405180910390fd5b817f4303a873fbd8b09c053de5da9bd4246acb454c5c47b33a1446844caf71f86059428360405161041a92919061078a565b60405180910390a25050565b600061043961043484610892565b61086d565b90508281526020810184848401111561045557610454610a3b565b5b610460848285610965565b509392505050565b60008135905061047781610aad565b92915050565b600082601f83011261049257610491610a36565b5b81356104a2848260208601610426565b91505092915050565b6000813590506104ba81610ac4565b92915050565b6000813590506104cf81610adb565b92915050565b6000602082840312156104eb576104ea610a45565b5b60006104f9848285016104ab565b91505092915050565b6000806040838503121561051957610518610a45565b5b6000610527858286016104ab565b925050602083013567ffffffffffffffff81111561054857610547610a40565b5b6105548582860161047d565b9150509250929050565b60008060006060848603121561057757610576610a45565b5b6000610585868287016104ab565b9350506020610596868287016104c0565b92505060406105a786828701610468565b9150509250925092565b600080600080600060a086880312156105cd576105cc610a45565b5b60006105db888289016104ab565b95505060206105ec888289016104c0565b94505060406105fd888289016104c0565b935050606061060e88828901610468565b925050608061061f888289016104c0565b9150509295509295909350565b60006020828403121561064257610641610a45565b5b6000610650848285016104c0565b91505092915050565b61066281610935565b82525050565b61067181610941565b82525050565b6000610682826108c3565b61068c81856108ce565b935061069c818560208601610974565b6106a581610a4a565b840191505092915050565b60006106bd6012836108ce565b91506106c882610a5b565b602082019050919050565b60006106e06012836108ce565b91506106eb82610a84565b602082019050919050565b6106ff8161094b565b82525050565b61070e81610955565b82525050565b60006020820190506107296000830184610659565b92915050565b60006020820190508181036000830152610748816106b0565b9050919050565b60006020820190508181036000830152610768816106d3565b9050919050565b600060208201905061078460008301846106f6565b92915050565b600060408201905061079f60008301856106f6565b81810360208301526107b18184610677565b90509392505050565b60006060820190506107cf6000830186610705565b6107dc6020830185610668565b6107e960408301846106f6565b949350505050565b60006040820190506108066000830185610705565b61081360208301846106f6565b9392505050565b600060a08201905061082f6000830188610705565b61083c6020830187610705565b6108496040830186610668565b6108566060830185610705565b61086360808301846106f6565b9695505050505050565b6000610877610888565b905061088382826109a7565b919050565b6000604051905090565b600067ffffffffffffffff8211156108ad576108ac610a07565b5b6108b682610a4a565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60006108ea8261094b565b91506108f58361094b565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561092a576109296109d8565b5b828201905092915050565b60008115159050919050565b6000819050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b83811015610992578082015181840152602081019050610977565b838111156109a1576000848401525b50505050565b6109b082610a4a565b810181811067ffffffffffffffff821117156109cf576109ce610a07565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e6f74206163746976652073657373696f6e0000000000000000000000000000600082015250565b7f4e6f74206163746976652053657373696f6e0000000000000000000000000000600082015250565b610ab681610941565b8114610ac157600080fd5b50565b610acd8161094b565b8114610ad857600080fd5b50565b610ae481610955565b8114610aef57600080fd5b5056fea2646970667358221220e78c27c1be76e3ced00255758d27c53a3222aa53b0943d71908d0d5c92fdc78e64736f6c63430008070033"

var contractAddresses = []
var contractObjects = []
var addresses = []
var web3Instances = []
var counter = 0


// uncomment the code blocks based on the number of servers you want to activate
export function initializeWithoutData() {

    // create instances, get the accounts and deploy the smart contract for all the chains
    var web3_0 = new Web3('ws://localhost:8540')
    var stateandsessionContract_0 = new web3_0.eth.Contract(contractABI)
    saveAccountsDeployContract(web3_0, stateandsessionContract_0, 0)


    // var web3_1 = new Web3('ws://localhost:8541')
    // var stateandsessionContract_1 = new web3_1.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_1, stateandsessionContract_1, 1)

    // var web3_2 = new Web3('ws://localhost:8542')
    // var stateandsessionContract_2 = new web3_2.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_2, stateandsessionContract_2, 2)

    // var web3_3 = new Web3('ws://localhost:8543')
    // var stateandsessionContract_3 = new web3_3.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_3, stateandsessionContract_3, 3)

    // var web3_4 = new Web3('ws://localhost:8544')
    // var stateandsessionContract_4 = new web3_4.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_4, stateandsessionContract_4, 4)

    // var web3_5 = new Web3('ws://localhost:8545')
    // var stateandsessionContract_5 = new web3_5.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_5, stateandsessionContract_5, 5)

    // var web3_6 = new Web3('ws://localhost:8546')
    // var stateandsessionContract_6 = new web3_6.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_6, stateandsessionContract_6, 6)

    // var web3_7 = new Web3('ws://localhost:8547')
    // var stateandsessionContract_7 = new web3_7.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_7, stateandsessionContract_7, 7)

    // var web3_8 = new Web3('ws://localhost:8548')
    // var stateandsessionContract_8 = new web3_8.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_8, stateandsessionContract_8, 8)

    // var web3_9 = new Web3('ws://localhost:8549')
    // var stateandsessionContract_9 = new web3_9.eth.Contract(contractABI)
    // saveAccountsDeployContract(web3_9, stateandsessionContract_9, 9)

    return([addresses, contractObjects, contractAddresses, web3Instances, counter])
}


function saveAccountsDeployContract(web3_instance, stateandsessionContract, i) {
    counter++
    web3_instance.eth.getAccounts().then( fetchedAccounts => {
                                        // console.log(fetchedAccounts)
                                        addresses.push(fetchedAccounts)
                                        var max = fetchedAccounts.length
                                        stateandsessionContract.deploy({data: contractData, arguments: []})
                                                        .send({from: fetchedAccounts[random(0, max)], gas: '15000000'})
                                                        .then( (contractCreated) => {
                                                            console.log('Contract mined for chain ' + i +'. Address: ' + contractCreated.options.address)
                                                            contractAddresses.push(contractCreated.options.address)
                                                            contractObjects.push(new web3_instance.eth.Contract(contractABI, contractCreated.options.address))
                                                            web3Instances.push(web3_instance)
                                                    })
                                            })
}


// get random integer in [min, max)
export function random(min, max) {
    return (Math.floor(Math.random()*(max - min)) + min)
}