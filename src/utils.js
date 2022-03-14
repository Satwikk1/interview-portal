import {default as date_module} from 'date-and-time';
import emailjs from '@emailjs/browser';
import{ init } from '@emailjs/browser';
init("user_TgsJoAAXIf4bThefY3KyB");

function getAdminDetails(id){
    let data = JSON.parse(localStorage.getItem('admin'));
    let admin;
    data.forEach(itm=>{
        if(itm.id===id){
            admin = itm;
            return;
        }
    })
    return admin;
}

function getParticipants(){
    let data = JSON.parse(localStorage.getItem('participant'));
    return data;
}

function getAllInterviews(){
    let data = JSON.parse(localStorage.getItem('interview'));
    return data;
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
    return interviewObjs;
}

function isSlotOverlap(st2, st1, et2, et1){
    let s1, s2, e1, e2;
    s1 = parseInt(date_module.format(st1, 'HH'))+(parseInt(date_module.format(st1, 'mm')))/60;
    s2 = parseInt(date_module.format(st2, 'HH'))+(parseInt(date_module.format(st2, 'mm')))/60;
    e1 = parseInt(date_module.format(et1, 'HH'))+(parseInt(date_module.format(et1, 'mm')))/60;
    e2 = parseInt(date_module.format(et2, 'HH'))+(parseInt(date_module.format(et2, 'mm')))/60;

    // console.log(s1, e1, s2, e2);

    let end = 23+(59/60);
    // s1-> existing start time, e1->existing end time
    // s2-> scheduling start time, e2->scheduling end time
    // if all the points lies between 0 and 23:59
    if(
        s1>=0 && 
        s2>=0 && 
        e1>=0 && 
        e2>=0 && 
        s1<=end && 
        s2<=end && 
        e1<=end && 
        e2<=end &&
        ((s2<=s1 && e2<=s1) || (s2>=e1 && e2>=e1))
    ){
        return false;
    }
    // if in existing slot, end time goes beyond 23:59  -->e1       s1<--
                                                    //  |               |
                                                    //  -----------------
    else if(
        s1>e1 &&
        s2>=e1 &&
        e2>=e1 &&
        s2<=s1 &&
        e2<=s1
    ){
        return false;
    }

    // if scheduling slot goes beyond 23:59
    else if(
        s2>e2 &&
        s2>=e1 &&
        e2<=s1
    ){
        return false;
    }
    return true;
    // return (
    //     (s1===s2 && e1===e2)
    //     ||
    //     (s1>=s2 && e1<=e2)
    //     ||
    //     (s1<=s2 && e1>=e2)
    //     ||
    //     (s1>=s2 && s1<e2)
    //     ||
    //     (e1>s1 && e1<=e2)
    // )
}

function getInterveiwWithID(id){
    let interviews = JSON.parse(localStorage.getItem('interview'));
    for(let i=0;i<interviews.length;i++){
        let itm = interviews[i];
        if(itm.id===id) return itm;
    }
}

function getPatricipantWithID(id){
    let participant = JSON.parse(localStorage.getItem('participant'));
    for(let i=0;i<participant.length; i++){
        let itm = participant[i];
        if(itm.id===id) return itm;
    }
}

function isSlotsCollasping(id, date, st, et, update, updateID){
    let ids = getPatricipantWithID(id);
    for(let i=0;i<ids.interviewID.length; i++){
        let id = ids.interviewID[i];

        // skip currently updating interview
        if(update){
            if(updateID===id) return false;
        }

        let itm = getInterveiwWithID(id);
        // console.log(id);
        let itm_date = date_module.parse(itm.date, 'DD-MM-YYYY');
        let itm_st = date_module.parse(itm.startTime, 'h:m:s');
        let itm_et = date_module.parse(itm.endTime, 'h:m:s');
        if(date_module.isSameDay(date, itm_date)){
            return(isSlotOverlap(st, itm_st, et, itm_et))
        }
    }
}

function sendMail(mail, date, st, et){
    console.log(mail, date, st, et);
    let form = {
        to: mail,
        date: date,
        st: st,
        et: et,
        email: 'satvikjee1@gmail.com'
    }

    emailjs.send('service_r99hg0m', 'template_9c9lqw3', form)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
}

function getEmail(obj){
    let participant = getParticipants();
    let selected = obj.intervieweeID;
    let emails = []
    participant.map(itm=>{
        for(let i=0;i<selected.length; i++){
            if(itm.id===selected[i]){
                return emails.push(itm.email);
            }
                
        }
        return null;
    })

    emails.forEach(itm=>{
        setTimeout(()=>{
            sendMail(itm, obj.date, obj.startTime, obj.endTime);
        }, 1500)
    })
}

function updateParticipantsOnInterviewUpdate(obj){
    let participants = getParticipants();
    for(let i=0; i<participants.length;i++){
        let id = participants[i].id;
        for(let j=0;j<obj.intervieweeID.length;j++){
            let id2 = obj.intervieweeID[j];
            if(id===id2){
                participants[i].interviewID.push(obj.id);
            }
        }
    }
    localStorage.setItem('participant', JSON.stringify(participants));
}

function saveNewSchedule(obj){
    let interviews = getAllInterviews()
    obj.id = interviews.length+1;
    obj.date = date_module.transform(obj.date, 'YYYY-MM-DD', 'DD-MM-YYYY');
    interviews.push(obj);
    localStorage.setItem('interview', JSON.stringify(interviews));
    getEmail(obj);

    // update participant interviewID
    updateParticipantsOnInterviewUpdate(obj);
    
}

function updateSchedule(updateID, obj){
    let interviews = getAllInterviews();
    obj.id = updateID;
    obj.date = date_module.transform(obj.date, 'YYYY-MM-DD', 'DD-MM-YYYY');
    for(let i=0;i<interviews.length;i++){
        let id = interviews[i].id;
        if(id===updateID){
            interviews[i]=obj;
            break;
        }
    }
    localStorage.setItem('interview', JSON.stringify(interviews));

    updateParticipantsOnInterviewUpdate(obj);
}

function saveParticipant(name, email){
    let participants = getParticipants();
    participants.push({
        id: participants.length+1,
        name: name,
        email: email,
        interviewID: []
    })
    localStorage.setItem('participant', JSON.stringify(participants));
}


export {
    binarySearch,
    isSlotOverlap,
    updateSchedule,
    saveParticipant,
    getParticipants,
    saveNewSchedule,
    getAdminDetails,
    getAllInterviews,
    isSlotsCollasping,
    getInterveiwWithID,
    getScheduledInterviews,
}