import React, { useState } from "react";
import {toast} from 'react-toastify';
import './create.scss';
 

function Create(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // const [file, setFile] = useState('');

    function validate(name, email){
        if(name===''){
            toast.warn("name filed is empty!");
            return false;
        }
        if(email===''){
            toast.warn("email filed is empty!");
            return false;
        }
        let at = false;
        let dot = false;
        for(let i=0; i<email.length; i++){
            if(email[i]==='@') at=true;
            if(email[i]==='.') dot=true;
        }
        if(!at || !dot){
            toast.warn('email format is not corrent!');
            return false;
        }
        return true;
    }

    function handleSubmit(e){
        e.preventDefault();
        let check = validate(name, email);
        if(check){
            props.saveParticipant(name, email);
            setEmail('')
            setName('');

            var frame = {};
            for (const [key, value] of Object.entries(props.navFrame)) {
                frame[key] = false
            }
            frame.allParticipants = true;
            props.setNavFrame(frame);
        }
    }

    return (
        <div>

            <form>
                <div className="form-group">
                    <label for="name">Name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} name="name" type="text" className="form-control" id="name" aria-describedby="nameHelp" placeholder="Enter name"/>
                </div>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} name="email" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                </div>
                {/* <div className="form-group">
                    <label for="resume">Upload resume </label>
                    <input value={file} onChange={(e)=>setFile(e.target.value)} name="resume" type="file" className="form-control" id="resume"/>
                </div> */}
                <div className="form-group">
                    <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </div>
            </form>

        </div>
     );
}

export default Create;