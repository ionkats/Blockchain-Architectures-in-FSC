pragma solidity ^0.8.3;

contract StateAndSession {

    event StartOfSession(
        uint32 userID, 
        uint256 previousStateBlockHash, 
        uint256 sessionID,
        uint256 time,
        uint256 peviousStateLedgerName
    );

    event sensorLog(
        uint256 sessionID,
        uint256 time,
        string info
    );

    event endOfSession(
        uint256 sessionID,
        uint32 userID,
        uint256 time
    );

    mapping(uint256 => bool) activeSessions;
    uint256 sessionID;
    // constructor() {
    // }

    function startSession(
        uint32 _userID, 
        uint256 _previousStateBlockHash, 
        uint256 _previousStateLedgerName) 
        external {
        emit StartOfSession(
            _userID, 
            _previousStateBlockHash, 
            getNextSessionID(), 
            block.timestamp, 
            _previousStateLedgerName
        );
        activeSessions[sessionID] = true;
    }

    function getNextSessionID() internal returns(uint256) { 
        sessionID += 1;
        return sessionID;
    }

    function sensorLogging(uint256 _sessionID, string memory information) public{
        require(activeSessions[_sessionID] == true, "Not active session");
        emit sensorLog(
            _sessionID,
            block.timestamp,
            information
        );
    }

    function endSession(uint256 _sessionID, uint32 _userID) public{
        require(activeSessions[_sessionID] == true, "Not active session");
        emit endOfSession(
            _sessionID,
            _userID,
            block.timestamp
        );
        activeSessions[_sessionID] = false;
    }
}