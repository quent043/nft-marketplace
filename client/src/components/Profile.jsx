import React, { useState, useEffect } from 'react';
import useEth from "../contexts/EthContext/useEth";
import ProfileBox from './ui/ProfileBox';
import CardNft from './ui/CardNft';


function Profile() {
    const {state: { web3, accounts, nftFactoryContract, nftCollectionAbi, tokenOwnershipRegisterContract }} = useEth();
    const [createdCollections, setCreatedCollections] = useState([]);
    const [allCollections, setAllCollections] = useState([]);
    const [tokensPerCollection, setTokensPerCollection] = useState([]);
    const [tokenData, setTokenData] = useState();
    const [tokenBalance, setTokenBalance] = useState();


    const getCreatedCollectionsFromEvents = async () => {
        if(web3){
            let options = {
                fromBlock: 0,
                toBlock: "latest"
            };
            let createdCollections = [];
            let allCollections = [];
            const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);

            contractEvents.forEach(element => {
                if(element.returnValues._creatorAddress === accounts[0]){
                    createdCollections.push(element.returnValues._contractAddress);
                }
                allCollections.push(element.returnValues._contractAddress);
            });
            setCreatedCollections(createdCollections);
            setAllCollections(allCollections);
        }
    }

    const getProfileData = async () => {
        if(tokenOwnershipRegisterContract && allCollections) {
            let collectionToTokens = [];
            for(let collection of allCollections) {
                const balance = await tokenOwnershipRegisterContract.methods.userToCollectionToBalance(accounts[0], collection).call();
                if(parseInt(balance)){
                    const tokenIds = [];
                    let collectionBalance = [];
                    for(let i = 0; i < balance; i++) {
                        tokenIds.push(await tokenOwnershipRegisterContract.methods.userToCollectionToTokens(accounts[0], collection, i).call());
                        collectionBalance = {[collection]: tokenIds};
                    }
                    collectionToTokens.push(collectionBalance);
                }
            }
            setTokensPerCollection(collectionToTokens);
        }
    }

    const getTokenInfo = async () => {
        if(web3 && nftCollectionAbi && tokensPerCollection) {
            let tokenDetails = [];
            for(let collectionData of tokensPerCollection) {
                //Get contract instance
                const collectionAddress = Object.keys(collectionData)[0];
                const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, collectionAddress);
                const tokenIds = Object.values(collectionData)[0];
                //Get contract owned tokens details
                for( let tokenId of tokenIds ) {
                    const tokenDetail = await NftContractInstance.methods.tokenIdToNftData(tokenId).call();
                    console.log("Token Data: ", tokenDetails);
                    const tokenDetailFormatted = {tokenId, collectionAddress, ...tokenDetail};
                    tokenDetails.push(tokenDetailFormatted);
                }
            }
            // console.log("Token Data: ", tokenDetails);
            setTokenData(tokenDetails);
        }
    }

    const getOwnedTokenNumber = () => {
        let tokenBalance = 0;
        tokensPerCollection.forEach(collection => {
            tokenBalance += Object.values(collection)[0].length;
        });
        setTokenBalance(tokenBalance);
    }

    useEffect(() => {
        getCreatedCollectionsFromEvents();
    }, [web3]);

    useEffect(() => {
        getProfileData();
    }, [allCollections]);

    useEffect(() => {
        getTokenInfo();
    }, [tokensPerCollection]);

    useEffect(() => {
        getOwnedTokenNumber();
    }, [tokenData]);


    return (
        <>
            {(web3 && tokenBalance) &&
                <ProfileBox account={accounts[0]}
                            owned={tokenBalance}
                            collections={createdCollections.length}
                            imageUrl={tokenData[0].linkToImage} />}
            {tokenData &&
                <div className='grid--card--nft'>
                    {tokenData.map((tokenInfo) => (
                            <CardNft nftImageUrl={tokenInfo.linkToImage}
                                     nftId={tokenInfo.tokenId}
                                     price={tokenInfo.price}
                                     goTo={tokenInfo.collectionAddress}
                                     isProfilePage={true}/>
                        )
                    )}
                </div>}
            {/*<div className='error--box'>*/}
            {/*    <p>error here</p>*/}
            {/*</div>*/}
        </>
    );
}

export default Profile;