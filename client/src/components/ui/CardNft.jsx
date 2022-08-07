import { useNavigate } from "react-router-dom";

const CardNft = (props) => {
    const navigate = useNavigate();

    const handleGoTo = () => {
        navigate("/collections/" + props.goTo + "/" + props.nftId);
    };

    const handleGoToSell = () => {
        navigate("/sellnft/" + props.goTo + "/" + props.nftId);
    };

    return(
        <div className="card--nft--background">
            <img src={props.nftImageUrl} className="card--nft--img"/>
            <p className="card--nft--id">#{props.nftId} {props.price ? "- " + props.price + " ETH": ""}</p>
            <button className="card--nft--btn" onClick={handleGoTo}>See more</button>
            {props.isProfilePage && <button className="card--nft--btn--sell" onClick={handleGoToSell}>Sell</button>}
        </div>
    )
}

export default CardNft;