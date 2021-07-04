pragma solidity ^0.8.3;

contract StageOfFarming {

    uint128 sessionID;
    uint16 stageNumber;

    string public COMPANY_NAME;
    event StartOfSession(
        address farmer, 
        uint16 stageNumberOfChain, 
        uint128 sessionID,
        uint256 timeNow,
        bool pesticides
    );
    
    constructor(string memory companyName) {
        COMPANY_NAME = companyName;
    }

    function startSession(bool _pesticides) external {
        emit StartOfSession(
            msg.sender, 
            1, 
            getNextSessionID(), 
            block.timestamp, 
            _pesticides
        );
    }

    function getNextSessionID() internal returns(uint128) { 
        sessionID += 1;
        return sessionID;
    }
}