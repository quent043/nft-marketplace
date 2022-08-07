// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

    /**
    @notice Contract gathering the NFT & SFT metavariables structure
    @dev To be extended by contractds using these metavariables
    */

contract MetaVariables {
    struct sftCollectionData {
        string name;
        string description;
        string image;
        uint minted;
        uint supply;
        uint royalties;
        uint price;
    }

    struct nftCollectionData {
        string linkToImage;
        string name;
        string description;
        uint price;
        uint royalties;
    }
}