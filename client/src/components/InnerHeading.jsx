import React from "react";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import GroupsIcon from '@mui/icons-material/Groups';



function InnerHeading(props){

    const navigate = useNavigate()
    const username = props.username;
    console.log("inside the nav")
    console.log(username);
    return(
        <header style={{ marginTop:"0px"}}>
            <div><h1>Habit Tracker</h1></div>
            <div style={{display:"flex",justifyContent:"center",gap:"1.5rem"
            }}>



                <div className="icons" onClick={
                    ()=>{
                        navigate("/friend", { state: { username: username } }) 
                    }
                }><GroupsIcon /></div>

                <div className="icons" onClick={()=>{  
                    navigate("/main", { state: { username: username } }) 
                    
                }}><CalendarMonthIcon /></div>

                <div className="icons" onClick={
                    ()=>{
                        navigate("/profile", { state: { username: username } }) 
                    }
                }><AccountBoxIcon /></div>

                <div className="icons" onClick={
                    ()=>{
                        navigate("/chart", { state: { username: username } }) 
                    }
                }><EqualizerIcon /></div>

                <div className="icons" onClick={
                    ()=>{
                        navigate("/login", { state: { username: username } }) 
                    }
                }><LogoutIcon /></div>
                
                
            </div>
            
            

        </header>


    );
};



export default InnerHeading;