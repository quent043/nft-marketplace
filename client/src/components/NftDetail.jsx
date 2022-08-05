import React, { Fragment, useState, useEffect } from 'react';
import {useParams, useLocation, withRouter} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";

function NftDetail() {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress, tokenAddress: tokenId } = useParams();
    const { pathname } = useLocation();
    const [collectionContract, setCollectionContract] = useState();
    const [tokenData, setTokenData] = useState();

    console.log("contract", contractAddress);
    console.log("Nft", tokenId);

    // tokenIdToNftData
    const getCollectionContract = async () => {
        if(web3 && nftCollectionAbi) {
            console.log("Web3");
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };

    const getTokenInfo = async () => {
        if(collectionContract) {
            const tokenDetail = await collectionContract.methods.tokenIdToNftData(tokenId).call();
            setTokenData(tokenDetail);
            console.log("Token, Info: ", tokenDetail);
        }
    }

    useEffect(() => {
        getCollectionContract();
    }, [web3]);

    useEffect(() => {
        getTokenInfo();
    }, [collectionContract]);


    return (
        tokenData &&
    <div className="container">
            <h2>Token {tokenId}</h2>
            <p>Description {tokenData.description}</p>
            <p>Image Url {tokenData.image}</p>
            <p>Name {tokenData.name}</p>
            <p>Price {tokenData.price}</p>
            <p>Royalties {tokenData.royalties}</p>
    </div>
    );
}

export default NftDetail;