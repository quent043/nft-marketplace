import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import CardNft from "./ui/CardNft";

const Collection = () => {
    const {state: { web3, nftCollectionAbi }} = useEth();
    const { contractAddress } = useParams();
    const [collectionContract, setCollectionContract] = useState();
    const [collectionItems, setCollectionItems] = useState();


    const getCollectionContract = () => {
        if(web3 && nftCollectionAbi) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };

    const getCollectionItems = async () => {
        if(collectionContract && contractAddress) {
            const nftList = [];
            const nftAmount = await collectionContract.methods.max_supply().call();
            for(let i = 1; i <= nftAmount; i++) {
                const querriedItems = await collectionContract.methods.tokenIdToNftData(i).call();
                //Add token id
                nftList.push({tokenId: i, contractAddress, ...querriedItems});
            }
            console.log(nftList);
            setCollectionItems(nftList);
        }
    }

    useEffect(() => {
        getCollectionContract();
    }, [web3]);

    useEffect(() => {
        getCollectionItems();
        console.log("contract ", contractAddress)
    }, [collectionContract]);

    return (
        <div className="grid--card--nft">{
            (collectionItems && contractAddress) && collectionItems.map((item) => (
                <CardNft title="NFT List" nftImageUrl={item.linkToImage} nftId={item.tokenId} price={item.price} goTo={item.contractAddress} />
            ))
        }
        </div>
    );
};


export default Collection;