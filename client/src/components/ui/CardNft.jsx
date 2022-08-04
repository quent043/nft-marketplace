const CardNft = (props) => {
    return(
        <div className="card--nft--background">
            <img src={props.nftImageUrl} className="card--nft--img"/>
            <p className="card--nft--id">#{props.nftId} {props.price ? "- " + props.price + " ETH": ""}</p>
            <button className="card--nft--btn" >See more</button>
        </div>
    )
}

export default CardNft;