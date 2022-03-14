import React, {useEffect, useState} from 'react';

import Home from './components/home/Home.js';
import Schedule from './components/schedule/Schedule.js';
import Create from './components/create/Create.js';
import Header from './components/header/Header.js';
import Navigation from './components/navigation/Navigation.js';
import Participants from './components/participants/Participants.js';

import './app.css';
import {
    binarySearch,
    isSlotOverlap,
    getAdminDetails,
    getParticipants,
    saveNewSchedule,
    getAllInterviews,
    isSlotsCollasping,
    getScheduledInterviews,
} from './utils.js';
// dummy data
import data from './data.js';


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
            allSchedules: true,
            allParticipants: false
        })

        function reloadInterviews(){
            let interviews = getScheduledInterviews(adminID);
            setScheduledInterviews(interviews);
        }

        // effect
        useEffect(() => {
            // localStorage.setItem('interview', JSON.stringify(data.interview))
            let details = getAdminDetails(adminID);
            setAdminDetails(details);
            setDetailLoader(!detailLoader);

            let interviews = getScheduledInterviews(adminID);
            setScheduledInterviews(interviews);
            setInterviewCardLoader(!interviewCardLoader);

            // print dummy data
            console.log(JSON.parse(localStorage.getItem('interview')));
            console.log(JSON.parse(localStorage.getItem('participant')));
            
        }, []);

        return ( 
            <div className='App'>
                {detailLoader?loaderHtml:<Header adminName={adminDetails.name}/>}
                {detailLoader?<div></div>:<Navigation frame = {navFrame} setFrame = {setNavFrame} />}
                {interviewCardLoader?
                    loaderHtml
                    :
                    navFrame.allSchedules?
                        <Home scheduledInterviews={scheduledInterviews} />
                        :
                        null
                }
                {navFrame.allParticipants?
                    <Participants getParticipants={getParticipants} />
                    :
                    null
                }
                {navFrame.addParticipant?
                    <Create getParticipants={getParticipants} />
                    :
                    null
                }
                {navFrame.newSchedule?
                    <Schedule 
                        adminID={adminID}
                        navFrame={navFrame}
                        setNavFrame={setNavFrame}
                        binarySearch={binarySearch} 
                        isSlotOverlap={isSlotOverlap} 
                        getParticipants={getParticipants} 
                        saveNewSchedule={saveNewSchedule} 
                        reloadInterviews={reloadInterviews}
                        getAllInterviews={getAllInterviews} 
                        isSlotsCollasping={isSlotsCollasping} 
                    />
                    :
                    null
                }
            </div>
        );
}

export default App;