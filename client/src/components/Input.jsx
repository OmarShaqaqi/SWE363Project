import React from "react";


function Input(props){


    function changeValue(event){
        const newValue = event.target.value;
        props.change(newValue);


    }
    return(

        <input style={{display:"block", color:"black"}}  onChange={changeValue} type={props.type} placeholder={props.placeholder} />
    );
}



export default Input;