import React, { useEffect, useState } from "react";
import date from 'date-and-time';
import './home.scss';

function handleEdit(id, props){

    var frame = {};
    for (const [key, value] of Object.entries(props.navFrame)) {
        frame[key] = false
    }
    frame.newSchedule = true;
    props.setNavFrame(frame);

    props.setOnEditId(id);
    props.setOnEdit(true);
}

function createCard(interview, props){

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
                <button onClick={(e)=>{
                    handleEdit(interview.id, props)
                }} className="btn btn-outline-secondary">edit</button>
            </div>
        </div>
    )
}

function printOptions(itm){
    return <option value={itm.id}>{itm.name}</option>
}


function Home(props) {

    const [participants, setParticipants] = useState(null);

    useEffect(()=>{
        let participant = props.getParticipants();
        setParticipants(participant);
    }, [])

    function handleChange(e){
        let id = e.target.value;
        let scheduledInterviewss = [];
        let scheduleID = [];
        
        for(let i=0; i<participants.length; i++){
            if(participants[i].id==id){
                scheduleID = participants[i].interviewID;
                break;
            }
        }

        var allInterviews = props.getAllInterviews();
        console.log("scheduled id", scheduleID);
        console.log(allInterviews)
        scheduleID.forEach(itm=>{
            for(let i=0; i<allInterviews.length; i++){
                if(itm==allInterviews[i].id){
                    scheduledInterviewss.push(allInterviews[i]);
                    break;
                }
            }
        })
        console.log(scheduledInterviewss);
        props.setScheduledInterviews(scheduledInterviewss);
    }

    return ( 
        <div id="home-container">
            <div>
                <select onChange={handleChange}>
                    <option selected>select name</option>
                    {participants?
                        participants.map((itm)=>printOptions(itm))
                    :null}
                </select>                
            </div>
            <div className="card-columns">
                {props.scheduledInterviews.map((itm)=>{return createCard(itm, props)})}
            </div>  
        </div>
     );
}

export default Home;