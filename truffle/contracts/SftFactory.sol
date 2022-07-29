// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./VRFv2Consumer.sol";
import "./SftCollection.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";

//TODO: Ajouter notre email
//TODO: Events

contract SftFactory is MetaVariables {

    uint64 constant CHAINLINK_SUBSCRIPTION_ID = 9366;
    VRFv2Consumer chanlinkRandomGanarator = new VRFv2Consumer(CHAINLINK_SUBSCRIPTION_ID);

    // function generateRandom() external {
    //     chanlinkRandomGanarator.requestRandomWords();
    // }

    // function getRandNumber(uint _index) external returns(uint) {
    //     chanlinkRandomGanarator.s_randomWords;
    //     emit Data(chanlinkRandomGanarator.s_randomWords.call());
    // }

    event CollectionDeployed(address contractAddress);
    event Data(uint256 data);


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
}