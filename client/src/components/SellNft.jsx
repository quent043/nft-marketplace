import {useParams} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import useEth from "../contexts/EthContext/useEth";


const SellNft = () => {

    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress } = useParams();
    const { tokenAddress } = useParams();
    const [collectionContract, setCollectionContract] = useState();
    const [nftData, setNftData] = useState();

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
            // Mint du nft pour test au début sinon reste sert a rien
            await collectionContract.methods.mintNft(1).send({from: accounts[0], value: 500000});
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

    async function sellTest () {
        console.log(marketplaceContract);
        const rep = await marketplaceContract.methods.itemCount().call({from: accounts[0]});
        console.log(rep);
        const checkowner = await collectionContract.methods.ownerOf(1).call({from: accounts[0]});
        console.log(checkowner);
        // Approve le contract avec address marketplace & token ID nft
        await collectionContract.methods.approve(marketplaceContract._address, 1).send({from: accounts[0]});
        // Put for Sale
        await marketplaceContract.methods.putNftForSale(collectionContract._address,1,50000).send({from: accounts[0]});
        const rep2 = marketplaceContract.methods.itemCount().call({from: accounts[0]});
        console.log(rep2);
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
                <input className='input--default sell--nft--input' type='text'/>
                <button className='btn--sell--dark sell--nft--btn' onClick={sellTest}>Sell this Nft</button>
                <button onClick={async()=> {
                    await marketplaceContract.methods.purchaseItem(1).send({from: accounts[0], value: 500000});
                    const checkowner = await collectionContract.methods.ownerOf(1).call({from: accounts[0]});
                    console.log(checkowner);}}>aaa</button>
            </div>
        </div>
        </>
    )
}

export default SellNft;