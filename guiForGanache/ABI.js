export default [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "companyID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "userID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "previousTransactionHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "EndOfSession",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "previousCompanyID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "previousUserID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "newCompanyID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "newUserID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "previousStateTransactionHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "previousChainIndex",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "Handoff",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "companyID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "info",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "SensorLog",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "companyID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "userID",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "StartOfSession",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "activeSessions",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionID",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "_companyID",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_userID",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_previousTransactionHash",
				"type": "bytes32"
			}
		],
		"name": "endSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNextSessionID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionID",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "_previousCompanyID",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_previousUserID",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_newCompanyID",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_newUserID",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_previousStateTransactionHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint32",
				"name": "_previousChainIndex",
				"type": "uint32"
			}
		],
		"name": "handoff",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionID",
				"type": "uint256"
			},
			{
				"internalType": "uint32",
				"name": "_companyID",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "information",
				"type": "string"
			}
		],
		"name": "sensorLogging",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sessionID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_companyID",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "_userID",
				"type": "uint32"
			}
		],
		"name": "startSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]