import { useNavigate } from "react-router-dom";

const DashboardBoxWelcome = () => {
    const navigate = useNavigate();

    const handleGoToProfile = () => {
        navigate("/profile");
    };

    const handleGoToCollection = () => {
        navigate("/collections");
    };

    return(
        <div className='box--dashboard--welcome'>
            <h1>NftTrade MarketPlace</h1>
            <p>Create, discover, sell NFT at the same place.</p>
            <button className='box--dashboard--welcome--btn' onClick={handleGoToCollection}>Discover Collection</button>
            <button className='box--dashboard--welcome--btn' onClick={handleGoToProfile}>My Profile</button>
        </div>
    )
}

export default DashboardBoxWelcome;