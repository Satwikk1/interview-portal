import React from "react";

const active = "btn btn-outline-primary active";
const nonActive = "btn btn-outline-primary";


function Navigation(props) {

    function handleNavigation(e){
        var frame = {};
        for (const [key, value] of Object.entries(props.frame)) {
            frame[key] = false
        }
        frame[e.target.name] = true;
        props.setFrame(frame);
    }

    return ( 
        <div>
            <button name="allParticipants" onClick={handleNavigation} className={props.frame.allParticipants?active:nonActive}>all participants</button>
            <button name="allSchedules" onClick={handleNavigation} className={props.frame.allSchedules?active:nonActive}>schedules</button>
            <button name="addParticipant" onClick={handleNavigation} className={props.frame.addParticipant?active:nonActive}>new participant</button>
            <button name="newSchedule" onClick={handleNavigation} className={props.frame.newSchedule?active:nonActive}>schedule new</button>
        </div>
     );
}

export default Navigation;