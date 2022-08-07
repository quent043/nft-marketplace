import {useParams} from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import useEth from "../contexts/EthContext/useEth";


const SellNft = () => {

    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress } = useParams();
    const { tokenAddress } = useParams();
    const [collectionContract, setCollectionContract] = useState();
    const [nftData, setNftData] = useState();

    const inputPrice = useRef(null);

    const getCollectionContract = () => {
        if(web3 && nftCollectionAbi) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };

    const getCollectionItems = async () => {
        if(collectionContract) {
            console.log("collectionContract");
            const getNftData = await collectionContract.methods.tokenIdToNftData(tokenAddress).call();
            console.log(getNftData);
            setNftData(getNftData);
        }
    }

    useEffect(() => {
        getCollectionContract();
    }, [web3]);

    useEffect(() => {
        getCollectionItems();
    }, [collectionContract]);

    async function handleSell () {
        // Approve contract with marketplace address & token ID nft
        await collectionContract.methods.approve(marketplaceContract._address, tokenAddress).send({from: accounts[0]});
        // Put this item for sale
        await marketplaceContract.methods.putNftForSale(collectionContract._address,tokenAddress,web3.utils.toWei(inputPrice.current.value, 'ether')).send({from: accounts[0]});
    }

    return (
        <>
        <h2 className='sell--nft--title'>Send your NFT to the Marketplace <i>in One click.</i></h2>
        <div className='sell--nft--box'>
            <div>
                <p>Token Id #{tokenAddress}</p>
                <img src={nftData ? nftData.linkToImage : ""}/>
            </div>
            <div className='sell--nft--price--box'>
                <p>Price of your NFT ( ETH )</p>
                <input className='input--default sell--nft--input' ref={inputPrice} type='text'/>
                <button className='btn--sell--dark sell--nft--btn' onClick={handleSell}>Sell this Nft</button>
            </div>
        </div>
        </>
    )
}

export default SellNft;