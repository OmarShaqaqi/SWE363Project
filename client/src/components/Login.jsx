import React from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Heading from "./Heading";





function LoginPage(props){

    const navigate = useNavigate()

    
    const [username,setUsername] = React.useState("");
    const [password,setPassword] = React.useState("");


function changeUsername(newEmail){

    setUsername(newEmail)

}
function changePassword(newPassword){

    setPassword(newPassword)


}

function goToRegister(){

    navigate("/register") // to go the the register page.

}

function goToMain(username){

    navigate("/main", { state: { username: username } }) // to go the the register page.

}

async function Login(event) {

    event.preventDefault();
    
    try {
        const response = await axios.post("http://localhost:4000/login", {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log(response.data); // Handle the response data here
        // You can perform actions based on the response. Example:
        if (response.data === "User exist") {
            goToMain(username);
        }
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : "Network error");
        alert("Login error: incorrect credentials")
        // Handle errors here
    }
}

    return(

        <div>

        <Heading />
        <form  className="form">
            <Input type={"text"} change={changeUsername} placeholder={"Username"} value={username} />
            <Input type={"password"} change={changePassword} placeholder={"Password"} value={password} />

            <button className="loginButton button" onClick={Login} type="submit">Login</button>
            <button className="loginButton button" type="button" onClick={goToRegister}>Register</button>
        </form>
        </div>
        
        


    );
}


export default LoginPage;