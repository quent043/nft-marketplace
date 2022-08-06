import React, {useEffect, useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import {Button} from "react-bootstrap";
import NftCollectionTable from "./NftCollectionTable";


const Dashboard = () => {
    const {state: { accounts, marketplaceContract, nftFactoryContract }} = useEth();
    const [loaded, setLoaded] = useState(false);
    const [collectionsDeployed, setCollectionsDeployed] = useState([]);

    const collectionTuple =
    [
        ["https://img.seadn.io/files/e1599f007c586ff7565b4657906b57ea.png?fit=max&w=200", "Item1", "jbkbkb", 50000, 1000],
        ["zertg", "Item2", "jbkbkb", 50000, 1000],
        ["serg", "Item3", "jbkbkb", 50000, 1000]
    ]

    const init = async () => {
        console.log(marketplaceContract)
        try {
            setLoaded(false);
            if (nftFactoryContract) {
                await getDeployedCollectionsFromEvents();
                listenToCollectionDeployedEvent();
                setLoaded(true);
            }
        } catch (err) {
            // toast.error("Error connecting to the blockchain")
        }
    }
    // function createNftCollection(string calldata collectionName, uint80 _max_mint_allowed, uint80 _max_supply, nftCollectionData[] calldata _nftFactoryInputData) external {

        const deployCollection = async () => {
        console.log("init collection deployment", nftFactoryContract.methods)
        try {
            await nftFactoryContract.methods.createNftCollection("CollectionName", 20, 3, collectionTuple).send({from: accounts[0]});
        } catch (err) {
            //TODO: Gérer les erreurs
            console.log("Error: ", err);
        }
    }

    const owner = async () => {
        return await nftFactoryContract.methods.owner().call({from: accounts[0]});
    }

    useEffect(() => {
        console.log("init Dashboard");
        init();
        //TODO: Pas sur qu'on ait besoin de marketplaceContract en dépendance, à check
    }, [nftFactoryContract, marketplaceContract, accounts]);

    //TODO: Ne marche pas, il renvoie le state vide je ne sais pas pourquoi

    // const listenToCollectionDeployedEvent = () => {
    //     let collections = [...collectionsDeployed];
    //     nftFactoryContract.events.CollectionDeployed().on("data", async (event) => {
    //         console.log("Deployed ", collections);
    //         const newCollection = event.returnValues._contractAddress;
    //         // collectionsDeployed.push(newCollection);
    //         collections = [...collectionsDeployed, newCollection];
    //         // console.log("After add ", collections);
    //         console.log("After add ", collections);
    //         setCollectionsDeployed(collections);
    //         // setCollectionsDeployed(collectionsDeployed);
    //     });
    // };

    const listenToCollectionDeployedEvent = async () => {
        nftFactoryContract.events.CollectionDeployed().on("data", async (event) => {
            await getDeployedCollectionsFromEvents();
        });
    };

    const getDeployedCollectionsFromEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        };
        let deployedCollections = [];
        const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);

        contractEvents.forEach(element => {
            deployedCollections.push(element.returnValues._contractAddress);
        });
        setCollectionsDeployed(deployedCollections);
    }

    return ( loaded &&
        <div className="container">
            <Button onClick={ ()=> { deployCollection() }}>Init Collection</Button>
            <NftCollectionTable title={"Deployed Collections"} items={collectionsDeployed} />
        </div>
    );
};


export default Dashboard;