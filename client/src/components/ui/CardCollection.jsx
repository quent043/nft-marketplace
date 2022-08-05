import { useNavigate } from "react-router-dom";

const CardCollection = (props) => {
    const navigate = useNavigate();

    const handleGoTo = () => {
        navigate("/collections/" + props.goTo);
    };

    return(
        <div className="card--collection--background">
            <img src={props.nftImageUrl} className="card--nft--img"/>
            <button className="card--collection--btn" onClick={handleGoTo} >See Collection</button>
        </div>
    )
}

export default CardCollection;