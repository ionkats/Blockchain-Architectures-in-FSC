pragma solidity ^0.8.3;

contract StateAndSession {

    event startOfSession(
        uint32 userID, 
        bytes32 previousStateBlockHash, 
        uint256 sessionID,
        uint256 time,
        bytes32 previousStateLedgerName
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

    mapping(uint256 => bool) public activeSessions;
    uint256 public sessionID;
    // constructor() {
    // }

    function startSession(
        uint256 _sess,
        uint32 _userID,
        bytes32 _previousStateBlockHash, 
        bytes32 _previousStateLedgerName) 
        external {
            uint256 _sessionID;
            if (_sess == 0) {
                _sessionID = getNextSessionID();
            } else {
                require(activeSessions[_sess], "Not active session, put 0 for new session.");
                _sessionID = _sess;
            }
            emit startOfSession(
                _userID, 
                _previousStateBlockHash, 
                _sessionID, 
                block.timestamp, 
                _previousStateLedgerName
            );
            activeSessions[sessionID] = true;
    }

    function endStartSessionHandoff(
        uint256 _sessionID, 
        uint32 _previousUserID,
        uint32 _newUserID,
        bytes32 _previousStateBlockHash,
        bytes32 _previousStateLedgerName
        ) public {
            require(activeSessions[_sessionID], "Not active Session");
            emit endOfSession(
                _sessionID,
                _previousUserID,
                block.timestamp
            );
            emit startOfSession(
                _newUserID, 
                _previousStateBlockHash, 
                _sessionID, 
                block.timestamp, 
                _previousStateLedgerName);
    }

    function getNextSessionID() internal returns(uint256) { 
        sessionID += 1;
        return sessionID;
    }

    function sensorLogging(uint256 _sessionID, string memory information) public{
        require(activeSessions[_sessionID], "Not active session");
        emit sensorLog(
            _sessionID,
            block.timestamp,
            information
        );
    }

    function endSession(uint256 _sessionID, uint32 _userID) public{
        require(activeSessions[_sessionID], "Not active session");
        emit endOfSession(
            _sessionID,
            _userID,
            block.timestamp
        );
        activeSessions[_sessionID] = false;
    }
}