// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

//TODO: Ajouter une fonction de random pour un attribut du NFT via Chainlink
//TODO: SetTokenUri URI+tokenId
//TODO: Initializable

contract SftCollection is ERC1155, Royalties, Ownable, MetaVariables, Pausable, Initializable {
    //TODO: Initializable
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public max_mint_allowed;
    uint public max_supply;
    bool private isInit;
    mapping(uint => sftCollectionData) public tokenIdToSftData;
    mapping(address => uint) public userToMintAmount;

    event TokenMinted(address tokenOwner, uint tokenId, uint amount);
    event CollectionInitiated(address contractOwner, uint amountOfSeries);

    constructor() ERC1155("") {}

    function init(address _creator, string calldata _uri, uint _max_mint_allowed, uint _max_supply, sftCollectionData[] memory sftFactoryInputData, uint _amountOfSeries) external onlyOwner {
        require(!isInit, "Contract was already initiated");

        for(uint i = 0; i < _amountOfSeries; i++) {
            _tokenIds.increment();
            tokenIdToSftData[_tokenIds.current()] = sftFactoryInputData[i];
            _setTokenRoyalty(_tokenIds.current(), msg.sender, tokenIdToSftData[_tokenIds.current()]._royalties);
        }

        _setURI(_uri);
        max_mint_allowed = _max_mint_allowed;
        max_supply = _max_supply;
        _transferOwnership(_creator);
        isInit = true;

        emit CollectionInitiated(owner(), _amountOfSeries);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    //TODO: Utiliser le hook _beforeTokenTransfer pour cette méthode ? Ou juste pour les events ? C'est appelé ppour les Batch aussi
    function _mintSft(uint _tokenId, uint _amount) public payable whenNotPaused returns (uint) {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + _amount <= max_mint_allowed);
        require(tokenIdToSftData[_tokenId]._minted + _amount <= tokenIdToSftData[_tokenId]._supply, "Not enough Supply");
        require(msg.value >= tokenIdToSftData[_tokenId]._price * _amount, "Insufficient funds");

        tokenIdToSftData[_tokenId]._minted += _amount;
        userToMintAmount[msg.sender] += _amount;
        _mint(msg.sender, _tokenId, _amount, "");

        //TODO: On enlève ? Ou on renvoie autre chose ?
        emit TokenMinted(msg.sender, _tokenIds.current(), _amount);
        return _tokenId;
    }

    function gift(address luckyOne, uint tokenId ,uint amount) external onlyOwner {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + _amount <= max_mint_allowed);
        require(tokenIdToSftData[_tokenId]._minted + _amount <= tokenIdToSftData[_tokenId]._supply, "Not enough Supply");

        tokenIdToSftData[tokenId]._minted += _amount;
        userToMintAmount[msg.sender] += _amount;
        _mint(luckyOne, tokenId, amount, "");

        emit TokenMinted(msg.sender, tokenId, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unPause() public onlyOwner {
        _unpause();
    }

    // function mintSft(string calldata _name, string calldata _description, string calldata _image, uint _amount, uint _royalties) public returns (uint){
    //     _tokenIds.increment();
    //     sftList.push(Sft(_name, _description, _image));
    //     uint256 newItemId = _tokenIds.current();
    //     _mint(msg.sender, newItemId, _amount, "");
    //     _setTokenRoyalty(newItemId, msg.sender, _royalties);

    //     return newItemId;
    // }
}
