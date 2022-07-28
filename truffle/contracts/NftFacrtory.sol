// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./SftCollection.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";

//TODO: Ajouter notre email
//TODO: Events
//TODO: Ajouter une fonction de random pour un attribut du NFT via Chainlink

contract NftFactory is MetaVariables {

    event CollectionDeployed(address contractAddress);

    function createInputData() external {

    }

    function createSftCollection(string calldata _uri, uint _max_mint_allowed, uint _max_supply, sftCollectionData[] calldata sftFactoryInputData, uint _amountOfSeries) external {
        // Import the bytecode of the contract to deploy
        bytes memory sftCollectionBytecode = type(SftCollection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address sftCollectionAddress = Create2.deploy(0, salt, sftCollectionBytecode);

        emit CollectionDeployed(sftCollectionAddress);

        SftCollection(sftCollectionAddress).init(msg.sender, _uri, _max_mint_allowed, _max_supply, sftFactoryInputData, _amountOfSeries);

    }

    function createNftCollection(string calldata _uri, uint _max_mint_allowed, uint _max_supply, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfSeries) external {
        // Import the bytecode of the contract to deploy
        bytes memory nftCollectionBytecode = type(NftCollection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address nftCollectionAddress = Create2.deploy(0, salt, nftCollectionBytecode);

        emit CollectionDeployed(nftCollectionAddress);

        NftCollection(nftCollectionAddress).init(msg.sender, _uri, _max_mint_allowed, _max_supply, nftFactoryInputData, _amountOfSeries);
    }

}