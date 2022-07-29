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

    function init(address _creator, string calldata _uri, uint _max_mint_allowed, uint _max_supply, nftCollectionData[] calldata nftFactoryInputData, uint _amountOfNft) external onlyOwner {
        require(!isInit, "Contract was already initiated");
        for(uint i = 0; i < _amountOfNft; i++) {
            _tokenIds.increment();
            tokenIdToNftData[_tokenIds.current()] = nftFactoryInputData[i];
            _setTokenRoyalty(_tokenIds.current(), msg.sender, tokenIdToNftData[_tokenIds.current()]._royalties);
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
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[_tokenIds.current()]._price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed);

        userToMintAmount[msg.sender] += 1;
        _safeMint(msg.sender, _tokenIds.current());

        emit TokenMinted(msg.sender, _tokenIds.current());
        return(_tokenIds.current());
    }

    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    function gift(address luckyOne, uint tokenId) external onlyOwner {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[_tokenIds.current()]._price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed);

        userToMintAmount[msg.sender] += 1;
        _safeMint(luckyOne, _tokenIds.current());

        emit TokenMinted(msg.sender, tokenId);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unPause() public onlyOwner {
        _unpause();
    }
}