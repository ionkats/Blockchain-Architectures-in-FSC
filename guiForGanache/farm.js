import contractAbi from "./ABI.js";
console.log("YEE");
let contractAddress;
let contract;
// window.web3 = new Web3(ethereum);
// windows.contract = contract = new web3.methods.contract(contractAbi, contractAddress);
// localStorage.setItem('contractAddress', contractAddress);

const contractAddressButton = document.getElementById("contract-address");
const startSessionButton = document.getElementById("newSession");
const endSessionButton = document.getElementById("endSession");
const HandoffButton = document.getElementById("Handoff");
const sensorButton = document.getElementById("Sensor");


// See https://eips.ethereum.org/EIPS/eip-1102#eth_requestaccounts
// and https://eips.ethereum.org/EIPS/eip-1193#request-1
async function initEthereum () {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            oneAddress = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
            // oneAddress = web3.utils.toChecksumAddress(playerAddress); // properly capitalize https://github.com/MetaMask/metamask-extension/issues/5826
        } catch (e) {
            console.error(e)
            alert("No ethereum account provided.")
        }
        // document.getElementById("Account").value = playerAddress;
    } else {
        alert("No Ethereum provider (eg MetaMask) detected.");
    }
}
initEthereum()


function listenAllEvents() {
    contract.events.StartOfSession(makeRelevantEventHandler(transactionEvent))
    contract.events.SensorLog(makeRelevantEventHandler(transactionEvent))
    contract.events.EndOfSession(makeRelevantEventHandler(transactionEvent))
    contract.events.Handoff(makeRelevantEventHandler(transactionEvent))
}


async function transactionEvent() {

}


async function connect() {
    contractAddress = document.getElementById("contract-address-input").value;
    if (!contractAddress) {
        return;
    }
    window.contract = contract = new  web3.eth.Contract(contractAbi, contractAddress);
    localStorage.setItem('contractAddress', contractAddress);

    listenAllEvents();
}


function addUiListeners() {
    // specified transactions
    contractAddressButton.addEventListener("click", getContractAddress);
    startSessionButton.addEventListener("click", startTransaction);
    endSessionButton.addEventListener("click", endTransaction);
    HandoffButton.addEventListener("click", handOffTransaction);
    sensorButton.addEventListener("click", sensorTransaction);
}
addUiListeners();


async function getContractAddress() {
    var contractAddress = document.getElementById("contract-address-input");
}


async function startTransaction() {
    var _session = document.getElementById("newSession-sessionId").value;  
    var _userId = document.getElementById("newSession-userId").value;
    var _previousStateBlockHash = document.getElementById("newSession-previousStateBlockHash").value;
    var _previousStateLedgerName = document.getElementById("newSession-previousStateLedgerName").value;
    
    isEmpty(_session);
    isEmpty(_userId);
    isEmpty(_previousStateBlockHash);
    isEmpty(_previousStateLedgerName);

    try {
        startTransaction = contract.methods.StartSession(
            _session,
            _userId,
            _previousStateBlockHash,
            _previousStateLedgerName
            ).send();
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}
function isEmpty(item) {
    if (item === null) {
        throw new Error("Empty Item on input");
    }
}

async function handOffTransaction() {
    var _session = document.getElementById("Handoff-sessionId").value;  
    var _previousUserId = document.getElementById("Handoff-previousUserId").value;
    var _newuserId = document.getElementById("Handoff-newUserId").value;
    var _previousStateBlockHash = document.getElementById("Handoff-previousStateBlockHash").value;
    var _previousStateLedgerName = document.getElementById("Handoff-previousStateLedgerName").value;
    
    isEmpty(_session);
    isEmpty(_previousUserId);
    isEmpty(_newuserId);
    isEmpty(_previousStateBlockHash);
    isEmpty(_previousStateLedgerName);

    try {
        handOffTransaction = contract.methods.endStartSessionHandoff(
            _session,
            _previousUserId,
            _newuserId,
            _previousStateBlockHash,
            _previousStateLedgerName
            ).send();
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}


async function sensorTransaction() {
    var _session = document.getElementById("Sensor-sessionId").value;  
    var _information = document.getElementById("Sensor-information").value;
    
    isEmpty(_session);
    isEmpty(_information);

    try {
        sensorTransaction = contract.methods.sensorLogging(
            _session,
            _information
            ).send();
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}


async function endTransaction() {
    var _session = document.getElementById("endSession-sessionId").value;  
    var _userId = document.getElementById("endSession-userId").value;

    isEmpty(_session);
    isEmpty(_userId);

    try {
        endTransaction = contract.methods.endStartSessionHandoff(
            _session,
            _userId
            ).send();
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}



