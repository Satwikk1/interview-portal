import React, { useEffect, useState } from "react";
import './home.scss';



function createCard(interview){
    return (
        <div key={interview.id} className="card">
            <div className="card-body">
                <h5 className="card-title">{interview.date}</h5>
                <p className="card-text">{interview.startTime} - {interview.endTime}</p>
            </div>
            <div className="card-footer">
                <small className="text-muted">Participants: {interview.intervieweeID.length}</small>
            </div>
        </div>
    )
}


function Home(props) {

    return ( 
        <div>
            <div className="card-columns">
                {props.scheduledInterviews.map((itm)=>{return createCard(itm)})}
            </div>  
        </div>
     );
}

export default Home;