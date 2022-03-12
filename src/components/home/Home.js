import React, { useEffect, useState } from "react";
import './home.css';

// dummy data
import data from '../../data.js';

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

// binary search -> bool
function binarySearch(arr, x){
    let start=0, end=arr.length-1;
    while (start<=end){
        let mid=Math.floor((start + end)/2);
        if (arr[mid]===x) return true;
        else if (arr[mid] < x)
             start = mid + 1;
        else
             end = mid - 1;
    }
    return false;
}

// binary search for finding matched interviews
function getScheduledInterviews(id){
    let data = getAdminDetails(id);
    let interviews = data.interviewID;
    interviews.sort();
    let interviewObjs = JSON.parse(localStorage.getItem('interview'));
    interviewObjs.filter(itm=>binarySearch(interviews, itm.id));
    console.log(interviewObjs);
    return interviewObjs;
}

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
    // state
    const [detailLoader, setDetailLoader] = useState(true);
    const [interviewCardLoader, setInterviewCardLoader] = useState(true);
    const [adminDetails, setAdminDetails] = useState();
    const [scheduledInterviews, setScheduledInterviews] = useState();

    // effect
    useEffect(() => {
        let details = getAdminDetails(props.adminID);
        setAdminDetails(details);
        setDetailLoader(!detailLoader);
        let interviews = getScheduledInterviews(props.adminID);
        setScheduledInterviews(interviews);
        setInterviewCardLoader(!interviewCardLoader);
    }, []);



    return ( 
        <div>
            {detailLoader?loaderHtml
                :
                <div id="name-container">
                    <h2>{adminDetails.name}</h2>
                </div>
            }
            {interviewCardLoader?loaderHtml:
                <div className="card-columns">
                    {scheduledInterviews.map((itm)=>{return createCard(itm)})}
                </div>
            }  
        </div>
     );
}

export default Home;