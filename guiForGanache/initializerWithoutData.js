import contractABI from "./ABI.js"

// used for the deployment of the contract along the ABI
var contractData = "0x608060405234801561001057600080fd5b50610ba1806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80639adf3c231161005b5780639adf3c23146100d8578063b5a7ea06146100f4578063c6e5a41914610112578063f1e99adb146101425761007d565b80631094145a1461008257806333133b411461009e5780634515e8d9146100bc575b600080fd5b61009c6004803603810190610097919061050a565b61015e565b005b6100a6610203565b6040516100b391906107f4565b60405180910390f35b6100d660048036038101906100d191906105d4565b610253565b005b6100f260048036038101906100ed9190610672565b6102ff565b005b6100fc610346565b60405161010991906107f4565b60405180910390f35b61012c600480360381019061012791906104e1565b61034c565b6040516101399190610769565b60405180910390f35b61015c60048036038101906101579190610571565b61036c565b005b60008084815260200190815260200160002060009054906101000a900460ff166101bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101b4906107b4565b60405180910390fd5b8163ffffffff16837f26bcc523a5e3b94458b5967eece5212cfdc664966710cb8648480b5b0d34395683426040516101f6929190610784565b60405180910390a3505050565b60006001806000828254610217919061096c565b925050819055506001600080600154815260200190815260200160002060006101000a81548160ff021916908315150217905550600154905090565b60008088815260200190815260200160002060009054906101000a900460ff166102b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102a9906107d4565b60405180910390fd5b867f9d87175ef8e1fec360aa582266352274b86963b1c6c91d27eed1db8bcfef3bec878787878787426040516102ee979695949392919061088b565b60405180910390a250505050505050565b610307610203565b7fe49c753973c097158927b5bacda348e5d3e7b9662f88bc97727320f8774fc9d483834260405161033a93929190610854565b60405180910390a25050565b60015481565b60006020528060005260406000206000915054906101000a900460ff1681565b60008085815260200190815260200160002060009054906101000a900460ff166103cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103c2906107b4565b60405180910390fd5b837fe6655d3159cc6b5ce597695101ccc8db461698722e61567bd06e3add094898f284848442604051610401949392919061080f565b60405180910390a2600080600086815260200190815260200160002060006101000a81548160ff02191690831515021790555050505050565b600061044d6104488461091f565b6108fa565b90508281526020810184848401111561046557600080fd5b6104708482856109f2565b509392505050565b60008135905061048781610b26565b92915050565b600082601f83011261049e57600080fd5b81356104ae84826020860161043a565b91505092915050565b6000813590506104c681610b3d565b92915050565b6000813590506104db81610b54565b92915050565b6000602082840312156104f357600080fd5b6000610501848285016104b7565b91505092915050565b60008060006060848603121561051f57600080fd5b600061052d868287016104b7565b935050602061053e868287016104cc565b925050604084013567ffffffffffffffff81111561055b57600080fd5b6105678682870161048d565b9150509250925092565b6000806000806080858703121561058757600080fd5b6000610595878288016104b7565b94505060206105a6878288016104cc565b93505060406105b7878288016104cc565b92505060606105c887828801610478565b91505092959194509250565b600080600080600080600060e0888a0312156105ef57600080fd5b60006105fd8a828b016104b7565b975050602061060e8a828b016104cc565b965050604061061f8a828b016104cc565b95505060606106308a828b016104cc565b94505060806106418a828b016104cc565b93505060a06106528a828b01610478565b92505060c06106638a828b016104cc565b91505092959891949750929550565b6000806040838503121561068557600080fd5b6000610693858286016104cc565b92505060206106a4858286016104cc565b9150509250929050565b6106b7816109c2565b82525050565b6106c6816109ce565b82525050565b60006106d782610950565b6106e1818561095b565b93506106f1818560208601610a01565b6106fa81610ac3565b840191505092915050565b600061071260128361095b565b915061071d82610ad4565b602082019050919050565b600061073560128361095b565b915061074082610afd565b602082019050919050565b610754816109d8565b82525050565b610763816109e2565b82525050565b600060208201905061077e60008301846106ae565b92915050565b6000604082019050818103600083015261079e81856106cc565b90506107ad602083018461074b565b9392505050565b600060208201905081810360008301526107cd81610705565b9050919050565b600060208201905081810360008301526107ed81610728565b9050919050565b6000602082019050610809600083018461074b565b92915050565b6000608082019050610824600083018761075a565b610831602083018661075a565b61083e60408301856106bd565b61084b606083018461074b565b95945050505050565b6000606082019050610869600083018661075a565b610876602083018561075a565b610883604083018461074b565b949350505050565b600060e0820190506108a0600083018a61075a565b6108ad602083018961075a565b6108ba604083018861075a565b6108c7606083018761075a565b6108d460808301866106bd565b6108e160a083018561075a565b6108ee60c083018461074b565b98975050505050505050565b6000610904610915565b90506109108282610a34565b919050565b6000604051905090565b600067ffffffffffffffff82111561093a57610939610a94565b5b61094382610ac3565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b6000610977826109d8565b9150610982836109d8565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156109b7576109b6610a65565b5b828201905092915050565b60008115159050919050565b6000819050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b83811015610a1f578082015181840152602081019050610a04565b83811115610a2e576000848401525b50505050565b610a3d82610ac3565b810181811067ffffffffffffffff82111715610a5c57610a5b610a94565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4e6f74206163746976652073657373696f6e0000000000000000000000000000600082015250565b7f4e6f74206163746976652053657373696f6e0000000000000000000000000000600082015250565b610b2f816109ce565b8114610b3a57600080fd5b50565b610b46816109d8565b8114610b5157600080fd5b50565b610b5d816109e2565b8114610b6857600080fd5b5056fea2646970667358221220d22c47bef56aca93f36a926dd0d0cde7ea112b7415f8989562db297841afe46664736f6c63430008040033"

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
                                        var max = fetchedAccounts.length
                                        stateandsessionContract.deploy({data: contractData, arguments: []})
                                                        .send({from: fetchedAccounts[random(0, max)], gas: '2000000'})
                                                        .then( (contractCreated) => {
                                                            console.log('Contract mined for chain index ' + (contractAddresses.length) +'. Address: ' + contractCreated.options.address)
                                                            console.log('Address of server ends in ' + i)
                                                            contractAddresses.push(contractCreated.options.address)
                                                            contractObjects.push(new web3_instance.eth.Contract(contractABI, contractCreated.options.address))
                                                            web3Instances.push(web3_instance)
                                                            addresses.push(fetchedAccounts)
                                                    })
                                            })
}


// get random integer in [min, max)
export function random(min, max) {
    return (Math.floor(Math.random()*(max - min)) + min)
}