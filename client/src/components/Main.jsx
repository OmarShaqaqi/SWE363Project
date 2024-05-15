import React from "react";
import HabitTracker from "./HabitTracker";
import ToDoList from "./ToDoList";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InnerHeading from "./InnerHeading";
import Timer from "./Timer";


function Main(){

    const location = useLocation();
    const username = location.state ? location.state.username : null;
    console.log(username);


    //navigate("/profile", { state: { username: username } }); // this will be used to go to the profile page
    console.log("inside main")
    console.log(username)



    

    return(
        <div className="main">
            <InnerHeading username={username} />
            <Timer />
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}><h1>Welcome again, {username}</h1></div>
            <HabitTracker username={username} add={true} />
            <ToDoList username={username}/>
        </div>
    );



}


export default Main;