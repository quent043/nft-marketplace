import React, {Fragment} from 'react';
import {useNavigate} from "react-router-dom";

function NftListTable({items, title, style, path}) {
    const css = "table " + style;
    const navigate = useNavigate();

    const handleClick = (tokenId) => {
        navigate(path + "/" + tokenId);
    };

    return (
        <Fragment>
            <table className={css}>
                <thead>
                <tr>
                    <th scope="col">{title}</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <p onClick={() => {handleClick(index + 1)}}>{item.name}</p>
                            </td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Fragment>
    );
}

export default NftListTable;