const ProfilBox = (props) => {
    return(
        <div className='box--nft--profil'>
        <div>
          <img className='box--nft--profil--image' src={props.imageUrl}/>
        </div>
        <div className='box--nft--profil--info'>
          <p>{props.account}</p>
          <p>Owned: {props.owned}</p>
          <p>Collections: {props.collections}</p>
        </div>
        <div></div>
      </div>
    )
}

export default ProfilBox;