import React, {Fragment} from 'react';
import {useNavigate} from "react-router-dom";

function NftListTable({items, title, style}) {
    const css = "table " + style;
    const navigate = useNavigate();

    const handleClick = (address) => {
        //TODO: Gérer le routing vers la page de détail du NFT
        navigate("" + address);
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
                                {item.name}
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