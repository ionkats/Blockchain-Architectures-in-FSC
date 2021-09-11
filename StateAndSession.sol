pragma solidity ^0.8.3;

contract StateAndSession {

    event StartOfSession(
        uint256 indexed sessionID,
        uint32 companyID, 
        uint32 userID, 
        uint256 time
    );

    event Handoff(
        uint256 indexed sessionID,
        uint32 previousCompanyID,
        uint32 previousUserID,
        uint32 newCompanyID,
        uint32 newUserID, 
        bytes32 previousStateTransactionHash, 
        uint32 previousChainIndex,
        uint256 time
    );

    event SensorLog(
        uint256 indexed sessionID,
        uint32 indexed companyID,
        string info,
        uint256 time
    );

    event EndOfSession(
        uint256 indexed sessionID,
        uint32 companyID,
        uint32 userID,
        bytes32 previousTransactionHash,
        uint256 time
    );

    mapping(uint256 => bool) public activeSessions;
    uint256 public sessionID;

    function startSession(
        uint32 _companyID,
        uint32 _userID
        ) external {
            emit StartOfSession(
                getNextSessionID(),
                _companyID,
                _userID, 
                block.timestamp
            );
    }

    function handoff(
        uint256 _sessionID, 
        uint32 _previousCompanyID,
        uint32 _previousUserID,
        uint32 _newCompanyID,
        uint32 _newUserID,
        bytes32 _previousStateTransactionHash,
        uint32 _previousChainIndex
        ) external {
            require(activeSessions[_sessionID], "Not active Session");
            emit Handoff(
                _sessionID, 
                _previousCompanyID,
                _previousUserID, 
                _newCompanyID,
                _newUserID, 
                _previousStateTransactionHash, 
                _previousChainIndex, 
                block.timestamp
                );
    }

    function getNextSessionID() public returns(uint256) { 
        sessionID += 1;
        activeSessions[sessionID] = true;
        return sessionID;
    }

    function sensorLogging(uint256 _sessionID, uint32 _companyID, string memory information) external{
        require(activeSessions[_sessionID], "Not active session");
        emit SensorLog(
            _sessionID,
            _companyID,
            information,
            block.timestamp
        );
    }

    function endSession(uint256 _sessionID, uint32 _companyID, uint32 _userID, bytes32 _previousTransactionHash) external{
        require(activeSessions[_sessionID], "Not active session");
        emit EndOfSession(
            _sessionID,
            _companyID,
            _userID,
            _previousTransactionHash,
            block.timestamp
        );
        activeSessions[_sessionID] = false;
    }

}