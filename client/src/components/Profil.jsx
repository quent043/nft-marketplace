import React from 'react';

import { useParams } from 'react-router-dom';

const Profil = () => {

    let {account} = useParams();
   
    return (
        <div>
            <p>Profile {account} </p>
        </div>
    );
};


export default Profil;