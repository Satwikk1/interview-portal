import React, { useEffect, useState } from "react";
import date from 'date-and-time';
import './home.scss';



function createCard(interview){

    const pattern = date.compile('ddd, MMM DD');
    const time_pattern = date.compile('hh:mm A');

    let d = date.parse(interview.date, 'DD-MM-YYYY');
    let date_string = date.format(d, pattern);

    let st = date.parse(interview.startTime, 'h:m:s');
    let st_string = date.format(st, time_pattern);

    let et = date.parse(interview.endTime, 'h:m:s');
    let et_string = date.format(et, time_pattern);

    return (
        <div key={interview.id} className="card">
            <div className="card-body">
                <h5 className="card-title">{date_string}</h5>
                <p className="card-text">{st_string} - {et_string}</p>
            </div>
            <div className="card-footer">
                <small className="text-muted">Participants: {interview.intervieweeID.length}</small>
            </div>
        </div>
    )
}


function Home(props) {

    return ( 
        <div id="home-container">
            <div className="card-columns">
                {props.scheduledInterviews.map((itm)=>{return createCard(itm)})}
            </div>  
        </div>
     );
}

export default Home;