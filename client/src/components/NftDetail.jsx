import React, { Fragment, useState, useEffect } from 'react';
import {useParams, useLocation, withRouter} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import { useNavigate } from "react-router-dom";

function NftDetail() {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress, tokenAddress: tokenId } = useParams();
    const { pathname } = useLocation();
    const [collectionContract, setCollectionContract] = useState();
    const [tokenData, setTokenData] = useState();
    const navigate = useNavigate();

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
        <>
            <button className='nftdetail--goback' onClick={() => navigate("/collections/" + contractAddress)}>Back to Collection</button>
            <div className="nftdetail--box">
                <div>
                    <h2>Token #{tokenId}</h2>
                    <img src={tokenData.linkToImage}/>
                </div>
                <div className='nftdetail--box--infos'>
                    <h3>Informations</h3>
                    <p><b>Name</b> : {tokenData.name}</p>
                    <p><b>Description</b> : {tokenData.description}</p>
                    <p><b>Price</b> : {tokenData.price} wei</p>
                    <p><b>Royalties</b> : {(tokenData.royalties / 100)}% for creator</p>
                </div>
            </div>
        </>
    );
}

export default NftDetail;