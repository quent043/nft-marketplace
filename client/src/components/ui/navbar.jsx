import React from 'react';
import { Link } from "react-router-dom";

function    NavBar() {

    return (
        <>
            <nav>
                <Link to={"/"}> Dashboard </Link>
                <Link to={"/collections"}> Collections </Link>
                <Link to={"marketplace"}> Marketplace </Link>
                <Link to={"profile"}> Profile </Link>
                <Link to={"createNft"}> Create an NFT </Link>
            </nav>

        </>
    )
}

export default NavBar;