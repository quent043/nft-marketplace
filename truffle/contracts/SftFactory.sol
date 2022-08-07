// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SftCollection.sol";
import "./MetaVariables.sol";

contract SftFactory is MetaVariables , Ownable{

    event CollectionDeployed(address contractAddress);
    event LogDepositReceived(address from, uint amount);

    /**
    @notice Function used to receive ether
    @dev  Emits "LogDepositReceived" event | Ether send to this contract for
    no reason will be credited to the contract owner, and the deposit logged,
    */
    receive() external payable{
        payable (owner()).transfer(msg.value);
        emit LogDepositReceived(msg.sender, msg.value);
    }

    /**
    @notice Factory function used to create a SFT collection
    @param _uri The URI of the IPFS storage location
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The maximum amount of SFTs in the collection
    @param _sftFactoryInputData The SFT collection metadata (
    @param _amountOfSeries The amount of tokens in the collection, got from the frontend to avoid using gas calculating it
    @dev Emits "CollectionDeployed" event
    */
    function createSftCollection(string calldata _uri, uint64 _max_mint_allowed, uint64 _max_supply, sftCollectionData[] calldata _sftFactoryInputData, uint64 _amountOfSeries) external onlyOwner {
        // Import the bytecode of the contract to deploy
        bytes memory sftCollectionBytecode = type(SftCollection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address sftCollectionAddress = Create2.deploy(0, salt, sftCollectionBytecode);

        emit CollectionDeployed(sftCollectionAddress);

        SftCollection(payable (sftCollectionAddress)).init(msg.sender, _uri, _max_mint_allowed, _max_supply, _sftFactoryInputData, _amountOfSeries);
    }
}