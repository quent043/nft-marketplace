import React, {useEffect, useState} from 'react';
import useEth from "../contexts/EthContext/useEth";
import {Button} from "react-bootstrap";
import NftCollectionTable from "./NftCollectionTable";


const Dashboard = () => {
    const {state: { accounts, marketplaceContract, nftFactoryContract }} = useEth();
    const [loaded, setLoaded] = useState(false);
    const [collectionsDeployed, setCollectionsDeployed] = useState([]);

    const collectionTuple =  [
        ["Item1", "jbkbkb", "jbkbkb", 10, 50000],
        ["Item2", "jbkbkb", "jbkbkb", 10, 50000]
    ]

    const init = async () => {
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

    const deployCollection = async () => {
        console.log("init collection deployment", nftFactoryContract.methods)
        try {
            let response = await nftFactoryContract.methods.createNftCollection(owner(), 20, 2, collectionTuple).send({from: accounts[0]});
        } catch (err) {
            //TODO: Gérer les erreurs
            console.log("Error: ", err);
        }
    }

    const owner = async () => {
        return await nftFactoryContract.methods.owner().call({from: accounts[0]});
    }

    useEffect(() => {
        console.log("init")
        init();
        //TODO: Pas sur qu'on ait besoin de marketplaceContract en dépendance, à check
    }, [nftFactoryContract, marketplaceContract, accounts]);

    const listenToCollectionDeployedEvent = () => {
        nftFactoryContract.events.CollectionDeployed().on("data", async (event) => {
            const collections = [...collectionsDeployed, event.returnValues._contractAddress];
            setCollectionsDeployed(collections);
        });
    };

    const getDeployedCollectionsFromEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        }
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