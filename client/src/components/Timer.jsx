import React from "react";

function Timer() {

    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    let d = new Date()
    const [date,setDate] = React.useState(d.getHours()+":"+d.getMinutes())
    const day = days[d.getDay()];
    setInterval(getTime,1000);

    function getTime(){
      d = new Date()
      setDate(d.getHours()+":"+d.getMinutes())
    }

  return(
    <div className="Timer" >
      <div><h1>{day}</h1></div>
      <div><h1>{date}</h1></div>
      
    </div>
  );

}


export default Timer;