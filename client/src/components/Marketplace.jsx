import React, { Fragment, useState, useEffect } from 'react';
import useEth from "../contexts/EthContext/useEth";
import CardNft from './ui/CardNft';

const Marketplace = () => {
    const { state: { web3, accounts, marketplaceContract, nftCollectionAbi } } = useEth();
    const [itemData, setItemData] = useState();
    const [imageURL, setImageURL] = useState();



    useEffect(() => {
        getMarketplaceContractItems();
    }, [web3, nftCollectionAbi, marketplaceContract]);

    const getMarketplaceContractItems = async () => {
        if (marketplaceContract && web3 && nftCollectionAbi) {
            //Marketplace items array
            const marketplaceItems = [];
            const imagesUrl = [];
            //Get the amount of Marketplace items
            const itemCount = await marketplaceContract.methods.itemCount().call({ from: accounts[0] });

            for (let i = 1; i <= parseInt(itemCount, 10); i++) {
                const itemsDetail = await marketplaceContract.methods.itemIdToItemData(i).call();
                if (!itemsDetail[4]) {
                    const collectionAddress = itemsDetail.nft;
                    const tokenId = itemsDetail.tokenId;
                    const nftContractInstance = new web3.eth.Contract(nftCollectionAbi, collectionAddress);
                    const getNftData = await nftContractInstance.methods.tokenIdToNftData(tokenId).call();

                    imagesUrl.push(getNftData.linkToImage)
                    marketplaceItems.push(itemsDetail);
                }
            }
            setImageURL(imagesUrl);
            setItemData(marketplaceItems);
        }
    }

    return (
        <>
            <Fragment>
                <h2 className='sell--nft--title'> Buy  Art <i>in One click.</i></h2>
                <div className="grid--card--nft">
                    {itemData ?
                        (itemData.map((item, index) => (
                            <div key={index} className="justify-content-center inline-flex">
                                <CardNft itemCountId={item.marketplaceItemId} marketplace nftId={item.tokenId} price={item.price} nftImageUrl={imageURL[index]} goTo={item.nft} buyCallback={getMarketplaceContractItems} />
                            </div>
                        )))
                        : null}
                </div>
            </Fragment>
        </>
    );
}


export default Marketplace;