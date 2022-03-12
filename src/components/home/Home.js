import React, { useEffect, useState } from "react";
import './home.css';


var loaderHtml = (<div id="loader"></div>);

function getAdminDetails(id){
    let data = JSON.parse(localStorage.getItem('admin'));
    let admin;
    data.forEach(itm=>{
        if(itm.id==id){
            admin = itm;
            return;
        }
    })
    return admin;
}

function createCard(){
    
}

function Home(props) {
    // state
    const [detailLoader, setDetailLoader] = useState(true);
    const [interviewCardLoader, setInterviewCardLoader] = useState(true);
    const [adminDetails, setAdminDetails] = useState();

    // effect
    useEffect(() => {
        let details = getAdminDetails(props.adminID);
        setAdminDetails(details);
        setDetailLoader(!detailLoader);
    }, []);



    return ( 
        <div>
            {detailLoader?loaderHtml
                :
                <div id="name-container">
                    <h2>{adminDetails.name}</h2>
                </div>
            }  
        </div>
     );
}

export default Home;