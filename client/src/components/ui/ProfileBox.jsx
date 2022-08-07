const ProfileBox = ({imageUrl, account, owned, collections}) => {
    return(
        <div className='box--nft--profil'>
            <div>
                <img className='box--nft--profil--image' src={imageUrl}/>
            </div>
            <div className='box--nft--profil--info'>
                <p>User: {account}</p>
                <p>Owned tokens: {owned}</p>
                <p>Collections created: {collections}</p>
            </div>
            <div></div>
        </div>
    )
}

export default ProfileBox;