import React from "react";
import './create.scss';

function Create(props) {
    return ( 
        <div>

            <form>
                <div className="form-group">
                    <label for="name">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="nameHelp" placeholder="Enter name"/>
                </div>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                </div>
                <div className="form-group">
                    <label for="resume">Upload resume </label>
                    <input type="file" className="form-control" id="resume"/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>

        </div>
     );
}

export default Create;