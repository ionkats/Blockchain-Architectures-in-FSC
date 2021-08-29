pragma solidity ^0.8.3;

contract StateAndSession {

    event StartOfSession(
        uint256 indexed sessionID,
        uint32 userID, 
        uint256 time
    );

    event Handoff(
        uint256 indexed sessionID,
        uint32 previousUserID,
        uint32 newUserID, 
        bytes32 previousStateTransactionHash, 
        uint32 previousChainIndex,
        uint256 time
    );

    event SensorLog(
        uint256 indexed sessionID,
        uint256 time,
        string info
    );

    event EndOfSession(
        uint256 indexed sessionID,
        uint32 userID,
        bytes32 previousTransactionHash,
        uint256 time
    );

    // event migration(
    //     uint256 userID,
    //     uint32 chainIndex,
    //     uint256 time
    // );

    mapping(uint256 => bool) public activeSessions;
    // mapping(uint256 => uint32) public userToChain;
    uint256 public sessionID;

    function startSession(
        uint32 _userID
        ) external {
            emit StartOfSession(
                getNextSessionID(),
                _userID, 
                block.timestamp
            );
            activeSessions[sessionID] = true;
    }

    function handoff(
        uint256 _sessionID, 
        uint32 _previousUserID,
        uint32 _newUserID,
        bytes32 _previousStateTransactionHash,
        uint32 _previousChainIndex
        ) external {
            require(activeSessions[_sessionID], "Not active Session");
            emit Handoff(
                _sessionID, 
                _previousUserID, 
                _newUserID, 
                _previousStateTransactionHash, 
                _previousChainIndex, 
                block.timestamp
                );
    }

    function getNextSessionID() internal returns(uint256) { 
        sessionID += 1;
        return sessionID;
    }

    function sensorLogging(uint256 _sessionID, string memory information) external{
        require(activeSessions[_sessionID], "Not active session");
        emit SensorLog(
            _sessionID,
            block.timestamp,
            information
        );
    }

    function endSession(uint256 _sessionID, uint32 _userID, bytes32 _previousTransactionHash) external{
        require(activeSessions[_sessionID], "Not active session");
        emit EndOfSession(
            _sessionID,
            _userID,
            _previousTransactionHash,
            block.timestamp
        );
        activeSessions[_sessionID] = false;
    }

    // function migratingUser(uint256 _userID, uint32 chainIndex) external {
    //     emit migration(_userID, chainIndex, block.timestamp);
    // }
}