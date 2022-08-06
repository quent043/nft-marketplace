// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;


import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftCollection.sol";
import "./MetaVariables.sol";

contract TokenOwnershipRegister is Ownable {
    mapping(address => bool) deployedCollections;
    mapping(address => mapping(address => uint256)) public userToCollectionToBalance;
    mapping(address => mapping(address => uint256[])) public userToCollectionToTokens;
    address factoryAddress;

    modifier onlyFactory() {
        require(msg.sender == factoryAddress, "Factory only");
        _;
    }

    modifier onlyRegisteredCollections(address sender) {
        require(deployedCollections[sender], "Registered collections only");
        _;
    }

    function setFactoryAddress(address _factoryAddress) external onlyOwner {
        factoryAddress = _factoryAddress;
    }

    function registerCollection(address _newCollection) external onlyFactory {
        deployedCollections[_newCollection] = true;
    }

    function recordMint(address _collection, address _owner, uint _tokenId) external onlyRegisteredCollections(_collection) {
        userToCollectionToBalance[_owner][_collection]+= 1;
        userToCollectionToTokens[_owner][_collection].push(_tokenId);
    }

    function recordTransfer(address _collection, address _from, address _to, uint _tokenId) external onlyRegisteredCollections(_collection) {
        for(uint i = 0; i < userToCollectionToBalance[_from][_collection]; i++) {
            if(userToCollectionToTokens[_from][_collection][i] == _tokenId) {
                uint lastIndex = userToCollectionToBalance[_from][_collection] - 1;
                uint lastIndexValue = userToCollectionToTokens[_from][_collection][lastIndex];
                userToCollectionToTokens[_from][_collection][i] = lastIndexValue;
                //TODO: Marche pas avec pop() ...
                // userToCollectionToTokens[_from][_collection].pop();
                delete userToCollectionToTokens[_from][_collection][lastIndex];
            }
        }
        userToCollectionToTokens[_to][_collection].push(_tokenId);

        userToCollectionToBalance[_from][_collection]-= 1;
        userToCollectionToBalance[_to][_collection]+= 1;
    }
}