In this folder the implementation is with multiple chains running instataneously.

The addresses which will be used for the senderAddress for the transactions are set on the beginning by hand.
The initializer open the servers from 0 to i, at providers http://localhost:854+i 
    and deploys the smart contract at every chain.

Based on the number of servers avalable each userID created is being put to a specific chain 
    and all the transactions from that user is send to that chain only.

In the handoff button two transactions are being send, one to each chain based on the previous and the new user ids.
(Theoretically these transactions are signed from both the users, thats why there are two, no signatures are implemented in this code.)
Also, the sensor interval for this session is stopped and initilaized again and the transactions are send to chain based on the new userID.
