import React, { useState, useEffect } from 'react';
import {useParams, useLocation, withRouter} from 'react-router-dom';
import useEth from "../contexts/EthContext/useEth";
import NftListTable from "./NftListTable";

const Collection = () => {
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();
    const { contractAddress } = useParams();
    const { pathname } = useLocation();
    const [collectionContract, setCollectionContract] = useState();
    const [collectionItems, setCollectionItems] = useState();


    const getCollectionContract = async () => {
        if(web3 && nftCollectionAbi) {
            // console.log("Web3");a
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, contractAddress);
            setCollectionContract(NftContractInstance);
        }
    };

    const getCollectionItems = async () => {
        if(collectionContract) {
            // console.log("collectionContract");
            const nftList = [];
            const nftAmount = await collectionContract.methods.max_supply().call();
            for(let i = 1; i <= nftAmount; i++) {
                const querriedItems = await collectionContract.methods.tokenIdToNftData(i).call();
                //Add token id
                nftList.push(querriedItems);
            }
            setCollectionItems(nftList);
        }
    }

    useEffect(() => {
        // console.log("init Collection")
        init();
    }, [web3]);

    const init = async () => {
        await getCollectionContract();
        await getCollectionItems();
    };
    // Ca trigger comme ça mais problème de boucle infinie car on setState dans init
    // useEffect(() => {
    //     init();
    // });

    return (
        <div className="container">{
            collectionItems && <NftListTable title="NFT List" items={collectionItems} path={pathname} />
        }
        </div>
    );
};


export default Collection;