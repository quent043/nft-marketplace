const CardNftCreate = ({name, nftImage, tokenId, description, price, royalties}) => {
    return(
        <div className="card--nft--background--create">
            <img src={nftImage} className="card--nft--img"/>
            <p> Token Id: {tokenId}</p>
            <p> Name: {name}</p>
            <p> Description: {description}</p>
            <p> Price: {price}</p>
            <p> Royalties: {royalties}</p>
        </div>
    )
}

export default CardNftCreate;