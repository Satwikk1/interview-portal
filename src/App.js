import React, {useEffect, useState} from 'react';
import Schedule from './components/schedule/Schedule.js';
import Create from './components/create/Create.js';
import Header from './components/header/Header.js';
import Home from './components/home/Home.js';
import Navigation from './components/navigation/Navigation.js';
import './app.css';
import {
    getScheduledInterviews,
    binarySearch,
    getAdminDetails
} from './utils.js'

let adminID = 1;
var loaderHtml = (<div id="loader"></div>);

function App() {

        // state
        const [detailLoader, setDetailLoader] = useState(true);
        const [interviewCardLoader, setInterviewCardLoader] = useState(true);
        const [adminDetails, setAdminDetails] = useState();
        const [scheduledInterviews, setScheduledInterviews] = useState();
        const [navFrame, setNavFrame] = useState({
            addParticipant: false,
            newSchedule: false,
            allSchedules: false,
            allParticipants: true
        })

        // effect
        useEffect(() => {
            let details = getAdminDetails(adminID);
            setAdminDetails(details);
            setDetailLoader(!detailLoader);

            let interviews = getScheduledInterviews(adminID);
            setScheduledInterviews(interviews);
            setInterviewCardLoader(!interviewCardLoader);
        }, []);

        return ( 
            <div className='App'>
                {detailLoader?loaderHtml:<Header adminName={adminDetails.name}/>}
                {detailLoader?<div></div>:<Navigation frame = {navFrame} setFrame = {setNavFrame} />}
                {interviewCardLoader?loaderHtml:<Home scheduledInterviews={scheduledInterviews} />}
            </div>
        );
}

export default App;