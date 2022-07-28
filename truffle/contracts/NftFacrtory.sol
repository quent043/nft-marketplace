// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./SftCollection.sol";
import "./MetaVariables.sol";

//TODO: Ajouter notre email
//TODO: Events


contract NftFactory is MetaVariables {

    event CollectionDeployed(address contractAddress);

    // collectionData[] sftFactoryInputData;

    function createInputData() external {

    }

    function createSftCollection(string calldata _uri, uint _max_mint_allowed, uint _max_supply, sftCollectionData[] calldata sftFactoryInputData, uint _amountOfSeries) external {
        // Import the bytecode of the contract to deploy
        bytes memory sftCollectionBytecode = type(SftCollection).creationCode;
        // Make a random salt based on the artist name
        //TODO: CHAINLINK RANDOM
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address sftCollectionAddress = Create2.deploy(0, salt, sftCollectionBytecode);

        emit CollectionDeployed(sftCollectionAddress);

        SftCollection(sftCollectionAddress).init(msg.sender, _uri, _max_mint_allowed, _max_supply, sftFactoryInputData, _amountOfSeries);

    }

    function createNftCollection() external {

    }

}