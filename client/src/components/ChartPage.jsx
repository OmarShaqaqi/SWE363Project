import React, { useState, useEffect } from "react";
import CurvedLineChart from "./Chart";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InnerHeading from "./InnerHeading";
function ChartPage(props) {

    const location = useLocation();
    const username = location.state ? location.state.username : null;
    const [exerciseData, setExerciseData] = useState([
        ['Sun', 0],  // Initial data with default percentage
        ['Mon', 0],
        ['Tue', 0],
        ['Wed', 0],
        ['Thu', 0],
        ['Fri', 0],
        ['Sat', 0],
    ]);

    useEffect(() => {
        async function fetchDailyHabits() {
            try {
                const result = await axios.post(`${process.env.SERVER_URL}/habits/stat`, { username }, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                
                if (result.data) {
                    const lastDaysCounter = calculateHabitCounts(result.data);
                    setExerciseData(exerciseData.map((day, index) => [day[0], lastDaysCounter[index]]));
                }
            } catch (err) {
                console.log("error fetching habits:", err);
            }
        }

        fetchDailyHabits();
    }, [username]);

    function calculateHabitCounts(rowData) {
        let dailyHabitsCount = [0, 0, 0, 0, 0, 0, 0];

        rowData.forEach(habit => {
            if (habit.sun) dailyHabitsCount[0] += 1;
            if (habit.mon) dailyHabitsCount[1] += 1;
            if (habit.tue) dailyHabitsCount[2] += 1;
            if (habit.wed) dailyHabitsCount[3] += 1;
            if (habit.thu) dailyHabitsCount[4] += 1;
            if (habit.fri) dailyHabitsCount[5] += 1;
            if (habit.sat) dailyHabitsCount[6] += 1;
        });

        return dailyHabitsCount;
    }

    return(

        <div className="pageMain" >
        <InnerHeading username={username}/>
        <div className="chart-container">
            <CurvedLineChart data={exerciseData} />
            </div>


        </div>
    )
    
    
}

export default ChartPage;
