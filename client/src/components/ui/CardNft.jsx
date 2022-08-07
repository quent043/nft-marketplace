import { useNavigate } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
const CardNft = ({goTo, nftId, itemCountId, buyCallback, price, mintCallback, nftImageUrl, isProfilePage, notMint}) => {
    const navigate = useNavigate();
    const {state: { web3, accounts, marketplaceContract, nftCollectionAbi }} = useEth();

    const handleGoTo = () => {
        navigate("/collections/" + goTo + "/" + nftId);
    };

    const handleGoToSell = () => {
        navigate("/sellnft/" + goTo + "/" + nftId);
    };

    const handleBuy = async () => {
        try {
            await marketplaceContract.methods.purchaseItem(itemCountId).send({from: accounts[0], value: price});
            buyCallback();
        } catch (error) {
            console.log(error);
        }
    };

    const handleMint = async () => {
        try {
            const NftContractInstance = new web3.eth.Contract(nftCollectionAbi, goTo);
            await NftContractInstance.methods.mintNft(nftId).send({from: accounts[0], value: price});
            mintCallback();
        } catch (error) {
            console.log(error);
        }
    };


    return(
        <div className="card--nft--background">
            <img src={nftImageUrl} className="card--nft--img"/>
            <p className="card--nft--id">#{nftId} {price ? "- " + web3.utils.fromWei(price, 'ether') + " ETH": ""}</p>
            <button className="card--nft--btn" onClick={handleGoTo}>Info</button>
            {isProfilePage && <button className="card--nft--btn--sell" onClick={handleGoToSell}>Sell</button>}
            {itemCountId && <button className='card--nft--btn--sell' onClick={handleBuy}>Buy</button>}
            {notMint && <button className='card--nft--btn--sell' onClick={handleMint}>Mint</button>}
        </div>
    )
}

export default CardNft;