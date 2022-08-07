import { useNavigate } from "react-router-dom";

const CardCollection = ({goTo, nftImageUrl}) => {
    const navigate = useNavigate();

    const handleGoTo = () => {
        navigate("/collections/" + goTo);
    };

    return(
        <div className="card--collection--background">
            <img src={nftImageUrl} className="card--nft--img"/>
            <button className="card--collection--btn" onClick={handleGoTo} >See Collection</button>
        </div>
    )
}

export default CardCollection;