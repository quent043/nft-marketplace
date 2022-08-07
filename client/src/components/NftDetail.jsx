import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import { useNavigate } from "react-router-dom";

function NftDetail() {
    const {state: { web3, nftCollectionAbi }} = useEth();
    const { contractAddress, tokenAddress: tokenId } = useParams();
    const [collectionContract, setCollectionContract] = useState();
    const [tokenData, setTokenData] = useState();
    const navigate = useNavigate();


    const getCollectionContract = async () => {
        if(web3 && nftCollectionAbi) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };

    const getTokenInfo = async () => {
        if(collectionContract) {
            const tokenDetail = await collectionContract.methods.tokenIdToNftData(tokenId).call();
            setTokenData(tokenDetail);
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