// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftCollection.sol";


contract Marketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public itemCount;

    address payable public immutable marketplaceOwnerAccount;
    uint128 public immutable marketplaceFeePercentage;

    mapping(uint => MarketplaceItem) public itemIdToItemData;

    struct MarketplaceItem {
        uint marketplaceItemId;
        uint64 tokenId;
        uint64 price;
        address seller;
        bool sold;
        NftCollection nft;
    }

    event PutForSale(
        uint _itemId,
        uint64 _tokenId,
        uint64 _price,
        address indexed _nft,
        address indexed _seller
    );

    event Bought(
        uint _itemId,
        uint64 _tokenId,
        uint64 _price,
        address indexed _nft,
        address indexed _seller,
        address indexed _buyer
    );

    event SplitPayment(
        uint64 _paidAmount,
        uint64 _royaltyAmount,
        uint64 _feeAmount,
        address _sellerAddress,
        address _royaltyAddress,
        address _marketplaceAddress
    );

    event LogDepositReceived(address _from, uint _amount);


    constructor(uint128 _feePertenthousand) {
        marketplaceOwnerAccount = payable(msg.sender);
        marketplaceFeePercentage = _feePertenthousand;
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

    /**
    @notice Function used to put a NFT for sale on the marketplace
    @param _nftCollection The contract address of the NFT being put for sale
    @param _tokenId The id of the NFT being put for sale
    @param _price The price of the NFT being put for sale
    @dev Emits a "PutForSale" event
    */
    function putNftForSale(NftCollection _nftCollection, uint64 _tokenId, uint64 _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");

        //Marche pas
        // emit ApproveLogger(address(this), _tokenId);
        // _nft.approve(address(this), _tokenId);
        itemCount.increment();
        _nftCollection.transferFrom(msg.sender, address(this), _tokenId);

        itemIdToItemData[itemCount.current()] = MarketplaceItem(
            itemCount.current(),
            _tokenId,
            _price,
            msg.sender,
            false,
            _nftCollection
        );

        emit PutForSale(
            itemCount.current(),
            _tokenId,
            _price,
            address(_nftCollection),
            msg.sender
        );
    }

    /**
    @notice Function used to purchase a NFT for sale on the marketplace
    @param _itemId The marketplace id of the NFT being bought
    @dev Emits a "Bought" event, protected against reentrancy
    */
    function purchaseItem(uint _itemId) external payable nonReentrant {
        MarketplaceItem storage item = itemIdToItemData[_itemId];
        require(_itemId > 0 && _itemId <= itemCount.current(), "item doesn't exist");
        require(msg.value >= itemIdToItemData[_itemId].price, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");

        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        _splitPayment(_itemId);

        emit Bought(
            _itemId,
            item.tokenId,
            item.price,
            address(item.nft),
            item.seller,
            msg.sender
        );
    }

    /**
    @notice Function used to calculate fees, & royalties and pay all the recipients
    @param _itemId The marketplace id of the NFT being bought
    @dev Emits a "SplitPayment" event
    */
    function _splitPayment(uint _itemId) internal {
        uint price = itemIdToItemData[_itemId].price;
        (address receiver, uint royaltyAmount) = itemIdToItemData[_itemId].nft.royaltyInfo(_itemId, price);
        //Pay royalties
        // (bool royaltySent,) = payable (receiver).call{value: royaltyAmount}("");
        bool royaltySent = payable (receiver).send(royaltyAmount);
        require(royaltySent, "Royaltiy payment failed");
        //Pay marketPlace fees
        uint marketplaceFee = (price * marketplaceFeePercentage) / 10000;
        bool feeSent = marketplaceOwnerAccount.send(marketplaceFee);
        // (bool feeSent,) = marketplaceOwnerAccount.call{value: marketplaceFee}("");
        require(feeSent, "Fee payment failed");
        //Pay seller
        // (bool paymentSent,) = payable (itemIdToItemData[_itemId].seller).call{value: (price - (royaltyAmount + marketplaceFee))}("");
        bool paymentSent = payable (itemIdToItemData[_itemId].seller).send(price - (royaltyAmount + marketplaceFee));
        require(paymentSent, "Payment failed");

        emit SplitPayment(
            uint64 (price - (royaltyAmount + marketplaceFee)),
            uint64 (royaltyAmount),
            uint64 (marketplaceFee),
            itemIdToItemData[_itemId].seller,
            receiver,
            marketplaceOwnerAccount
        );

        //        emit Price(price);
        //        emit RoyaltiesLog(receiver, royaltyAmount);
        //        emit PaymentResult(feeSent);
        //        emit MarketplaceFee((price * marketplaceFeePercentage) / 10000);
        //        emit PaymentResult(feeSent);
        //        emit seller(itemIdToItemData[_itemId].seller);
        //        emit sellerPrice(price - (royaltyAmount + marketplaceFee));
        //        emit PaymentResult(paymentSent);
    }

    // ****************************************TESTS****************************************
    // DELETE BEFORE PROD

    event RoyaltiesLog(address receiver, uint payment);
    event Price(uint price);
    event MarketplaceFee(uint price);
    event PaymentResult(bool result);
    event seller(address sdeller);
    event sellerPrice(uint price);

    function splitPaymentExternal(uint _itemId, NftCollection _nft) public {

        itemIdToItemData[_itemId] = MarketplaceItem(
            _itemId,
            1,
            20000,
            msg.sender,
            false,
            _nft
        );

        uint price = itemIdToItemData[_itemId].price;
        emit Price(price);
        (address receiver, uint royaltyAmount) = itemIdToItemData[_itemId].nft.royaltyInfo(_itemId, price);
        emit RoyaltiesLog(receiver, royaltyAmount);

        bool royaltySent = payable (receiver).send(royaltyAmount);
        emit PaymentResult(royaltySent);

        emit MarketplaceFee((price * marketplaceFeePercentage) / 10000);
        uint marketplaceFee = (price * marketplaceFeePercentage) / 10000;
        bool feeSent = marketplaceOwnerAccount.send(marketplaceFee);
        emit PaymentResult(feeSent);

        emit seller(itemIdToItemData[_itemId].seller);
        emit sellerPrice(price - (royaltyAmount + marketplaceFee));
        bool paymentSent = payable (itemIdToItemData[_itemId].seller).send(price - (royaltyAmount + marketplaceFee));
        emit PaymentResult(paymentSent);
    }
}