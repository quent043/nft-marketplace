import React, {Fragment} from 'react';
import { useNavigate } from "react-router-dom";

function NftCollectionTable({items, title, style, history}) {
    const css = "table " + style;
    const navigate = useNavigate();

    const handleClick = (address) => {
        navigate("/collections/" + address);
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
                                <p onClick={() => {handleClick(item)}}> {item} </p>
                            </td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Fragment>
    );
}

export default NftCollectionTable;