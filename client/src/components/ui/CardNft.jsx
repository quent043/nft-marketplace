import { useNavigate } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";

const CardNft = (props) => {
    const navigate = useNavigate();
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();

    const handleGoTo = () => {
        navigate("/collections/" + props.goTo + "/" + props.nftId);
    };

    const handleGoToSell = () => {
        navigate("/sellnft/" + props.goTo + "/" + props.nftId);
    };

    const handleBuy = async () => {
        try {
            await marketplaceContract.methods.purchaseItem(props.itemCountId).send({from: accounts[0], value: props.price});
        } catch (error) {
            console.log(error);
        }
    };

    const handleMint = async () => {
        try {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, props.goTo);
            await NftContractInstance.methods.mintNft(props.nftId).send({from: accounts[0], value: props.price});
            props.callback();
        } catch (error) {
            console.log(error);
        }
    };


    return(
        <div className="card--nft--background">
            <img src={props.nftImageUrl} className="card--nft--img"/>
            <p className="card--nft--id">#{props.nftId} {props.price ? "- " + web3.utils.fromWei(props.price, 'ether') + " ETH": ""}</p>
            <button className="card--nft--btn" onClick={handleGoTo}>Info</button>
            {props.isProfilePage && <button className="card--nft--btn--sell" onClick={handleGoToSell}>Sell</button>}
            {props.itemCountId && <button className='card--nft--btn--sell' onClick={handleBuy}>Buy</button>}
            {props.notMint && <button className='card--nft--btn--sell' onClick={handleMint}>Mint</button>}
        </div>
    )
}

export default CardNft;