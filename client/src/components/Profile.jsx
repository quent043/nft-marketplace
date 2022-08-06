import React, { Fragment, useState, useEffect } from 'react';
import {useParams, useLocation, withRouter} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import NftCollectionTable from "./NftCollectionTable";

import ProfilBox from './ui/ProfilBox';
import CardNft from './ui/CardNft';
import CardCollection from './ui/CardCollection';

function Profile() {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi, nftFactoryContract }} = useEth();
    const { contractAddress, tokenAddress: tokenId } = useParams();
    const [collectionsCreated, setCollectionsCreated] = useState([]);
    const [tokenData, setTokenData] = useState();

    //TODO: On log: Récupérer les collections qui lui appartiennent
    //TODO: On log: Récupérer les nft qu'il a minté
    //TODO: On log: Récupérer les nft qu'il a acheté
    //TODO: On log: Check si un des nft mintés a été acheté et n'es plus à lui

    // tokenIdToNftData
    // const getCollectionContract = async () => {
    //     if(web3 && nftCollectionAbi) {
    //         console.log("Web3");
    //         const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
    //         setCollectionContract(NftContractInstance);
    //     }
    // };
    //
    // const getTokenInfo = async () => {
    //     if(collectionContract) {
    //         const tokenDetail = await collectionContract.methods.tokenIdToNftData(tokenId).call();
    //         setTokenData(tokenDetail);
    //         console.log("Token, Info: ", tokenDetail);
    //     }
    // }

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


    useEffect(() => {
        console.log("init Detail")
        init();
    }, [web3]);

    const init = async () => {
        // await getCollectionContract();
        // await getTokenInfo();
        getCreatedCollectionsFromEvents();
    };

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