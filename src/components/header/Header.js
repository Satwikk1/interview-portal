import React from "react";
import './header.scss';

function Header(props) {
    return ( 
        <div>
            <h2>{props.adminName}</h2>
        </div>
     );
}

export default Header;