import React, { useEffect, useState } from "react";
import './participants.scss';

function createTableRow(data){
    return (<tr key={data.id}>
        <th scope="row">{data.id}</th>
        <td>{data.name}</td>
        <td>{data.email}</td>
        {/* <td>{data.resume}</td> */}
    </tr>)
}

function diaplayData(data){
    let container = 
    <table className="table">
        <thead className="thead-dark">
            <tr>
                <th scope="col">id</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                {/* <th scope="col">resume</th> */}
            </tr>
        </thead>
        <tbody>
            {data.map(itm=>{
                return createTableRow(itm);
            })}
        </tbody>
    </table>

    return container;
}

const loaderHTML = <div id="loader"></div>

function Participants(props) {
    
    // states
    const [dataLoaded, setDataLoaded] = useState(false);
    const [displayData, setDisplayData] = useState();

    // effects
    useEffect(()=>{
        let data = props.getParticipants();
        setDisplayData(data);
        setDataLoaded(!dataLoaded);
    }, [])

    return ( 
        <div id="participant-list-container">
            {dataLoaded?
                diaplayData(displayData)
                :
                loaderHTML
            }
        </div>
     );
}

export default Participants;