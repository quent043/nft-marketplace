import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";

function    NavBar() {

    const { state: { accounts } } = useEth();

    return (
        <>
            <nav>
                <Link to={"/"}> Dashboard </Link>
                <Link to={"/collections"}> Collections </Link>
                {/*<Link to={"/" + accounts}> Dashboard </Link>*/}
                {/*<Link to={"collection/" + accounts}> Collection </Link>*/}
                {/*<Link to={"marketplace/" + accounts}> Marketplace </Link>*/}
                {/*<Link to={"profile/" + accounts}> Profile </Link>*/}
                {/*<Link to={"create/" + accounts}> Create an NFT </Link>*/}
                {/*<Link to={"create2/" + accounts}> Create an NFT mul </Link>*/}
            </nav>

        </>
    )
}

export default NavBar;