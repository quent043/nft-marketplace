import React, { useEffect, useRef, useState } from 'react'
import { FolderUpload } from 'react-ipfs-uploader'
import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");


const UploadMultiple = () => {

    //push metadata to ipfs
    //recover images and urllink
    //display contrat collections
    //faire les composant de la pages de création d'un NFT
    //input (description, metadata ect..)
    //ajouter un ramdom via chainlink

    //folder URL
    const [folderUrl, setFolderUrl] = useState('');

    const formData = useRef();
    const counterRef = useRef(0);
    const [submitted, setSubmitted] = useState([]);
    const [smartContratInput, setsmartContratInput] = useState([]);

    //ajouter lien du folder + tokenId + typefichier
    //ajouter la fonction de mint
    // ajouter un button de request ramdoness

    const handleSubmit = event => {
        event.preventDefault();
        //increase en currentRef
        counterRef.current += 1;

        //get the first input element from the form
        const formInputs = [...formData.current.elements].filter(
            element => element.type === "text" || "number"
        );
        //combine the value of the last input with the newcounter ref
        const newSubmitted = formInputs.reduce(
            (acc, input) => {
                return {
                    ...acc,
                    [input.name]: input.value
                };
            },
            { number: counterRef.current }
        );

        //set the NFT value for card
        setSubmitted(prevSubmitted => [...prevSubmitted, newSubmitted]);

        //converted to the object to tuple to input smartcontrat
        const result = Object.keys(newSubmitted).map((key) => newSubmitted[key]);
        setsmartContratInput(prevSubmitted => [...prevSubmitted, result])
    }

    return (
        <>
            {JSON.stringify(smartContratInput)}
            <div className="container card-light">

                <div className="main">

                    <FolderUpload setUrl={setFolderUrl} />
                    URL of the folder on IPSF : <a
                        href={folderUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {folderUrl}
                    </a>

                    <form ref={formData} className="container mt-4 form-control" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name-input">NFT's Name</label>
                            <input type="text" className="form-control" id="name-input" name="name" placeholder="name" required />
                            <small id="nameHelp" className="form-text text-muted">Give a nice name to your NFT!</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description-input">Description</label>
                            <textarea type="text" className="form-control" id="description-input" name="description" placeholder="description" />
                            <small id="nameHelp" className="form-text text-muted">Add an attractive description!</small>
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="inputGroupSelect01">Options files types</label>
                            </div>
                    
                        </div>
                        <div className="form-group">
                            <label htmlFor="price-input">Price (ETH)</label>
                            <input type="number" className="form-control" id="price-input" name="price" placeholder="price" />
                            <small id="nameHelp" className="form-text text-muted">Tell us how much it worth!</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="royalties-input">Royalties (%)</label>
                            <input type="number" className="form-control" id="royalties-input" name="royalties" placeholder="royalties in %" />
                            <small id="nameHelp" className="form-text text-muted">Tell us how much you want to be pay each sell!</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image-input">Image </label>
                            <input type="text" value={folderUrl} className="form-control" id="image-input" name="image" placeholder="image URL" disabled />
                        </div>
                        <button type="submit" className="btn btn-primary">SUBMIT</button>
                    </form>
                    <div>
                        <h3 id="list-title">Registered NFT</h3>

                        <ol aria-labelledby="list-title">
                            {submitted.map((input, i) => (
                                <div className="card">

                                    <div className="card-body">
                                        <h5 className="card-title">Card title</h5>
                                        <li key={`index${i}`}>
                                            <ul>
                                                <li>TokenId: {input.number}</li>
                                                <li>name: {input.name} </li>
                                                <li>description: {input.description}</li>
                                                <li>price: {input.price} </li>
                                                <li>royalties: {input.royalties}</li>
                                                <img className="img-fluid" src={input.image + "/" + input.number + ".png"} alt="Card image cap" />
                                                <li>Link NFT: {input.image}/{input.number}.png</li>
                                            </ul>
                                        </li>
                                        <a href="#" className="btn btn-secondary">Check it out</a>
                                    </div>
                                </div>
                            ))}

                        </ol>
                    </div>
                </div>
            </div>
        </>

    )
}

export default UploadMultiple;