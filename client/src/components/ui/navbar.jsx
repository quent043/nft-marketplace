import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";

function    NavBar() {

    return (
        <>
            <nav>
                <Link to={"/"}> Dashboard </Link>
                <Link to={"/collections"}> Collections </Link>
                {/*<Link to={"/" + accounts}> Dashboard </Link>*/}
                {/*<Link to={"collection/" + accounts}> Collection </Link>*/}
                {/*<Link to={"marketplace/" + accounts}> Marketplace </Link>*/}
                <Link to={"profile"}> Profile </Link>
                <Link to={"create"}> Create an NFT </Link>
                <Link to={"create2"}> Create an NFT </Link>
            </nav>

        </>
    )
}

export default NavBar;