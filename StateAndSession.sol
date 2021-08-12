pragma solidity ^0.8.3;

contract StateAndSession {

    event StartOfSession(
        uint256 sessionID,
        uint32 userID, 
        bytes32 previousStateBlockHash, 
        bytes32 previousStateLedgerName,
        uint256 time
    );

    event Handoff(
        uint256 sessionID,
        uint32 previousUserID,
        uint32 newUserID, 
        bytes32 previousStateBlockHash, 
        bytes32 previousStateLedgerName,
        uint256 time
    );

    event SensorLog(
        uint256 sessionID,
        uint256 time,
        string info
    );

    event EndOfSession(
        uint256 sessionID,
        uint32 userID,
        uint256 time
    );

    mapping(uint256 => bool) public activeSessions;
    uint256 public sessionID;

    function startSession(
        uint32 _userID,
        bytes32 _previousStateBlockHash, 
        bytes32 _previousStateLedgerName
        ) external {
            emit StartOfSession(
                getNextSessionID(),
                _userID, 
                _previousStateBlockHash,
                _previousStateLedgerName,
                block.timestamp
            );
            activeSessions[sessionID] = true;
    }

    function handoff(
        uint256 _sessionID, 
        uint32 _previousUserID,
        uint32 _newUserID,
        bytes32 _previousStateBlockHash,
        bytes32 _previousStateLedgerName
        ) public {
            require(activeSessions[_sessionID], "Not active Session");
            emit Handoff(
                _sessionID, 
                _previousUserID, 
                _newUserID, 
                _previousStateBlockHash, 
                _previousStateLedgerName, 
                block.timestamp
                );
    }

    function getNextSessionID() internal returns(uint256) { 
        sessionID += 1;
        return sessionID;
    }

    function sensorLogging(uint256 _sessionID, string memory information) public{
        require(activeSessions[_sessionID], "Not active session");
        emit SensorLog(
            _sessionID,
            block.timestamp,
            information
        );
    }

    function endSession(uint256 _sessionID, uint32 _userID) public{
        require(activeSessions[_sessionID], "Not active session");
        emit EndOfSession(
            _sessionID,
            _userID,
            block.timestamp
        );
        activeSessions[_sessionID] = false;
    }
}