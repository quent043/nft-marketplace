// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./VRFv2Consumer.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//TODO: Ajouter notre email
//TODO: Events

contract NftFactory is MetaVariables, Ownable {

    uint64 constant CHAINLINK_SUBSCRIPTION_ID = 9366;
    VRFv2Consumer chanlinkRandomGanarator = new VRFv2Consumer(CHAINLINK_SUBSCRIPTION_ID);

    event CollectionDeployed(address contractAddress);

    function createNftCollection(string calldata _uri, uint _max_mint_allowed, uint _max_supply, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfNft) external onlyOwner {
        // Import the bytecode of the contract to deploy
        bytes memory nftCollectionBytecode = type(NftCollection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address nftCollectionAddress = Create2.deploy(0, salt, nftCollectionBytecode);

        emit CollectionDeployed(nftCollectionAddress);

        NftCollection(nftCollectionAddress).init(msg.sender, _uri, _max_mint_allowed, _max_supply, nftFactoryInputData, _amountOfNft);
    }
}