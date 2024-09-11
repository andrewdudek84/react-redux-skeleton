import { Table } from 'react-bootstrap';
import { createClaimsTable } from '../utils/claimUtils';

import '../styles/App.css';

export const IdTokenData = (props) => {
    const tokenClaims = createClaimsTable(props.idTokenClaims);

    const tableRow = Object.keys(tokenClaims).map((key, index) => {
        return (
            <span>
                {tokenClaims[key].map((claimItem) => (
                    <span key={claimItem}>{claimItem}</span>
                ))}
            </span>
        );
    });
    return (
       
        <div className="user-info-div">
            Welcome {tableRow}
        </div>
        
    );
};