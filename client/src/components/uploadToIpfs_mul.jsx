
export default Marketplace;
 
 
import React, { useEffect, useRef, useState } from 'react'
import { FolderUpload } from 'react-ipfs-uploader'
import { create } from "ipfs-http-client";
import { Button } from 'react-bootstrap';
import useEth from "../contexts/EthContext/useEth";
import { Alert } from 'react-bootstrap';
const client = create("https://ipfs.infura.io:5001/api/v0");
 
 
const UploadMultiple = () => {
    const { state: { accounts, nftFactoryContract } } = useEth();
    const [folderUrl, setFolderUrl] = useState('');
    const formData = useRef();
    const counterRef = useRef(0);
    const [submitted, setSubmitted] = useState([]);
    const [smartContratInput, setsmartContratInput] = useState([]);
    const NameCollection = useRef();
    const RoyaltieCollection = useRef({ ColRoyalties: 0 });
    const maxmint = useRef("1");
    const maxsupply = useRef(0);
    const [ColProps, setColProps] = useState({ collectionName: "null", colRoyalties: 0, maxsupply: 0, MaxMintAllowed: 1 })
    const [page, setpage] = useState(false);
    let counter;
    const [files, setFiles] = useState("");
 
    const handleSubmit = event => {
        event.preventDefault();
        //increase en currentRef
        counterRef.current += 1;
 
        //get the first input element from the form
        const formInputs = [...formData.current.elements].filter(
            element => (element.type === "text" || element.type === "number"));
        //combine the value of the last input with the newcounter ref
        const newSubmitted = formInputs.reduce(
            (acc, input) => {
                return {
                    ...acc,
                    [input.name]: input.value,
                };
            },
            {
                linkNFT: folderUrl + "/" + counterRef.current + files
            }
        );
 
        setSubmitted(prevSubmitted => [...prevSubmitted, newSubmitted]);
        //converted to the object to tuple to input smartcontrat
 
        const result = Object.keys(newSubmitted).map((key, i) => (i == 3 ? parseInt(newSubmitted[key], 10) : newSubmitted[key]));
        const resulttoInt = Object.keys(result).map((key, i) => (i == 4 ? parseInt(result[key], 10) : result[key]));
 
        setsmartContratInput(prevSubmitted => [...prevSubmitted, resulttoInt])
 
        console.log(maxsupply)
        console.log(counterRef.current)
 
    }
 
    const collectionPropsHandler = function (e) {
        e.preventDefault();
        setColProps({
            collectionName: NameCollection.current.value,
            colRoyalties: RoyaltieCollection.current.value,
            maxsupply: maxsupply.current.value,
            MaxMintAllowed: maxmint.current.value
        })
 
        setpage(true);
    }
 
    /**
     * Mint of the token once recorded on state
         * @string calldata _uri => folderUrl
         * @uint80 _max_supply => ColProps.maxsupply
         * @uint80 _max_mint_allowed => ColProps.MaxMintAllowed
         * @nftCollectionData calldata _nftFactoryInputData => smartContratInput
         * @function createNftCollection()
         * */
 
    const _createNftCollection = async function () {
        const _maxmint = parseInt(ColProps.MaxMintAllowed, 10);
        const _maxsupp = parseInt(ColProps.maxsupply, 10);
        const _namecoll = ColProps.collectionName;
 
        try {
            /**
             * @parameters string calldata _uri, uint80 _max_mint_allowed, uint80 _max_supply, nftCollectionData[] calldata _nftFactoryInputData
            */
            let response = await nftFactoryContract.methods.createNftCollection(_namecoll, _maxmint, _maxsupp, smartContratInput).send({ from: accounts[0] });
 
        } catch (err) {
            //TODO: Gérer les erreurs
            console.log("Error: ", err);
        }
    }
 
    return (
 
        <>
 
<h2 className='sell--nft--title'> Upload your file to decentralized storage  <i> IPFS</i></h2>
            <div className="sell--nft--box">
                <div className="sell--nft--price--box"> 
                <FolderUpload setUrl={setFolderUrl} />
 
                <form className="container mt-4 form-control" onSubmit={collectionPropsHandler}>
                    <div className="form-group bg-light">
                        <label htmlFor="name-input">Collection Name</label>
                        <input type="text" ref={NameCollection} className="form-control" id="collection_name-input" name="collectionname" placeholder="collection name" required />
                        <small id="nameHelp" className="form-text text-muted">Give a nice name to your collection!</small>
                    </div>
 
                    <div className="form-group bg-light">
                        <label htmlFor="name-input">Max supply</label>
                        <input type="number" ref={maxsupply} className="form-control" id="maxsupply-input" name="maxsupply" placeholder="maxsupply" required />
                        <small id="nameHelp" className="form-text text-muted">Give the maxsupply % for your collection!</small>
                    </div>
                    <div className="form-group bg-light">
                        <label htmlFor="name-input">Max Mint allowed per user</label>
                        <input type="number" ref={maxmint} className="form-control" id="maxmint-input" name="maxmint" placeholder="maxmint per user" required />
                        <small id="nameHelp" className="form-text text-muted">Give the maxsupply % for your collection!</small>
                    </div>
                    <div className="form-group bg-light">
                        <Button onClick={() => setFiles('.jpeg')} variant="outline-success">jpeg</Button>{' '}
                        <Button onClick={() => setFiles('.jpg')} variant="outline-warning">jpg</Button>{' '}
                        <Button onClick={() => setFiles('.png')} variant="outline-danger">png</Button>{' '}
                        <Button onClick={() => setFiles('.gif')} variant="outline-info">gif</Button>{' '}
                        <small id="nameHelp" className="form-text text-muted">Give the maxsupply % for your collection!</small>
                    </div>
                    <button type="submit" className="btn btn-primary">SUBMIT</button>
                </form>
 
 
                {page === true ? <form ref={formData} className="form-control" onSubmit={handleSubmit}>
 
                    <div className="form-group">
                        <label htmlFor="name-input">NFT's Name</label>
                        <input type="text" className="form-control" id="name-input" name="name" placeholder="name" required />
                        <small id="nameHelp" className="form-text text-muted">Give a nice name to your NFT!</small>
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="description-input">Description</label>
                        <input type="text" className="form-control" id="description-input" name="description" placeholder="description" required />
                        <small id="nameHelp" className="form-text text-muted">Add an attractive description!</small>
                    </div>
 
                    <div className="form-group">
                        <label htmlFor="price-input">Price (ETH)</label>
                        <input type="number" className="form-control" id="price-input" name="price" placeholder="price" required />
                        <small id="nameHelp" className="form-text text-muted">Tell us how much it worth!</small>
                    </div>
                    <div className="form-group bg-light">
                        <label htmlFor="name-input">Royalties %</label>
                        <input type="number" className="form-control" id="royalties-input" name="royalties" placeholder="collection royalties" required />
                        <small id="nameHelp" className="form-text text-muted">Give the royalties % for your collection!</small>
                    </div>
 
                    <div className="btn-group">
                        {ColProps.maxsupply == counterRef.current ? <button type="submit" className="card--nft--btn" onClick={() => { _createNftCollection() }}> Create NFT Collection </button> : <button className="card--nft--btn" type="submit" >SUBMIT</button>}
                    </div>
                </form>
 
                    : null}
            </div>
            </div>
 
        <div className="container">
 
        {submitted.map((input, i) => (
                <div className="card--nft--background inline-flex">
                <img className="card--nft--img" src={input.linkNFT} />
                    <h5 className="card-title">{ColProps.collectionName}</h5>
                    <ul key={`index${i}`} className="list-group">
                        <li className="list-group-item" >TokenId: {i+1}</li>
                        <li className="list-group-item">Name: {input.name} </li>
                        <li className="list-group-item">Description: {input.description}</li>
                        <li className="list-group-item">Price: {input.price} </li>
                        <li className="list-group-item">Royalties: {input.royalties}</li>
                    </ul>
                </div>   
        ))}
    </div>
 
        </>
    )
}
 
export default UploadMultiple;