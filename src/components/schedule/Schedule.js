import React, { useEffect, useState } from "react";
import './schedule.scss';
import { binarySearch } from "../../utils";
import {default as date_module} from 'date-and-time';
import {toast} from 'react-toastify';

const loaderHTML = <div className="loader"></div>

function Schedule(props) {
    
    // states
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [participants, setParticipants] = useState();
    const [update, setUpdate] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [updateID, setUpdateID] = useState();
    const [date, setDate] = useState('');
    const [st, setSt] = useState('');
    const [et, setEt] = useState('');


    
    function validateSubmit(){
        // validate number of participants
        if(date===''){
            toast.warn('date field is empty!');
            return;
        }if(st===''){
            toast.warn('start time field is empty!');
            return;
        }if(et===''){
            toast.warn('end time filed is empty!');
            return;
        }
        if(selectedParticipants.length>=2){
            let selected_date = date_module.parse(date, 'YYYY-MM-DD');
            let selected_st = date_module.parse(st, 'h:m:s');
            let selected_et = date_module.parse(et, 'h:m:s');

            if(date_module.subtract(new Date(), selected_date).toDays()>=0){
                toast.warn('you have selected past date!');
                return;
            }

            let hasCollasped = [];

            // check is participant is available at selected date and time
            let flag = true; // save to database if flag is true



            for(let i=0; i<selectedParticipants.length; i++){
                let itm = selectedParticipants[i];
                let check;
                if(update){
                    check = props.isSlotsCollasping(itm, selected_date, selected_st, selected_et, true, updateID);
                }else{
                    check = props.isSlotsCollasping(itm, selected_date, selected_st, selected_et, false, -1)
                }
                if(check){
                    hasCollasped.push(itm);
                    flag = false;
                }
            }



            if(flag){
                let obj = {
                    interviwerID: props.adminID,
                    intervieweeID: selectedParticipants,
                    date: date,
                    startTime: st,
                    endTime: et
                }

                let frame = {};
                for (const [key, value] of Object.entries(props.navFrame)) {
                    frame[key] = false
                }
                frame.allSchedules = true;

                props.setNavFrame(frame);
                if(update){
                    props.updateSchedule(updateID, obj);
                }else{
                    props.saveNewSchedule(obj);
                }
                props.reloadInterviews();

            }else{
                let len=hasCollasped.length%6;
                hasCollasped.sort();
                for(let i=0;i<participants.length && len>=0; i++){
                    if(binarySearch(hasCollasped, participants[i].id)){
                        toast.warn(`${participants[i].name} has an interview collasping with the selected slot`, {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            className: 'collaspe-toast'
                        });
                        len-=1;
                    }
                }
            }
        }else{
            toast.warn('Number of Participants is less than 2');
        }
    }

    function handleSubmit(){
        validateSubmit();
        // console.log(selectedParticipants, date, st, et, update, props.onEditId, updateID);
    }

    function addSelectedParticipant(e, id){
        let selected = selectedParticipants.slice();
        
        let checkbox_status = e.target.checked;
        if(checkbox_status){
            if(!binarySearch(selected, id)){
                selected.push(id);
            }
        }else{
            if(binarySearch(selected, id)){
                selected = selected.filter((itm)=>{
                    if(itm!==id){
                        return true;
                    }
                    return false;
                })
            }
        }
        selected.sort();
        setSelectedParticipants(selected);
    }
    
    function createListItem(item, state){
        return (
            <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>
                    {
                        state?
                        <input checked={true} onChange={(e)=>{addSelectedParticipant(e, item.id)}} type="checkbox" name="name1" />
                        :
                        <input checked={false} onChange={(e)=>{addSelectedParticipant(e, item.id)}} type="checkbox" name="name1" />
                    }
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
            </tr>
        )
    }
    
    
    useEffect(()=>{

        let participants = props.getParticipants();
        setParticipants(participants);
        setLoaded(!loaded);
        
        if(props.onEdit){
            let interview = props.getInterveiwWithID(props.onEditId);
            setDate(date_module.transform(interview.date,'DD-MM-YYYY','YYYY-MM-DD'));
            setSt(interview.startTime);
            setEt(interview.endTime);
            setSelectedParticipants(interview.intervieweeID);
            props.setOnEdit(!props.onEdit);
            setUpdateID(props.onEditId);
            props.setOnEditId(null);
            setUpdate(true);
        }
        
        // return () => {
        //     setDate('');
        //     setSt('');
        //     setEt('');
        //     setSelectedParticipants([])
        // }

    }, [])

    return ( 
        <div id="schedule-container">
            <div>
                <label for="meet-date">Meeting Date</label>
                <input value={date} onChange={(e)=>setDate(e.target.value)} id="meet-date" className="form-control" type={"date"} />

                <label for="meet-st">Start time</label>
                <input value={st} onChange={(e)=>setSt(e.target.value)} id="meet-st" className="form-control" type={"time"}/>

                <label for="meet-et">End time</label>
                <input value={et} onChange={(e)=>setEt(e.target.value)} id="meet-et" className="form-control" type={"time"}/>
            </div>
            <div id="schedule-btn">
                <button onClick={handleSubmit} className="btn btn-primary">Schedule</button>
            </div>
            <div>
                {
                    loaded?
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Add</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map(itm=>{
                                let state = false;
                                for(let i=0;i<selectedParticipants.length; i++){
                                    let id = selectedParticipants[i];
                                    if(itm.id===id){
                                        state = true;
                                        return createListItem(itm, true);
                                    }
                                }
                                if(state===false){
                                    return createListItem(itm, false);
                                }
                            })}
                        </tbody>
                    </table>
                    :
                    loaderHTML
                }
            </div>
            
        </div>
     );
}

export default Schedule;
