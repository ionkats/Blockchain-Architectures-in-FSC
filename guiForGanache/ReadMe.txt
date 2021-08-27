The implementation is with multiple chains running instataneously.

The initializer opens the servers and must have the contracts on each server deployed by hand
and save the addresses of these contracts.

The initializerWithoutData opens the servers from 0 to i, at providers http://localhost:854+i 
    gets the addresses and deploys the smart contract at every chain and gets the address of the contract.

Based on the number of servers avalable each userID created is being put to a specific chain 
and all the transactions from that user is send to that chain only. 
    
In the StartSession button a sensor interval is started.

In the handoff button two transactions are being send, one to each chain based on the previous and the new user ids.
(Theoretically these transactions are signed from both the users, thats why there are two, no signatures are implemented in this code.)
Also, the sensor interval for this session is stopped and initialized again and the transactions are send to chain based on the new userID.

In the endSession button the session the sensor interval is stopped.


TRACEBACK information:
We have the chainIndex (for the web3 instance and the transaction hash):
we get the topics (max 3 items) and data from the web3.eth.getTransactionReceipt(transactionHash) 

The first element of the topics array consists of the signature (a keccak256 hash) of the event method name, 
including the types (uint256, address, string, etc.) in hexadecimal.
topics[0] = "0x" + keccak256("nameOfEvent(typeOf1stArgument,typeOf2ndArgument,...) ") no spaces between the args
for our events of the contract we have: 
        StartOfSession(uint256,uint32,uint256)
        Handoff(uint256,uint32,uint32,bytes32,uint32,uint256)
        EndOfSession(uint256,uint32,bytes32,uint256)
        SensorLog(uint256,uint256,string)

The only indexed argument in this contract is the sessionID because it would be nice to be searchable.
The data will have all the rest information of the events we need, and the sessionID will be stored in topics[1]
Thus the topics field will have ony two attribute.

In data the is the concatenation of the hexadecimal value of the values in 32 bit numbers.
Bytes and strings are right-padded otherwise types are left-padded
        