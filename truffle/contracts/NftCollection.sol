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
    event LogDepositReceived(address from, uint amount);

    /**
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    //TODO:         require(_tokenIds.current() + 1 <= max_supply, "Max supply reached"); useless. Le max est défini dans la supply.
    /**
    @notice Init function used to populate the collection once it was created by the factory
    @param _creator The owner of the collection
    @param _uri The URI of the IPFS storage location
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The maximum amount of NFTs in the collection
    @param nftFactoryInputData The NFT collection metadata (
    @param _amountOfNft The amount of tokens in the collection, got from the frontend to avoid using gas calculating it
    @dev Emits "CollectionInitiated" event
    */
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

    /**
    @notice Function used to mint tokens and regulate minting
    @param tokenId The id of the token to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function mintNft(uint tokenId) public whenNotPaused payable returns(uint) {
        require(tokenId > 0, "Token does not exist");
        require(tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[tokenId]._price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed, "Max mint amount reached");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(msg.sender, tokenId);

        emit TokenMinted(msg.sender, tokenId);
        return(tokenId);
    }

    /**
    @notice Function used to withdraw contract funds
    */
    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    /**
    @notice Function used to gift tokens and regulate minting
    @param luckyOne The address of the token receiver
    @param tokenId The id of the token to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function gift(address luckyOne, uint tokenId) external payable onlyOwner {
        require(tokenId > 0, "Token does not exist");
        require(tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed, "Max mint amount reached");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(luckyOne, tokenId);

        emit TokenMinted(msg.sender, tokenId);
    }

    /**
    @notice Function used by the owner to pause certain functions
    @dev Used here only on mintNft() function
    */
    function pause() public onlyOwner {
        _pause();
    }

    /**
    @notice Function used by the owner to unpause certain functions
    @dev Used here only on mintNft() function
    */
    function unPause() public onlyOwner {
        _unpause();
    }

    /**
    @notice Function used to receive ether
    @dev  Emits "LogDepositReceived" event | Ether send to this contract for
    no reason will be credited to the contract owner, and the deposit logged,
    */
    receive() external payable{
        payable (owner()).transfer(msg.value);
        emit LogDepositReceived(msg.sender, msg.value);
    }
}