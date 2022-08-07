import React, { Fragment, useState, useEffect } from 'react';
import { useParams, useLocation, withRouter } from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import CardNft from './ui/CardNft';

const Marketplace = () => {

    const { state: { web3, accounts, marketplaceContract, nftCollectionAbi } } = useEth();
    const { contractAddress, tokenAddress: tokenId } = useParams();
    const { pathname } = useLocation();


    useEffect(() => {
        getMarketplaceContractItems();
    }, [web3, nftCollectionAbi, marketplaceContract]);


    const [ItemData, setItemData] = useState();

    const [imageURL, setImageURL] = useState();
    const getMarketplaceContractItems = async () => {

        console.log("marketplaceContract", marketplaceContract);
        console.log("nftCollectionAbi", nftCollectionAbi);
        console.log("web3", web3);

        if (marketplaceContract && web3 && nftCollectionAbi) {
            //tableau des elements de la marketplace
            const marketplaceItems = [];
            const imagesUrl = [];
            //recupere le nombre de items count
            const itemCount = await marketplaceContract.methods.itemCount().call({ from: accounts[0] });

            console.log("itemCount", itemCount)

            for (let i = 1; i <= parseInt(itemCount, 10); i++) {
                console.log("boucle")
                const itemsDetail = await marketplaceContract.methods.itemIdToItemData(i).call();

                console.log("itemsDetail", itemsDetail)

                if (!itemsDetail[4]) {

                    const collection_addr = itemsDetail.nft;
                    console.log("collection_addr", collection_addr)
                    const collection_token_id = itemsDetail.tokenId;
                    const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, collection_addr);
                    const getNftData = await NftContractInstance.methods.tokenIdToNftData(collection_token_id).call();

                    imagesUrl.push(getNftData.linkToImage)
                    console.log(imagesUrl)
                    
                    marketplaceItems.push(itemsDetail);

                }

            };
            setImageURL(imagesUrl);
            setItemData(marketplaceItems);

        }
    }

    return (
        <>
            <Fragment>
            
         
                <h2 className='sell--nft--title'> Buy  Art <i>in One click.</i></h2>
                <div className="container">
         
                    {ItemData ?
                        (ItemData.map((item, index) => (
                            <div key={index} className="justify-content-center inline-flex">
                                <CardNft itemCountId={item.marketplaceItemId} marketplace nftId={item.tokenId}  price={item.price} nftImageUrl={imageURL[index]} />   
                            
                                </div>
                        )))
                        : null}
                    </div>
            </Fragment>

        </>
    );
}


export default Marketplace;