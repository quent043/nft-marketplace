const ProfileBox = (props) => {
    return(
        <div className='box--nft--profil'>
            <div>
                <img className='box--nft--profil--image' src={props.imageUrl}/>
            </div>
            <div className='box--nft--profil--info'>
                <p>User: {props.account}</p>
                <p>Owned tokens: {props.owned}</p>
                <p>Collections created: {props.collections}</p>
            </div>
            <div></div>
        </div>
    )
}

export default ProfileBox;