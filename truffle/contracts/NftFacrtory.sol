// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./VRFv2Consumer.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// FOR ALL CONTRACTS
//TODO: Security audit
//TODO: Gas Optimisation
//TODO: Check public private etc.
//TODO: Naming conventions
//TODO: Var, func etc. order placement
//TODO: Variables notation (camelcase etc.)
//TODO: Create SFTFactory.sol
//TODO: Besoin de fonction receive? Le pognon peut être reçu sans ça ?

    /**
    @author Quentin de Châteaubriant, Renaud Vidal, Nathan Combes contact: cryptokeymakers@gmail.com
    @notice This contract creates either a SFT or a NFT collection
    */

contract NftFactory is MetaVariables, Ownable {

    uint64 constant CHAINLINK_SUBSCRIPTION_ID = 9366;
    VRFv2Consumer chanlinkRandomGanarator = new VRFv2Consumer(CHAINLINK_SUBSCRIPTION_ID);

    event CollectionDeployed(address contractAddress);
    event LogDepositReceived(address from, uint amount);

    /**
    @notice Factory function used to create a NFT or SFT collection
    @param _uri The URI of the IPFS storage location
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The maximum amount of NFTs in the collection
    @param nftFactoryInputData The NFT collection metadata (
    @param _amountOfNft The amount of tokens in the collection, got from the frontend to avoid using gas calculating it
    @dev Emits "CollectionDeployed" event
    */
    function createNftCollection(string calldata _uri, uint _max_mint_allowed, uint _max_supply, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfNft) external {
        // Import the bytecode of the contract to deploy
        bytes memory nftCollectionBytecode = type(NftCollection).creationCode;
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address nftCollectionAddress = Create2.deploy(0, salt, nftCollectionBytecode);

        emit CollectionDeployed(nftCollectionAddress);

        NftCollection(nftCollectionAddress).init(msg.sender, _uri, _max_mint_allowed, _max_supply, nftFactoryInputData, _amountOfNft);
    }

    receive() external payable{
        payable (owner()).transfer(msg.value);
        emit LogDepositReceived(msg.sender, msg.value);
    }
}