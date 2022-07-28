// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

contract SftCollection is ERC1155, Royalties, Ownable, MetaVariables {
    //TODO: Pause sur la vente
    //La ,Factory appèlera la fonction _setURI après la création du Contract --> Dans une fonction init() avec max supply etc.

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    Sft[] sftList;
    uint public max_mint_allowed;
    uint public max_supply;
    bool private isInit;
    // tokenId to sftData
    mapping(uint => sftCollectionData) public sftCollectionMapping;
    sftCollectionData[] public sftCollection;


    struct Sft {
        string name;
        string description;
        string image;
    }

    constructor() ERC1155("") {}

    function init(address _creator, string calldata _uri, uint _max_mint_allowed, uint _max_supply, sftCollectionData[] memory sftFactoryInputData, uint _amountOfSeries) external onlyOwner {
        require(!isInit, "Contract was already initiated");

        for(uint i = 0; i < _amountOfSeries; i++) {
            _tokenIds.increment();
            sftCollectionMapping[_tokenIds.current()] = sftFactoryInputData[i];
        }

        _setURI(_uri);
        max_mint_allowed = _max_mint_allowed;
        max_supply = _max_supply;
        _transferOwnership(_creator);
        isInit = true;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    // function mintSft(string calldata _name, string calldata _description, string calldata _image, uint _amount, uint _royalties) public returns (uint){
    //     _tokenIds.increment();
    //     sftList.push(Sft(_name, _description, _image));
    //     uint256 newItemId = _tokenIds.current();
    //     _mint(msg.sender, newItemId, _amount, "");
    //     _setTokenRoyalty(newItemId, msg.sender, _royalties);

    //     return newItemId;
    // }

    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    function _mintSft(uint _tokenId, uint _amount) public payable returns (uint) {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        //Require sur max mint + mapping ownership
        require(sftCollectionMapping[_tokenId]._minted + _amount <= sftCollectionMapping[_tokenId]._supply, "Not enough Supply");

        //Multiply by amount
        require(msg.value >= sftCollectionMapping[_tokenId]._price, "Insufficient funds");

        sftCollectionMapping[_tokenId]._minted += _amount;
        _mint(msg.sender, _tokenId, _amount, "");
        _setTokenRoyalty(_tokenId, msg.sender, sftCollectionMapping[_tokenId]._royalties);

        //TODO: On enlève ? Ou on renvoie autre chose ?
        return _tokenId;
    }
}
