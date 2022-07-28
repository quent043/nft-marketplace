// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

//TODO: Pausable sur init
//TODO: Pause sur la vente
//TODO: Mapping max mint
//TODO: Dégager et renommer les setters
//TODO: Events
//TODO: Payment
//TODO: Fonction gift ?

contract NftCollection is ERC721, Royalties, Ownable, MetaVariables {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public maxPurchasePerBuyer;
    mapping(uint => nftCollectionData) public nftCollectionMapping;

    constructor() ERC721("", "") {}


    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function init(address _creator, string calldata _uri, uint _maxPurchasePerBuyer, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfSeries) external onlyOwner {
        for(uint i = 0; i < _amountOfSeries; i++) {
            _tokenIds.increment();
            nftCollectionMapping[_tokenIds.current()] = nftFactoryInputData[i];
        }

        _setMaxPurchasePerBuyer(_maxPurchasePerBuyer);
        _transferOwnership(_creator);
    }

    function _setMaxPurchasePerBuyer(uint _amount) private onlyOwner {
        maxPurchasePerBuyer = _amount;
    }

    function mintNft() external {
        _tokenIds.increment();
        _safeMint(msg.sender, _tokenIds.current());
    }

    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }


}