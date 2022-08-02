import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Collection = () => {

    let { account } = useParams();
    
    return (
        <div>
            <p>Exemple de récupération depuis l'addresse HTML {account} via  useParams() </p>            <p>User's collections</p>
        </div>
    );
};


export default Collection;