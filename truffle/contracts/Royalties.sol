// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

    /**
    @notice Royalty contract extension respecting the IERC2981Royalties standard
    */
interface IERC2981Royalties {
    function royaltyInfo(uint256 _tokenId, uint256 _value) external view  returns (address _receiver, uint256 _royaltyAmount);
}

contract Royalties is IERC2981Royalties, ERC165 {
    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }

    mapping(uint256 => RoyaltyInfo) internal _royalties;

    /**
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
    @notice Function used to set the amount of royalties to be sent to who and for which NFT
    @param tokenId the id of the concerned NFT
    @param recipient the address which will receive the royalties
    @param value the rate of royalties to be paid per ten thousand
    */
    function _setTokenRoyalty(uint256 tokenId, address recipient, uint256 value) internal {
        require(value <= 10000, 'ERC2981Royalties: Too high');
        _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
    }

    /**
    @notice Function used to set the amount of royalties to be sent to who and for which NFT
    @param tokenId the id of the concerned NFT
    @param NFTPrice the sale price of the NFT
    @return Returns the address of the royalty receiver & the amount to be received
    */
    function royaltyInfo(uint256 tokenId, uint256 NFTPrice) external view override returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (NFTPrice * royalties.amount) / 10000;
    }
}