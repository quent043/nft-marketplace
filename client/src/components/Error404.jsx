import React, {useState, useEffect} from 'react';

const Error = () => {
   
    return (
        <div className='error--404'>
            <p>Error 404 : Page not found.</p>
            <img src='http://image.noelshack.com/fichiers/2022/31/6/1659774047-hellolost.png' alt='you are lost'/>
        </div>
    );
};


export default Error;