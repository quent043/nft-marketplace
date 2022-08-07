import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import CardNft from "./ui/CardNft";
import CardCollection from "./ui/CardCollection";
import { useLocation } from "react-router-dom";

const Collection = () => {
    const {state: { web3, nftCollectionAbi, nftFactoryContract }} = useEth();
    const { contractAddress } = useParams();
    const [deployedCollections, setDeployedCollections] = useState([]);
    const [collectionItems, setCollectionItems] = useState();
    const location = useLocation();


    const getCollectionItemsFromUrlParam = async () => {
        if(web3 && nftCollectionAbi) {
            console.log("good")
            let options = {
                fromBlock: 0,
                toBlock: "latest"
            }
            const nftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            const nftList = [];
            const nftAmount = await nftContractInstance.methods.max_supply().call();
            const mintedTokensEvent = await nftContractInstance.getPastEvents("TokenMinted", options);
            let mintedTokenIds = [];
            mintedTokensEvent.forEach(element => {
                mintedTokenIds.push(parseInt(element.returnValues._tokenId));
            });

            for(let i = 1; i <= nftAmount; i++) {
                let notMint = true;
                const querriedItems = await nftContractInstance.methods.tokenIdToNftData(i).call();
                if(mintedTokenIds.includes(i)){
                    notMint = false;
                }
                nftList.push({tokenId: i, contractAddress, notMint, ...querriedItems});
            }
            setCollectionItems(nftList);
        }
    };

    const getDeployedCollectionsFromEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        };
        let collectionsAddressAndImage = [];
        const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);

        for (const element of contractEvents) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, element.returnValues._contractAddress);
            //Get image of first token of the collection to display
            const {linkToImage} = await NftContractInstance.methods.tokenIdToNftData(1).call();
            collectionsAddressAndImage.push({contractAddress: element.returnValues._contractAddress, nftImageUrl: linkToImage });
        }
        setDeployedCollections(collectionsAddressAndImage);
    }

    useEffect(() => {
        contractAddress ? getCollectionItemsFromUrlParam() : getDeployedCollectionsFromEvents();
    }, [web3]);

    useEffect(() => {
        //Update data for each URL change
        console.log("location")
        contractAddress ? getCollectionItemsFromUrlParam() : getDeployedCollectionsFromEvents();
    }, [location]);

    return (
        <>
            <div className="grid--card--nft">{
                (deployedCollections && !contractAddress) && deployedCollections.map((collection, i) => (
                    <CardCollection key={i} goTo={collection.contractAddress} nftImageUrl={collection.nftImageUrl} />
                ))
            }
            </div>
            <div className="grid--card--nft">{
                (collectionItems && contractAddress) && collectionItems.map((item) => (
                    <CardNft title="NFT List" nftImageUrl={item.linkToImage} nftId={item.tokenId} price={item.price} goTo={item.contractAddress} notMint={item.notMint} />
                ))
            }
            </div>
        </>
    );
};


export default Collection;