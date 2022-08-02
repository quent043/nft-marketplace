import React from 'react';
import { useState, useEffect } from 'react';
import useEth from "../contexts/EthContext/useEth";

import Button from 'react-bootstrap/Button';

const Dashboard = () => {
 

    const {state: { accounts, marketplaceContract, nftFactoryContract }} = useEth();
    const [loaded, setLoaded] = useState(false);



    const collectionTuple =  [
        ["jbkbkb", "jbkbkb", "jbkbkb", 10, 50000],
        ["jbkbkb", "jbkbkb", "jbkbkb", 10, 50000]
    ] 

        const init = async () => {
        try {
            setLoaded(false);
            if (nftFactoryContract) {
                listenToCollectionDeployedEvent();
            }
        } catch (err) {
            // toast.error("Error connecting to the blockchain")
        }
    }

    const deployCollection = async () => {
        console.log("init collection deployment", nftFactoryContract.methods)
        try {
            let response = await nftFactoryContract.methods.createNftCollection("uri", 20, 20, collectionTuple, 2).send({from: accounts[0]});
            console.log("Quentin - response: ", response);
        } catch (err) {
            console.log("Error: ", err);
        }
        // console.log("Quentin - events: ", nftFactoryContract.events);
    }

    const owner = async () => {
        let response = await nftFactoryContract.methods.owner().call({from: accounts[0]});
        console.log("Quentin - owner: ", response);
    }

    useEffect(() => {
        init();
    }, [nftFactoryContract, marketplaceContract, accounts]);

    const listenToCollectionDeployedEvent = () => {
        nftFactoryContract.events.CollectionDeployed().on("data", async (event) => {
            console.log("Collection event: ", event.returnValues._contractAddress);
        })
        nftFactoryContract.events.OwnershipTransferred().on("data", async (event) => {
            console.log("Collection event: ", event.returnValues);
        })
    };

    const getCollectionEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        }
        const contractEvents = await nftFactoryContract.getPastEvents("CollectionDeployed", options);
        console.log("PastEvents CollectionDeployed: ", contractEvents);
        const contractEvents2 = await nftFactoryContract.getPastEvents("OwnershipTransferred", options);
        console.log("PastEvents OwnershipTransferred: ", contractEvents2);
    }

    return (
        <div>
            <Button onClick={ ()=> { deployCollection() }}>Init Collection</Button>
            <Button onClick={ ()=> { owner() }}>Owner</Button>
            <Button onClick={ ()=> { getCollectionEvents() }}>Past Events</Button>
        </div>
    );
};


export default Dashboard;