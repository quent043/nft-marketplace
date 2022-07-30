// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

//TODO: Add Burn ? (Existe deja?)
//TODO: SetTokenUri URI+tokenId

contract NftCollection is ERC721URIStorage, Royalties, Ownable, MetaVariables, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint public max_mint_allowed;
    uint public max_supply;
    bool private isInit;
    mapping(uint => nftCollectionData) public tokenIdToNftData;
    mapping(address => uint) public userToMintAmount;

    constructor() ERC721("", "") {}

    event TokenMinted(address tokenOwner, uint tokenId);
    event CollectionInitiated(address contractOwner, uint amountOfNft);

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }
    //TODO:         require(_tokenIds.current() + 1 <= max_supply, "Max supply reached"); useless. Le max est défini dans la supply.
    function init(address _creator, string calldata _uri, uint _max_mint_allowed, uint _max_supply, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfNft) external onlyOwner {
        require(!isInit, "Contract was already initiated");
        // require(_amountOfNft <= max_supply, "Max supply reached");
        for(uint i = 0; i < _amountOfNft; i++) {
            _tokenIds.increment();
            tokenIdToNftData[_tokenIds.current()] = nftFactoryInputData[i];
            _setTokenRoyalty(_tokenIds.current(), _creator, tokenIdToNftData[_tokenIds.current()]._royalties);
            //TODO: SetTokenUri URI+tokenId
            //            _setTokenURI(_tokenIds.current(), _uri);
        }

        max_mint_allowed = _max_mint_allowed;
        max_supply = _max_supply;
        _transferOwnership(_creator);
        isInit = true;
        emit CollectionInitiated(owner(), _amountOfNft);
    }

    function mintNft(uint tokenId) public whenNotPaused payable returns(uint) {
        require(tokenId > 0, "Token does not exist");
        require(tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[tokenId]._price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed);
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(msg.sender, tokenId);

        emit TokenMinted(msg.sender, tokenId);
        return(tokenId);
    }

    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    function gift(address luckyOne, uint tokenId) external payable onlyOwner {
        require(tokenId > 0, "Token does not exist");
        require(tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[tokenId]._price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed);
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(luckyOne, tokenId);

        emit TokenMinted(msg.sender, tokenId);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unPause() public onlyOwner {
        _unpause();
    }
}