// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

    /**
    @notice Contract gathering the NFT & SFT metavariables structure
    @dev To be extended by contractds using these metavariables
    */

contract MetaVariables {
    struct sftCollectionData {
        string _name;
        string _description;
        string _image;
        uint _minted;
        uint _supply;
        uint _royalties;
        uint _price;
    }

    struct nftCollectionData {
        string _name;
        string _description;
        string _image;
        uint _royalties;
        uint _price;
    }
}



// [
//     ["jbkbkb", "jbkbkb", "jbkbkb", 0, 2, 10, 50],
//     ["jbkbkb", "jbkbkb", "jbkbkb", 0, 2, 10, 50]
// ]
// #setUsers
// [
//   ["1","name"],
//   ["2",5678]
// ]
