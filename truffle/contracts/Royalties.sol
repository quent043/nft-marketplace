// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

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
        uint96 amount;
    }

    mapping(uint256 => RoyaltyInfo) internal _royalties;

    /**
    @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return _interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(_interfaceId);
    }

    /**
    @notice Function used to set the amount of royalties to be sent to who and for which NFT
    @param _tokenId the id of the concerned NFT
    @param _recipient the address which will receive the royalties
    @param _value the rate of royalties to be paid per ten thousand
    */
    function _setTokenRoyalty(uint256 _tokenId, address _recipient, uint256 _value) internal {
        require(_value <= 10000, 'ERC2981Royalties: Too high');
        _royalties[_tokenId] = RoyaltyInfo(_recipient, uint96(_value));
    }

    /**
    @notice Function used to set the amount of royalties to be sent to who and for which NFT
    @param _tokenId the id of the concerned NFT
    @param _NFTPrice the sale price of the NFT
    @return receiver royaltyAmount | Returns the address of the royalty receiver "receiver"  & the amount to be received "royaltyAmount"
    */
    function royaltyInfo(uint256 _tokenId, uint256 _NFTPrice) external view override returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[_tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (_NFTPrice * royalties.amount) / 10000;
    }
}