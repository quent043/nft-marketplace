import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifacts) => {
      if (artifacts.length !== 0) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const marketplaceAbi = artifacts[0].abi;
        const nftFactoryAbi = artifacts[1].abi;
        const nftCollectionAbi = artifacts[2].abi;
        let marketplaceAddress, marketplaceContract, nftFactoryAddress, nftFactoryContract;
        try {
          marketplaceAddress = artifacts[0].networks[networkID].address;
          marketplaceContract = new web3.eth.Contract(marketplaceAbi, marketplaceAddress);
          nftFactoryAddress = artifacts[1].networks[networkID].address;
          nftFactoryContract = new web3.eth.Contract(nftFactoryAbi, nftFactoryAddress);
        } catch (err) {
          console.error(err);
        }

        dispatch({
          type: actions.init,
          data: { artifacts, web3, accounts, networkID, marketplaceContract, nftFactoryContract, nftCollectionAbi }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const marketplaceArtifact = require("../../contracts/Marketplace.json");
        const nftFactoryArtifact = require("../../contracts/NftFactory.json");
        const nftCollectionArtifact = require("../../contracts/NftCollection.json");
        const artifacts = [marketplaceArtifact, nftFactoryArtifact, nftCollectionArtifact];
        init(artifacts);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifacts);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifacts]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
