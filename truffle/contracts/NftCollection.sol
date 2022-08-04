// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

//TODO: SetTokenUri URI+tokenId

contract NftCollection is ERC721URIStorage, Royalties, Ownable, MetaVariables, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint80 public max_mint_allowed;
    uint80 public max_supply;
    bool private isInit;
    string namecollection;
    string private filetype;

    mapping(uint => nftCollectionData) public tokenIdToNftData;
    mapping(address => uint) public userToMintAmount;

    event TokenMinted(address _tokenOwner, uint _tokenId);
    event CollectionInitiated(address _contractOwner, uint _max_supply, string namecollection);
    event LogDepositReceived(address _from, uint _amount);

    constructor() ERC721("", "") {}

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
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 _interfaceId) public view virtual override(ERC721, Royalties) returns (bool){
        return super.supportsInterface(_interfaceId);
    }

    /**
    @notice Init function used to populate the collection once it was created by the factory
    @param _creator The owner of the collection
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The amount of NFTs in the collection, got from the frontend to avoid using gas calculating it
    @param _nftFactoryInputData The NFT collection metadata (
    @dev Emits "CollectionInitiated" event
    */
    function init(string calldata _namecollection,  address _creator, uint80 _max_mint_allowed, uint80 _max_supply, nftCollectionData[] calldata _nftFactoryInputData) external onlyOwner {
        require(!isInit, "Contract was already initiated");
        //        for(uint i = 0; i < _max_supply; _unsafeIncrement(i)) {
        for(uint i = 0; i < _max_supply; i++) {
            _tokenIds.increment();
            tokenIdToNftData[_tokenIds.current()] = _nftFactoryInputData[i];
            _setTokenRoyalty(_tokenIds.current(), _creator, tokenIdToNftData[_tokenIds.current()].royalties);
           // _setTokenURI(_tokenIds.current(), tokenIdToNftData[_tokenIds.current()].linkToImage);
        }
        
        namecollection = _namecollection;
        max_mint_allowed = _max_mint_allowed;
        max_supply = _max_supply;
        _transferOwnership(_creator);
        isInit = true;
        emit CollectionInitiated(owner(), _max_supply, namecollection);
    }

    /**
    @notice Function used to mint tokens and regulate minting
    @param _tokenId The id of the token to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function mintNft(uint _tokenId) public whenNotPaused payable returns(uint) {
        //TODO:         require(_tokenIds.current() + 1 <= max_supply, "Max supply reached"); useless. Le max est défini par la length de nftFactoryInputData.
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(msg.value >= tokenIdToNftData[_tokenId].price, "Insufficient funds");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed, "Max mint amount reached");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(msg.sender, _tokenId);

        emit TokenMinted(msg.sender, _tokenId);
        return(_tokenId);
    }

    /**
    @notice Function used to withdraw contract funds
    */
    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    /**
    @notice Function used to gift tokens and regulate minting
    @param _luckyOne The address of the token receiver
    @param _tokenId The id of the token to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function gift(address _luckyOne, uint _tokenId) external payable onlyOwner {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + 1 <= max_mint_allowed, "Max mint amount reached");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        userToMintAmount[msg.sender] += 1;
        _safeMint(_luckyOne, _tokenId);

        emit TokenMinted(msg.sender, _tokenId);
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

    function _unsafeIncrement(uint x) private pure returns(uint) {
    unchecked { return (x + 1);}
    }
}