// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NftCollection.sol";


contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public itemCount;


    // Variables
    address payable public immutable marketplaceOwnerAccount;
    uint public immutable marketplaceFeePercentage;

    struct Item {
        uint itemId;
        NftCollection nft;
        uint tokenId;
        uint price;
        address seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public itemIdToItemData;

    event putForSale(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePertenthousand) {
        marketplaceOwnerAccount = payable(msg.sender);
        marketplaceFeePercentage = _feePertenthousand;
    }

    /**
    @notice Function used to allow voters to vote for a proposal
    @param _nft The contract address of the NFT being put for sale
    @param _tokenId The id of the NFT being put for sale
    @param _nft The price of the NFT being put for sale
    @dev
    */
    function putItemForSale(NftCollection _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");

        // address seller = msg.sender;
        itemCount.increment();
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        itemIdToItemData[itemCount.current()] = Item (
            itemCount.current(),
            _nft,
            _tokenId,
            _price,
            msg.sender,
            false
        );

        emit putForSale(
            itemCount.current(),
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = itemIdToItemData[_itemId];
        require(_itemId > 0 && _itemId <= itemCount.current(), "item doesn't exist");
        require(msg.value >= itemIdToItemData[_itemId].price, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");

        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // pay seller and feeAccount
        splitPayment(_itemId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function splitPayment(uint _itemId) internal {
        uint price = itemIdToItemData[_itemId].price;
        (address receiver, uint royaltyAmount) = itemIdToItemData[_itemId].nft.royaltyInfo(_itemId, price);
        //Pay royalties
        (bool royaltySent,) = payable (receiver).call{value: royaltyAmount}("");
        require(royaltySent, "Royaltiy payment failed");
        //Pay marketPlace fees
        uint marketplaceFee = (price * marketplaceFeePercentage) / 10000;
        (bool feeSent,) = marketplaceOwnerAccount.call{value: marketplaceFee}("");
        require(feeSent, "Fee payment failed");
        //Pay seller
        (bool paymentSent,) = payable (itemIdToItemData[_itemId].seller).call{value: (price - (royaltyAmount + marketplaceFee))}("");
        require(paymentSent, "Payment failed");
    }
}