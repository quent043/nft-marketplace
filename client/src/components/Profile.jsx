import React, { Fragment, useState, useEffect } from 'react';
import {useParams, useLocation, withRouter} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import NftCollectionTable from "./NftCollectionTable";

import ProfilBox from './ui/ProfilBox';
import CardNft from './ui/CardNft';
import CardCollection from './ui/CardCollection';

function Profile() {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi, nftFactoryContract, tokenOwnershipRegisterContract }} = useEth();
    const [collectionsCreated, setCollectionsCreated] = useState([]);
    const [tokenData, setTokenData] = useState();
    const [tokensPerCollection, setTokensPerCollection] = useState([]);

    //TODO: On log: Récupérer les collections qui lui appartiennent
    //TODO: On log: Récupérer les nft qu'il a minté
    //TODO: On log: Récupérer les nft qu'il a acheté
    //TODO: On log: Check si un des nft mintés a été acheté et n'es plus à lui

    const getCreatedCollectionsFromEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        };
        let createdCollections = [];
        const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);

        contractEvents.forEach(element => {
            if(element.returnValues._creatorAddress === accounts[0]){
                createdCollections.push(element.returnValues._contractAddress);
            }
        });
        setCollectionsCreated(createdCollections);
    }

    const getProfileData = async () => {
        if(tokenOwnershipRegisterContract && collectionsCreated) {
            let collectionToTokens = [];
            for(let collection of collectionsCreated) {
                const balance = await tokenOwnershipRegisterContract.methods.userToCollectionToBalance(accounts[0], collection).call();
                if(balance){
                    const tokenIds = [];
                    for(let i = 0; i < balance; i++) {
                        tokenIds.push(await tokenOwnershipRegisterContract.methods.userToCollectionToTokens(accounts[0], collection, i).call());
                    }
                    const collectionBalance = {[collection]: tokenIds};
                    collectionToTokens.push(collectionBalance);
                    console.log("Collection and their balances: ",collectionToTokens);
                }
            }
            setTokensPerCollection(collectionToTokens);
        }
    }

    useEffect(() => {
        console.log("Final : ", tokensPerCollection);
    }, [tokensPerCollection]);

    useEffect(() => {
        console.log("init Detail")
        getCreatedCollectionsFromEvents();
    }, [web3]);

    useEffect(() => {
        console.log("Get Profile Data")
        getProfileData();
    }, [tokenOwnershipRegisterContract, collectionsCreated]);


// Nombres fictif dans owned ( nombre de nft ) & collections 

    return (
        <>
        collectionsCreated &&
        <div className="container">
            <NftCollectionTable title="Created collections" items={collectionsCreated} />
            <NftCollectionTable title="Owned tokens" items={collectionsCreated} />
        </div>
        {web3 && <ProfilBox account={accounts[0]} owned={21} collections={9} imageUrl={"https://img.seadn.io/files/850f31ebd63659d457678f57b8dd6dea.png?fit=max&w=200"} />}
        <div className='grid--card--nft'>
            <CardNft nftImageUrl="https://img.seadn.io/files/850f31ebd63659d457678f57b8dd6dea.png?fit=max&w=300" nftId={12} price={1}/>
            <CardNft/>
            <CardNft/>
            <CardNft/>
            <CardNft goTo="0x48FA7222f103F7D31fDe9E017569f10750C40c22" nftId={1}/>
            <CardCollection goTo="0x48FA7222f103F7D31fDe9E017569f10750C40c22"/>
        </div>
        <div className='error--box'>
            <p>error here</p>
        </div>
        </>
    );
}

export default Profile;