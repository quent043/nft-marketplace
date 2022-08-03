import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import NftListTable from "./NftListTable";

const Collection = () => {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress } = useParams();
    const [collectionContract, setCollectionContract] = useState();
    const [collectionItems, setCollectionItems] = useState();

    const getCollectionContract = async () => {
        if(web3 && nftCollectionAbi) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };
    const getCollectionItems = async () => {
        if(collectionContract) {
            const nftList = [];
            const nftAmount = await collectionContract.methods.max_supply().call();
            for(let i = 1; i <= nftAmount; i++) {
                const querriedItems = await collectionContract.methods.tokenIdToNftData(i).call();
                nftList.push(querriedItems);
            }
            setCollectionItems(nftList);
        }
    }

    useEffect(() => {
        getCollectionContract();
        getCollectionItems();
    });
    
    return (
        <div className="container">{
            collectionItems && <NftListTable title="NFT List" items={collectionItems} />
        }
        </div>
    );
};


export default Collection;