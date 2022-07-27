// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Royalties.sol";
import "./MetaVariables.sol";

contract SftCollection is ERC1155, Royalties, Ownable, MetaVariables {
    //TODO: Refactor pour faire payer le mint aux users
    //La ,Factory appèlera la fonction _setURI après la création du Contract --> Dans une fonction init() avec max supply etc.

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    Sft[] sftList;
    uint public maxPurchasePerBuyer;

    struct Sft {
        string name;
        string description;
        string image;
    }

    constructor() ERC1155("") {}

    //    struct collectionData {
    //        string memory _name;
    //        string calldata _description;
    //        string calldata _image;
    //        uint _amount;
    //        uint _royalties;
    //    }

    function init(address _creator, string calldata _uri, uint _maxPurchasePerBuyer, collectionData[] calldata sftFactoryInputData, uint _amountOfSeries) external onlyOwner {
        // for(uint i = 0; i < _amountOfSeries; i++) {
        //     mintSft(sftFactoryInputData[i]._name,
        //     sftFactoryInputData[i]._description,
        //     sftFactoryInputData[i]._image,
        //     sftFactoryInputData[i]._amount,
        //     sftFactoryInputData[i]._royalties
        //     );
        // }

        mintSft(sftFactoryInputData[0]._name,
            sftFactoryInputData[0]._description,
            sftFactoryInputData[0]._image,
            sftFactoryInputData[0]._amount,
            sftFactoryInputData[0]._royalties
        );


        _setURI(_uri);
        _setMaxPurchasePerBuyer(_maxPurchasePerBuyer);
        _transferOwnership(_creator);
    }

    function _setMaxPurchasePerBuyer(uint _amount) private onlyOwner {
        maxPurchasePerBuyer = _amount;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function mintSft(string memory _name, string calldata _description, string calldata _image, uint _amount, uint _royalties) public returns (uint){
        _tokenIds.increment();
        sftList.push(Sft(_name, _description, _image));
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, _amount, "");
        _setTokenRoyalty(newItemId, msg.sender, _royalties);

        return newItemId;
    }

}
