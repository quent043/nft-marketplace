import React, {useEffect, useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import DashboardBoxWelcome from './ui/DashboardBoxWelcome';
import CardCollection from './ui/CardCollection';

const Dashboard = () => {
    const {state: { web3, nftFactoryContract, nftCollectionAbi }} = useEth();
    const [loaded, setLoaded] = useState(false);
    const [deployedCollections, setDeployedCollections] = useState([]);

    const init = async () => {
        try {
            setLoaded(false);
            if (nftFactoryContract) {
                await getDeployedCollectionsFromEvents();
                await listenToCollectionDeployedEvent();
                setLoaded(true);
            }
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    useEffect(() => {
        init();
    }, [nftFactoryContract]);


    const listenToCollectionDeployedEvent = async () => {
        nftFactoryContract.events.CollectionDeployed().on("data", async () => {
            await getDeployedCollectionsFromEvents();
        });
    };

    const getDeployedCollectionsFromEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        };
        let collectionsAddressAndImage = [];
        const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);

        for (const element of contractEvents) {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, element.returnValues._contractAddress);
            //Get image of first token of the collection to display
            const {linkToImage} = await NftContractInstance.methods.tokenIdToNftData(1).call();
            collectionsAddressAndImage.push({contractAddress: element.returnValues._contractAddress, nftImageUrl: linkToImage });
        }
        setDeployedCollections(collectionsAddressAndImage);
    }

    return ( loaded &&
        <>
            <DashboardBoxWelcome/>
            <div className='grid--card--nft'>
                {deployedCollections && deployedCollections.map((collection,i) => {
                    return(<CardCollection key={i} goTo={collection.contractAddress} nftImageUrl={collection.nftImageUrl} />)
                })};
            </div>
        </>
    );
};


export default Dashboard;