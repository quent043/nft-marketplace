const CardNftCreate = (props) => {
    return(
        <div className="card--nft--background--create">
            <img src={props.nftImage} className="card--nft--img"/>
            <p> Token Id: {props.tokenId}</p>
            <p> Name: {props.name}</p>
            <p> Description: {props.description}</p>
            <p> Price: {props.price}</p>
            <p> Royalties: {props.royalties}</p>
        </div>
    )
}

export default CardNftCreate;