import React, {useState, useEffect} from 'react';

import { useParams } from 'react-router-dom';

const Marketplace = () => {

    let {account} = useParams();
   
    return (
        <div>
            <p>Exemple de récupération depuis l'addresse HTML {account} via  useParams() </p>
            <p>Marketplace</p>
        </div>
    );
};


export default Marketplace;