// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";

// FOR ALL CONTRACTS
//TODO: Security audit
//TODO: Besoin de fonction receive? Le pognon peut être reçu sans ça ?

/**
@author Quentin de Châteaubriant, Renaud Vidal, Nathan Combes contact: cryptokeymakers@gmail.com
    @notice This contract creates either a SFT or a NFT collection
    */

contract NftFactory is MetaVariables, Ownable {

    event CollectionDeployed(address _contractAddress);
    event LogDepositReceived(address _from, uint _amount);

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
    @notice Factory function used to create a NFT collection
    @param _uri The URI of the IPFS storage location
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The amount of tokens in the collection, got from the frontend to avoid using gas calculating it
    @param _nftFactoryInputData The NFT collection metadata
    @dev Emits "CollectionDeployed" event
    */
    function createNftCollection(string calldata _uri, uint80 _max_mint_allowed, uint80 _max_supply, nftCollectionData[] calldata _nftFactoryInputData) external {
        bytes memory nftCollectionBytecode = type(NftCollection).creationCode;
        // Random salt based on the artist name + block timestamp
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        address nftCollectionAddress = Create2.deploy(0, salt, nftCollectionBytecode);

        emit CollectionDeployed(nftCollectionAddress);

        NftCollection(payable (nftCollectionAddress)).init(msg.sender, _uri, _max_mint_allowed, _max_supply, _nftFactoryInputData);
    }
}