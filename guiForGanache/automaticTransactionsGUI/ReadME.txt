In this folder there is an implementation for automated transactions on one chain 
with the press of the start/handoff or end buttonds on the UI.

With the Start Session button a 6-digit userID is created and put through to the transaction of the contract. 
Automatically every 5 seconds a transaction of sensor data will be sent to the contract.

With the Handoff button and by providing the appropriate sessionID, a newUserID is created and along with the previous userID are send to 
the transaction of the contract. 
The interval of sensor data is not stopped because there are again data for the next state (handoff).

With the End Session button, provided with the appropriate sessionID stops the interval of the session. 

All transactions are send to the single chain and from one single address for simplicity.

Data from the events are saved into the js file and with the traceback button and with the sessionID value
we get the sates that the sessionID has passed on this chain (the sensor logs are not included);