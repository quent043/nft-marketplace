// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

//TODO: SetTokenUri URI+tokenId
//TODO: Initializable

contract SftCollection is ERC1155, Royalties, Ownable, MetaVariables, Pausable, Initializable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint120 public max_mint_allowed;
    uint120 public max_supply;
    bool private isInit;

    mapping(uint => sftCollectionData) public tokenIdToSftData;
    mapping(address => uint) public userToMintAmount;

    event TokenMinted(address tokenOwner, uint tokenId, uint amount);
    event CollectionInitiated(address contractOwner, uint amountOfSeries);
    event LogDepositReceived(address from, uint amount);

    constructor() ERC1155("") {}

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
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    /**
    @notice Init function used to populate the collection once it was created by the factory
    @param _creator The owner of the collection
    @param _uri The URI of the IPFS storage location
    @param _max_mint_allowed The maximum amounts of mints allowed per user
    @param _max_supply The maximum amount of SFTs in the collection
    @param _sftFactoryInputData The SFT collection metadata (
    @param _amountOfSeries The amount of tokens in the collection, got from the frontend to avoid using gas calculating it
    @dev Emits "CollectionInitiated" event
    */
    function init(address _creator, string calldata _uri, uint120 _max_mint_allowed, uint120 _max_supply, sftCollectionData[] memory _sftFactoryInputData, uint _amountOfSeries) external onlyOwner {
        require(!isInit, "Contract was already initiated");

        for(uint i = 0; i < _amountOfSeries; _unsafeIncrement(i)) {
            _tokenIds.increment();
            tokenIdToSftData[_tokenIds.current()] = _sftFactoryInputData[i];
            _setTokenRoyalty(_tokenIds.current(), _creator, tokenIdToSftData[_tokenIds.current()].royalties);
        }

        _setURI(_uri);
        max_mint_allowed = _max_mint_allowed;
        max_supply = _max_supply;
        _transferOwnership(_creator);
        isInit = true;

        emit CollectionInitiated(owner(), _amountOfSeries);
    }

    /**
    @notice Function used to withdraw contract funds
    */
    function withdraw() external payable onlyOwner {
        payable (owner()).transfer(address (this).balance);
    }

    //TODO: Utiliser le hook _beforeTokenTransfer pour cette méthode ? Ou juste pour les events ? C'est appelé ppour les Batch aussi
    /**
    @notice Function used to mint tokens and regulate minting
    @param _tokenId The id of the token to be minted
    @param _amount The amount of SFT to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function mintSft(uint _tokenId, uint _amount) public payable whenNotPaused returns (uint) {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + _amount <= max_mint_allowed, "Max mint amount reached");
        require(tokenIdToSftData[_tokenId].minted + _amount <= tokenIdToSftData[_tokenId].supply, "Not enough Supply");
        require(msg.value >= tokenIdToSftData[_tokenId].price * _amount, "Insufficient funds");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        tokenIdToSftData[_tokenId].minted += _amount;
        userToMintAmount[msg.sender] += _amount;
        _mint(msg.sender, _tokenId, _amount, "");

        //TODO: On enlève ? Ou on renvoie autre chose ?
        emit TokenMinted(msg.sender, _tokenIds.current(), _amount);
        return _tokenId;
    }

    /**
    @notice Function used to gift tokens and regulate minting
    @param _luckyOne The address of the token receiver
    @param _tokenId The id of the token to be minted
    @param _amount The amount of SFT to be minted
    @dev Emits "TokenMinted" event | Requires token to exist (0 does not exist),
    payment to be sufficient, and max supply and mint amounts not reached.
    */
    function gift(address _luckyOne, uint _tokenId ,uint _amount) external onlyOwner {
        require(_tokenId > 0, "Token does not exist");
        require(_tokenId <= _tokenIds.current(), "Token does not exist");
        require(userToMintAmount[msg.sender] + _amount <= max_mint_allowed, "Max mint amount reached");
        require(tokenIdToSftData[_tokenId].minted + _amount <= tokenIdToSftData[_tokenId].supply, "Not enough Supply");
        require(_tokenIds.current() + 1 <= max_supply, "Max supply reached");

        tokenIdToSftData[_tokenId].minted += _amount;
        userToMintAmount[msg.sender] += _amount;
        _mint(_luckyOne, _tokenId, _amount, "");

        emit TokenMinted(msg.sender, _tokenId, _amount);
    }

    /**
    @notice Function used by the owner to pause certain functions
    @dev Used here only on mintSft() function
    */
    function pause() public onlyOwner {
        _pause();
    }

    /**
    @notice Function used by the owner to unpause certain functions
    @dev Used here only on mintSft() function
    */
    function unPause() public onlyOwner {
        _unpause();
    }

    function _unsafeIncrement(uint x) private pure returns(uint) {
    unchecked { return (x + 1);}
    }
}