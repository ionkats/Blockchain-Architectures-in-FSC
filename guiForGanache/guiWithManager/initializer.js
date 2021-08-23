import contractABI from "./ABI.js";

// deployment of the contracts for every web3 provider needed from the Remix environment

// data for server 0
var address0 = "0xe42B94f361d9d1e1c2612F086874be583D8B7169";
var contract0 = "0xFdd0f11842640821CF269891Ba8182CaB4B9e02E";
// data for server 1
var address1 = "0x3ED59637C0E6f932843943E32C1F40Dd1AFeAa3c";
var contract1 = "0x0833ad0229Ed76C8d8da786Ad0Ce9631f00D12e9";
// data for server 2
var address2 = "0xf9271BEf90dc568bADB5586Fa454782F7b1124e4";
var contract2 = "0x872ABAf6Ab0bEb2e81afF8CB642BBb570Ec07DdB";
// data for server 3
var address3 = "0x6c5566D2F2A8f14B91C5a0BF2bcEbCc7814f167a";
var contract3 = "0x9a39dF1e0BDAa303912ab589c458C4E6385297D1";
// data for server 4
var address4 = "0xd65861530872DA517d62e471bB0b1f7c08623e69";
var contract4 = "0x7e241fa3f7456e8D595DDB6F1583B658d4e555E2";
// data for server 5
var address5 = "0xAC209887AeCD4F0081A19020534DBc00EE19f01f";
var contract5 = "0x53d838e117aFe124e882E42E2fB3186860BDf3d7";
// data for server 6
var address6 = "0x0be0c7344c2C32F9ec58E92bcA34e6019F4cFc3D";
var contract6 = "0x9EF827ca65E6a7cEA3030F227dA91D120530EBF4";
// data for server 7
var address7 = "0x075f849c0ab258C05Bc23Da5402746f7C9780631";
var contract7 = "0xDeE920d9AE825016f64f34Fbd30b6b6fa6DCa17E";
// data for server 8
var address8 = "0x28De9580FE2E9631BB903Ac2483b116aff8222E5";
var contract8 = "0x57cADe39E22c4Af5f9fc5c13DEe8315AC0D13749";
// data for server 9
var address9 = "0x009e89ebEf47A303aaB2b5fEe4c9b25468cF63C9";
var contract9 = "0x93fdD28401B8084ACc174D1Ed7024dd2A22ea6d5";


// used for the deployment of the contract along the ABI
var contractData = "0x608060405234801561001057600080fd5b50610a9c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80636b856cd7146100675780638c94716e14610083578063b45aed281461009f578063b5a7ea06146100bb578063c6e5a419146100d9578063ce651c1a14610109575b600080fd5b610081600480360381019061007c91906105c5565b610125565b005b61009d60048036038101906100989190610512565b610197565b005b6100b960048036038101906100b4919061054e565b610260565b005b6100c3610307565b6040516100d09190610704565b60405180910390f35b6100f360048036038101906100ee9190610495565b61030d565b60405161010091906106a9565b60405180910390f35b610123600480360381019061011e91906104be565b61032d565b005b7f1bf43c4e75a7bff085adfa4cd1169f72e357c0b294df3682aa5e0a846fb4953061014e6103cb565b824260405161015f9392919061075d565b60405180910390a16001600080600154815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b60008083815260200190815260200160002060009054906101000a900460ff166101f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101ed906106c4565b60405180910390fd5b7fa5bacc1c106792e1153ef8776a2b26de39597548b88e387e75d86fbf84cb6d5e8282426040516102299392919061075d565b60405180910390a1600080600084815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b60008086815260200190815260200160002060009054906101000a900460ff166102bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b6906106e4565b60405180910390fd5b7fb76311841ad1bf4e1210e6abb3a27711c6cd5c176fc83a2d6109f34e70b067138585858585426040516102f896959493929190610794565b60405180910390a15050505050565b60015481565b60006020528060005260406000206000915054906101000a900460ff1681565b60008083815260200190815260200160002060009054906101000a900460ff1661038c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610383906106c4565b60405180910390fd5b7f4303a873fbd8b09c053de5da9bd4246acb454c5c47b33a1446844caf71f860598242836040516103bf9392919061071f565b60405180910390a15050565b600060018060008282546103df9190610867565b92505081905550600154905090565b60006104016103fc8461081a565b6107f5565b90508281526020810184848401111561041957600080fd5b6104248482856108ed565b509392505050565b60008135905061043b81610a21565b92915050565b600082601f83011261045257600080fd5b81356104628482602086016103ee565b91505092915050565b60008135905061047a81610a38565b92915050565b60008135905061048f81610a4f565b92915050565b6000602082840312156104a757600080fd5b60006104b58482850161046b565b91505092915050565b600080604083850312156104d157600080fd5b60006104df8582860161046b565b925050602083013567ffffffffffffffff8111156104fc57600080fd5b61050885828601610441565b9150509250929050565b6000806040838503121561052557600080fd5b60006105338582860161046b565b925050602061054485828601610480565b9150509250929050565b600080600080600060a0868803121561056657600080fd5b60006105748882890161046b565b955050602061058588828901610480565b945050604061059688828901610480565b93505060606105a78882890161042c565b92505060806105b88882890161042c565b9150509295509295909350565b6000602082840312156105d757600080fd5b60006105e584828501610480565b91505092915050565b6105f7816108bd565b82525050565b610606816108c9565b82525050565b60006106178261084b565b6106218185610856565b93506106318185602086016108fc565b61063a816109be565b840191505092915050565b6000610652601283610856565b915061065d826109cf565b602082019050919050565b6000610675601283610856565b9150610680826109f8565b602082019050919050565b610694816108d3565b82525050565b6106a3816108dd565b82525050565b60006020820190506106be60008301846105ee565b92915050565b600060208201905081810360008301526106dd81610645565b9050919050565b600060208201905081810360008301526106fd81610668565b9050919050565b6000602082019050610719600083018461068b565b92915050565b6000606082019050610734600083018661068b565b610741602083018561068b565b8181036040830152610753818461060c565b9050949350505050565b6000606082019050610772600083018661068b565b61077f602083018561069a565b61078c604083018461068b565b949350505050565b600060c0820190506107a9600083018961068b565b6107b6602083018861069a565b6107c3604083018761069a565b6107d060608301866105fd565b6107dd60808301856105fd565b6107ea60a083018461068b565b979650505050505050565b60006107ff610810565b905061080b828261092f565b919050565b6000604051905090565b600067ffffffffffffffff8211156108355761083461098f565b5b61083e826109be565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b6000610872826108d3565b915061087d836108d3565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156108b2576108b1610960565b5b828201905092915050565b60008115159050919050565b6000819050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b8381101561091a5780820151818401526020810190506108ff565b83811115610929576000848401525b50505050565b610938826109be565b810181811067ffffffffffffffff821117156109575761095661098f565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4e6f74206163746976652073657373696f6e0000000000000000000000000000600082015250565b7f4e6f74206163746976652053657373696f6e0000000000000000000000000000600082015250565b610a2a816108c9565b8114610a3557600080fd5b50565b610a41816108d3565b8114610a4c57600080fd5b50565b610a58816108dd565b8114610a6357600080fd5b5056fea2646970667358221220dedf454a170cf354c6c0301818eb71bba5fae6b139cec2e9c6b734bcb88a5b0664736f6c63430008040033";

var contractAddresses = [];
var contractObjects = [];
var addresses = [];

// uncomment the code blocks based on the number of servers you want to activate
export function initialize() {
    var web3_0 = new Web3('ws://localhost:8540');
    const smartContract0 = new web3_0.eth.Contract(contractABI, contract0);
    contractAddresses.push(contract0);
    addresses.push(address0);
    contractObjects.push(smartContract0);

    var web3_1 = new Web3('ws://localhost:8541');
    const smartContract1 = new web3_1.eth.Contract(contractABI, contract1);
    contractAddresses.push(contract1);
    addresses.push(address1);
    contractObjects.push(smartContract1);

    // var web3_2 = new Web3('ws://localhost:8542');
    // const smartContract2 = new web3_2.eth.Contract(contractABI, contract2);
    // contractAddresses.push(contract2);
    // addresses.push(address2);
    // contractObjects.push(smartContract2);

    // var web3_3 = new Web3('ws://localhost:8543');
    // const smartContract3 = new web3_3.eth.Contract(contractABI, contract3);
    // contractAddresses.push(contract3);
    // addresses.push(address3);
    // contractObjects.push(smartContract3);

    // var web3_4 = new Web3('ws://localhost:8544');
    // const smartContract4 = new web3_4.eth.Contract(contractABI, contract4);
    // contractAddresses.push(contract4);
    // addresses.push(address4);
    // contractObjects.push(smartContract4);

    // var web3_5 = new Web3('ws://localhost:8545');
    // const smartContract5 = new web3_5.eth.Contract(contractABI, contract5);
    // contractAddresses.push(contract5);
    // addresses.push(address5);
    // contractObjects.push(smartContract5);

    // var web3_6 = new Web3('ws://localhost:8546');
    // const smartContract6 = new web3_6.eth.Contract(contractABI, contract6);
    // contractAddresses.push(contract6);
    // addresses.push(address6);
    // contractObjects.push(smartContract6);

    // var web3_7 = new Web3('ws://localhost:8547');
    // const smartContract7 = new web3_7.eth.Contract(contractABI, contract7);
    // contractAddresses.push(contract7);
    // addresses.push(address7);
    // contractObjects.push(smartContract7);

    // var web3_8 = new Web3('ws://localhost:8548');
    // const smartContract8 = new web3_8.eth.Contract(contractABI, contract8);
    // contractAddresses.push(contract8);
    // addresses.push(address8);
    // contractObjects.push(smartContract8);

    // var web3_9 = new Web3('ws://localhost:8549');
    // const smartContract9 = new web3_9.eth.Contract(contractABI, contract9);
    // contractAddresses.push(contract9);
    // addresses.push(address9);
    // contractObjects.push(smartContract9);

    return([addresses, contractObjects, contractAddresses]);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// INITIALIZATION WITH DYNAMIC NAMES WITH ADDRESS OF THE SMART CONTRACT (NOT WORKING)

// var numberOfServers = 3;
// for (var i = 0; i < numberOfServers; i++) {
//     eval('var web3_' + i + ' = new Web3(\'ws://localhost:854'+i+'\');');
//     eval('const smartContract'+i+' = new web3_'+i+'.eth.Contract(contractABI, contract'+i+');');
//     eval('contractAddresses.push(contract'+i+');');
//     eval('addresses.push(address'+i+');');
//     eval('contractObjects.push(smartContract'+i+');');
// }

// DYNAMIC NAMING OF THE SERVERS AND AUTOMATE DEPLOYMENT OF THE CONTRACT (NOT WORKING)

// // address of the servers
// for (var i = 0; i <= 1; i++) {
//     eval('var web3_' + i + ' = new Web3();');
//     var x;
//     eval('x = web3_' + i + ';');
//     x.setProvider(new x.providers.HttpProvider('http://localhost:854' + i));
//     // eval('web3_' + i + '.setProvider(new web3_' + i + '.providers.HttpProvider(\'http://localhost:854' + i + '\'));');

//     // check if there is a connection
//     var flag;
//     eval('flag = web3_'+ i + '.isConnected();');
//     if (!flag) {
//         console.log(i + 'is not connected.');
//     } else {
//         console.log(i + 'is connected.');
//     }
//     // create an object for the i_th contract
//     eval('var stateandsessionContract_' + i + ' = new web3_' + i + '.eth.Contract(contractABI);');
//     // deploy the contract in the i_th server
//     eval('var stateandsession_'+ i + '= stateandsessionContract_' + i + '.deploy({' +
//             +'data: contractData, arguments: []' +
//             +'}).send({'+
//             +'from: address' + i + ' ,'+
//             +'gas: \'20000000\''+
//             +'}, function (e, contract){'+
//                 // +'    console.log(e, contract);'+
//                 +'    if (typeof contract.address !== \'undefined\') {'+
//                         +'console.log(\'Contract mined! address: \' + contract.address + \' transactionHash: \' + contract.transactionHash);'+
//                         +'contactAddresses.push(contract.address);'+
//                 +'    }'+
//             +'}); ');
//     // get the object for further use
//     eval('contractObjects.push(statesandsessionContract_' + i + ');');

//     //create a list for the sender of transactions
//     eval('addresses.push(address' + i + ');');
// }