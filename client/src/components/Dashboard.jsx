import React, {useState, useEffect} from 'react';
import useEth from "../contexts/EthContext/useEth";
import {Button} from "react-bootstrap";


const Dashboard = () => {
    const {state: { accounts, marketplaceContract, nftFactoryContract }} = useEth();
    const result = useEth();
    console.log("result ",result)
    const [loaded, setLoaded] = useState(false);

    const collectionTuple =  [
        ["jbkbkb", "jbkbkb", "jbkbkb", 10, 50],
        ["jbkbkb", "jbkbkb", "jbkbkb", 10, 50]
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
        console.log("init collection deployment")
        let response = await nftFactoryContract.methods.createNftCollection("uri", 20, 20, collectionTuple, 2).call({from: accounts[0]});
        console.log("Quentin - response: ", response);
        console.log("Quentin - events: ", nftFactoryContract.events);
    }

    const owner = async () => {
        let response = await nftFactoryContract.methods.owner().call({from: accounts[0]});
        console.log("Quentin - response: ", response);
    }

    useEffect(() => {
        init();
    }, [nftFactoryContract, marketplaceContract, accounts]);

    const listenToCollectionDeployedEvent = () => {
        nftFactoryContract.events.CollectionDeployed().on("data", async (event) => {
            console.log("Collection event: ", event.returnValues);
        })
    };

    return (
        <div>
            <Button onClick={ ()=> { deployCollection() }}>Init Collection</Button>
            <Button onClick={ ()=> { owner() }}>Owner</Button>
        </div>
    );
};


export default Dashboard;