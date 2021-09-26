import contractABIStage from "./ABIStage.js"
import contractABINewChainStage from "./ABINewChainStage.js"
// used for the deployment of the contract along the ABI
var contractDataStage = "608060405234801561001057600080fd5b50610c05806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80639adf3c231161005b5780639adf3c2314610113578063b5a7ea061461012f578063c6e5a4191461014d578063f1e99adb1461017d57610088565b80631094145a1461008d57806333133b41146100a95780634515e8d9146100c757806382afd23b146100e3575b600080fd5b6100a760048036038101906100a2919061056e565b610199565b005b6100b161023e565b6040516100be9190610858565b60405180910390f35b6100e160048036038101906100dc9190610638565b61028e565b005b6100fd60048036038101906100f89190610545565b61033a565b60405161010a91906107cd565b60405180910390f35b61012d600480360381019061012891906106d6565b610363565b005b6101376103aa565b6040516101449190610858565b60405180910390f35b61016760048036038101906101629190610545565b6103b0565b60405161017491906107cd565b60405180910390f35b610197600480360381019061019291906105d5565b6103d0565b005b60008084815260200190815260200160002060009054906101000a900460ff166101f8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ef90610818565b60405180910390fd5b8163ffffffff16837f26bcc523a5e3b94458b5967eece5212cfdc664966710cb8648480b5b0d34395683426040516102319291906107e8565b60405180910390a3505050565b6000600180600082825461025291906109d0565b925050819055506001600080600154815260200190815260200160002060006101000a81548160ff021916908315150217905550600154905090565b60008088815260200190815260200160002060009054906101000a900460ff166102ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e490610838565b60405180910390fd5b867f9d87175ef8e1fec360aa582266352274b86963b1c6c91d27eed1db8bcfef3bec8787878787874260405161032997969594939291906108ef565b60405180910390a250505050505050565b600080600083815260200190815260200160002060009054906101000a900460ff169050919050565b61036b61023e565b7fe49c753973c097158927b5bacda348e5d3e7b9662f88bc97727320f8774fc9d483834260405161039e939291906108b8565b60405180910390a25050565b60015481565b60006020528060005260406000206000915054906101000a900460ff1681565b60008085815260200190815260200160002060009054906101000a900460ff1661042f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161042690610818565b60405180910390fd5b837fe6655d3159cc6b5ce597695101ccc8db461698722e61567bd06e3add094898f2848484426040516104659493929190610873565b60405180910390a2600080600086815260200190815260200160002060006101000a81548160ff02191690831515021790555050505050565b60006104b16104ac84610983565b61095e565b9050828152602081018484840111156104c957600080fd5b6104d4848285610a56565b509392505050565b6000813590506104eb81610b8a565b92915050565b600082601f83011261050257600080fd5b813561051284826020860161049e565b91505092915050565b60008135905061052a81610ba1565b92915050565b60008135905061053f81610bb8565b92915050565b60006020828403121561055757600080fd5b60006105658482850161051b565b91505092915050565b60008060006060848603121561058357600080fd5b60006105918682870161051b565b93505060206105a286828701610530565b925050604084013567ffffffffffffffff8111156105bf57600080fd5b6105cb868287016104f1565b9150509250925092565b600080600080608085870312156105eb57600080fd5b60006105f98782880161051b565b945050602061060a87828801610530565b935050604061061b87828801610530565b925050606061062c878288016104dc565b91505092959194509250565b600080600080600080600060e0888a03121561065357600080fd5b60006106618a828b0161051b565b97505060206106728a828b01610530565b96505060406106838a828b01610530565b95505060606106948a828b01610530565b94505060806106a58a828b01610530565b93505060a06106b68a828b016104dc565b92505060c06106c78a828b01610530565b91505092959891949750929550565b600080604083850312156106e957600080fd5b60006106f785828601610530565b925050602061070885828601610530565b9150509250929050565b61071b81610a26565b82525050565b61072a81610a32565b82525050565b600061073b826109b4565b61074581856109bf565b9350610755818560208601610a65565b61075e81610b27565b840191505092915050565b60006107766012836109bf565b915061078182610b38565b602082019050919050565b60006107996012836109bf565b91506107a482610b61565b602082019050919050565b6107b881610a3c565b82525050565b6107c781610a46565b82525050565b60006020820190506107e26000830184610712565b92915050565b600060408201905081810360008301526108028185610730565b905061081160208301846107af565b9392505050565b6000602082019050818103600083015261083181610769565b9050919050565b600060208201905081810360008301526108518161078c565b9050919050565b600060208201905061086d60008301846107af565b92915050565b600060808201905061088860008301876107be565b61089560208301866107be565b6108a26040830185610721565b6108af60608301846107af565b95945050505050565b60006060820190506108cd60008301866107be565b6108da60208301856107be565b6108e760408301846107af565b949350505050565b600060e082019050610904600083018a6107be565b61091160208301896107be565b61091e60408301886107be565b61092b60608301876107be565b6109386080830186610721565b61094560a08301856107be565b61095260c08301846107af565b98975050505050505050565b6000610968610979565b90506109748282610a98565b919050565b6000604051905090565b600067ffffffffffffffff82111561099e5761099d610af8565b5b6109a782610b27565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60006109db82610a3c565b91506109e683610a3c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610a1b57610a1a610ac9565b5b828201905092915050565b60008115159050919050565b6000819050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b83811015610a83578082015181840152602081019050610a68565b83811115610a92576000848401525b50505050565b610aa182610b27565b810181811067ffffffffffffffff82111715610ac057610abf610af8565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4e6f74206163746976652073657373696f6e0000000000000000000000000000600082015250565b7f4e6f74206163746976652053657373696f6e0000000000000000000000000000600082015250565b610b9381610a32565b8114610b9e57600080fd5b50565b610baa81610a3c565b8114610bb557600080fd5b50565b610bc181610a46565b8114610bcc57600080fd5b5056fea264697066735822122059f87fed2918bb035f00bcab005774903c3d4e01adf0f30e2cfb9a16de31249664736f6c63430008040033"
var contractDataNewChainStage = "608060405234801561001057600080fd5b50604051610d07380380610d0783398181016040528101906100329190610054565b806001819055505061009e565b60008151905061004e81610087565b92915050565b60006020828403121561006657600080fd5b60006100748482850161003f565b91505092915050565b6000819050919050565b6100908161007d565b811461009b57600080fd5b50565b610c5a806100ad6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80639adf3c23116100665780639adf3c231461011e578063a451272e1461013a578063b5a7ea0614610156578063c6e5a41914610174578063f1e99adb146101a457610093565b80631094145a1461009857806333133b41146100b45780634515e8d9146100d257806382afd23b146100ee575b600080fd5b6100b260048036038101906100ad91906105c3565b6101c0565b005b6100bc610265565b6040516100c991906108ad565b60405180910390f35b6100ec60048036038101906100e7919061068d565b6102b5565b005b6101086004803603810190610103919061059a565b610361565b6040516101159190610822565b60405180910390f35b6101386004803603810190610133919061072b565b61038a565b005b610154600480360381019061014f919061059a565b6103d1565b005b61015e6103ff565b60405161016b91906108ad565b60405180910390f35b61018e6004803603810190610189919061059a565b610405565b60405161019b9190610822565b60405180910390f35b6101be60048036038101906101b9919061062a565b610425565b005b60008084815260200190815260200160002060009054906101000a900460ff1661021f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102169061086d565b60405180910390fd5b8163ffffffff16837f26bcc523a5e3b94458b5967eece5212cfdc664966710cb8648480b5b0d343956834260405161025892919061083d565b60405180910390a3505050565b600060018060008282546102799190610a25565b925050819055506001600080600154815260200190815260200160002060006101000a81548160ff021916908315150217905550600154905090565b60008088815260200190815260200160002060009054906101000a900460ff16610314576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161030b9061088d565b60405180910390fd5b867f9d87175ef8e1fec360aa582266352274b86963b1c6c91d27eed1db8bcfef3bec878787878787426040516103509796959493929190610944565b60405180910390a250505050505050565b600080600083815260200190815260200160002060009054906101000a900460ff169050919050565b610392610265565b7fe49c753973c097158927b5bacda348e5d3e7b9662f88bc97727320f8774fc9d48383426040516103c59392919061090d565b60405180910390a25050565b600160008083815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60015481565b60006020528060005260406000206000915054906101000a900460ff1681565b60008085815260200190815260200160002060009054906101000a900460ff16610484576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047b9061086d565b60405180910390fd5b837fe6655d3159cc6b5ce597695101ccc8db461698722e61567bd06e3add094898f2848484426040516104ba94939291906108c8565b60405180910390a2600080600086815260200190815260200160002060006101000a81548160ff02191690831515021790555050505050565b6000610506610501846109d8565b6109b3565b90508281526020810184848401111561051e57600080fd5b610529848285610aab565b509392505050565b60008135905061054081610bdf565b92915050565b600082601f83011261055757600080fd5b81356105678482602086016104f3565b91505092915050565b60008135905061057f81610bf6565b92915050565b60008135905061059481610c0d565b92915050565b6000602082840312156105ac57600080fd5b60006105ba84828501610570565b91505092915050565b6000806000606084860312156105d857600080fd5b60006105e686828701610570565b93505060206105f786828701610585565b925050604084013567ffffffffffffffff81111561061457600080fd5b61062086828701610546565b9150509250925092565b6000806000806080858703121561064057600080fd5b600061064e87828801610570565b945050602061065f87828801610585565b935050604061067087828801610585565b925050606061068187828801610531565b91505092959194509250565b600080600080600080600060e0888a0312156106a857600080fd5b60006106b68a828b01610570565b97505060206106c78a828b01610585565b96505060406106d88a828b01610585565b95505060606106e98a828b01610585565b94505060806106fa8a828b01610585565b93505060a061070b8a828b01610531565b92505060c061071c8a828b01610585565b91505092959891949750929550565b6000806040838503121561073e57600080fd5b600061074c85828601610585565b925050602061075d85828601610585565b9150509250929050565b61077081610a7b565b82525050565b61077f81610a87565b82525050565b600061079082610a09565b61079a8185610a14565b93506107aa818560208601610aba565b6107b381610b7c565b840191505092915050565b60006107cb601283610a14565b91506107d682610b8d565b602082019050919050565b60006107ee601283610a14565b91506107f982610bb6565b602082019050919050565b61080d81610a91565b82525050565b61081c81610a9b565b82525050565b60006020820190506108376000830184610767565b92915050565b600060408201905081810360008301526108578185610785565b90506108666020830184610804565b9392505050565b60006020820190508181036000830152610886816107be565b9050919050565b600060208201905081810360008301526108a6816107e1565b9050919050565b60006020820190506108c26000830184610804565b92915050565b60006080820190506108dd6000830187610813565b6108ea6020830186610813565b6108f76040830185610776565b6109046060830184610804565b95945050505050565b60006060820190506109226000830186610813565b61092f6020830185610813565b61093c6040830184610804565b949350505050565b600060e082019050610959600083018a610813565b6109666020830189610813565b6109736040830188610813565b6109806060830187610813565b61098d6080830186610776565b61099a60a0830185610813565b6109a760c0830184610804565b98975050505050505050565b60006109bd6109ce565b90506109c98282610aed565b919050565b6000604051905090565b600067ffffffffffffffff8211156109f3576109f2610b4d565b5b6109fc82610b7c565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b6000610a3082610a91565b9150610a3b83610a91565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610a7057610a6f610b1e565b5b828201905092915050565b60008115159050919050565b6000819050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b83811015610ad8578082015181840152602081019050610abd565b83811115610ae7576000848401525b50505050565b610af682610b7c565b810181811067ffffffffffffffff82111715610b1557610b14610b4d565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4e6f74206163746976652073657373696f6e0000000000000000000000000000600082015250565b7f4e6f74206163746976652053657373696f6e0000000000000000000000000000600082015250565b610be881610a87565b8114610bf357600080fd5b50565b610bff81610a91565b8114610c0a57600080fd5b50565b610c1681610a9b565b8114610c2157600080fd5b5056fea2646970667358221220d1b390f136d2f0e1b5755d7f161d1bea0f6a23850b1a96509ddefaae803d199164736f6c63430008040033"

var contractAddresses = []
var contractObjects = []
var addresses = []
var web3Instances = []
var counter = 0

var forInitializationTesting = Array.from(Array(650).keys())

// uncomment the code blocks based on the number of servers you want to activate
export function initializeWithoutData() {

    // create instances, get the accounts and deploy the smart contract for all the chains
    var web3_0 = new Web3('ws://localhost:8540')
    var stateandsessionContract_0 = new web3_0.eth.Contract(contractABIStage)
    saveAccountsDeployContract(web3_0, stateandsessionContract_0, 0, false)


    // var web3_1 = new Web3('ws://localhost:8541')
    // var stateandsessionContract_1 = new web3_1.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_1, stateandsessionContract_1, 0, false)

    // var web3_2 = new Web3('ws://localhost:8542')
    // var stateandsessionContract_2 = new web3_2.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_2, stateandsessionContract_2, 0, false)

    // var web3_3 = new Web3('ws://localhost:8543')
    // var stateandsessionContract_3 = new web3_3.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_3, stateandsessionContract_3, 0, false)

    // var web3_4 = new Web3('ws://localhost:8544')
    // var stateandsessionContract_4 = new web3_4.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_4, stateandsessionContract_4, 0, false)

    // var web3_5 = new Web3('ws://localhost:8545')
    // var stateandsessionContract_5 = new web3_5.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_5, stateandsessionContract_5, 0, false)

    // var web3_6 = new Web3('ws://localhost:8546')
    // var stateandsessionContract_6 = new web3_6.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_6, stateandsessionContract_6, 0, false)

    // var web3_7 = new Web3('ws://localhost:8547')
    // var stateandsessionContract_7 = new web3_7.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_7, stateandsessionContract_7, 0, false)

    // var web3_8 = new Web3('ws://localhost:8548')
    // var stateandsessionContract_8 = new web3_8.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_8, stateandsessionContract_8, 0, false)

    // var web3_9 = new Web3('ws://localhost:8549')
    // var stateandsessionContract_9 = new web3_9.eth.Contract(contractABIStage)
    // saveAccountsDeployContract(web3_9, stateandsessionContract_9, 0, false)

    return([addresses, contractObjects, contractAddresses, web3Instances, counter])
}


async function saveAccountsDeployContract(web3_instance, stateandsessionContract, startingSession, newChain) {
    counter++
    if (newChain) {
        var contractABI = contractABINewChainStage
        var contractData = contractDataNewChainStage
    } else {
        var contractABI = contractABIStage
        var contractData = contractDataStage
    }
    var items = await web3_instance.eth.getAccounts().then( fetchedAccounts => {
                                        // console.log(fetchedAccounts)
                                        var max = fetchedAccounts.length
                                        var items = stateandsessionContract.deploy({data: contractData, arguments: [startingSession]})
                                                        .send({from: fetchedAccounts[random(0, max)], gas: '15000000'})
                                                        .then( (contractCreated) => {
                                                            console.log('Contract mined for chain index ' + (contractAddresses.length) +'. Address: ' + contractCreated.options.address)
                                                            contractAddresses.push(contractCreated.options.address)
                                                            var contractObj = new web3_instance.eth.Contract(contractABI, contractCreated.options.address)
                                                            contractObjects.push(contractObj)
                                                            web3Instances.push(web3_instance)
                                                            addresses.push(fetchedAccounts)
                                                            return [contractCreated.options.address, contractObj, web3_instance, fetchedAccounts]
                                                    })
                                        return items
                                            })
    return items
}


// get random integer in [min, max)
export function random(min, max) {
    return (Math.floor(Math.random()*(max - min)) + min)
}


export function createNewServer(portNumber, startingSession) {
    var web3_new = new Web3('ws://localhost:' + portNumber)
    var stateandsessionContract_new = new web3_new.eth.Contract(contractABINewChainStage)
    var items = saveAccountsDeployContract(web3_new, stateandsessionContract_new, startingSession, true)
    
    return items
}