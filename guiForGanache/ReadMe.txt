The implementation is with multiple chains running instataneously.

The initializer opens the servers and must have the contracts on each server deployed by hand
and save the addresses of these contracts.

The initializerWithoutData open the servers from 0 to i, at providers http://localhost:854+i 
    gets the addresses and deploys the smart contract at every chain and gets the address of the contract.

Based on the number of servers avalable each userID created is being put to a specific chain 
and all the transactions from that user is send to that chain only. 
    
In the StartSession button a sensor interval is started.

In the handoff button two transactions are being send, one to each chain based on the previous and the new user ids.
(Theoretically these transactions are signed from both the users, thats why there are two, no signatures are implemented in this code.)
Also, the sensor interval for this session is stopped and initialized again and the transactions are send to chain based on the new userID.

In the endSession button the session the sensor interval is stopped.

For the traceback, the values of the events emitted on the chains are saved locally and used for the traceback. 
Haven't found a way to read off the chains. 