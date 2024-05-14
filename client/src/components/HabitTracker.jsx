import Habit from "./Habit";
import React from "react"
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";


function HabitTracker(props) {
    // Initial habits data (just a placeholder)
    const username = props.username;
    const initialHabits = [];


    var add = props.add

    const generateStartArray = () => [false, false, false, false, false, false, false];


  const [input, setInput] = React.useState("");
  
    // State to manage habits
    const [habits, setHabits] = React.useState(initialHabits);
  
    // Function to toggle completion status of a day for a habit
    const toggleDay = (habitId, dayIndex) => {
      setHabits(prevHabits => {
          return prevHabits.map(habit => {
              if (habit.id === habitId) {
                  const updatedDays = [...habit.days];
                  updatedDays[dayIndex] = !updatedDays[dayIndex];
  
                  // Call the backend to update the database
                  axios.patch(`http://localhost:4000/updatehabit/${habitId}`, {
                      day: dayIndex,
                      newValue: updatedDays[dayIndex]
                  },{
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                  .then(response => {
                      console.log("Database update successful:", response.data);
                  })
                  .catch(error => {
                      console.error("Error updating database:", error);
                  });
  
                  return { ...habit, days: updatedDays };
              }
              return habit;
          });
      });
  };


  const [showReminder, setShowReminder] = React.useState(false);

    React.useEffect(() => {
        setTimeout(checkForUncompletedTodayHabits,10)
    }, []);  // Checks when habits change

    const checkForUncompletedTodayHabits = () => {
        const currentDate = new Date();
        const hour = currentDate.getHours();
        const currentDayIndex = currentDate.getDay();  // Get current day as index

        // Check if any habit is unchecked for today
        const hasUncheckedToday = habits.some(habit => !habit.days[currentDayIndex]);


        if (hour >= 12 && hasUncheckedToday) {
          setShowReminder(true);
          alert("You have incomplete habits for today!!, Hurry up")
      } else {
          setShowReminder(false);
      }
    };
  
     
  

      // Initialize state variables for items and input
      async function fetchGoals() {
        console.log("fetchgoals username")
        console.log(username)
        if (username) {
          try {
            const response = await axios.post(
              "http://localhost:4000/habits",
              { username: username },
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );
            return response;
          } catch (error) {
            console.error("Error fetching goals:", error);
            return [];
          }
        }
        return [];
      }

      async function loadGoals() {
        let habitsAsJSON = await fetchGoals();

         habitsAsJSON = habitsAsJSON.data.map(item => ({
          name: item.habit,
          days: [item.sun, item.mon, item.tue, item.wed, item.thu, item.fri, item.sat],
          id: item.id
        }));
        console.log(habitsAsJSON)
        setHabits(habitsAsJSON);
        console.log("This is the state")
        console.log(habits)
  

      }

      React.useEffect(() => {
        
        loadGoals();
      }, [username]);

      React.useEffect(() => {

}, [habits]);
    

  // Function to handle button click event
  function buttonClicked(event) {
    event.preventDefault(); // Prevent form submission

    if (input.trim() !== "") {
      // Add new item to the list
      setHabits([...habits, { name: input, days: generateStartArray() }]);

      axios.post("http://localhost:4000/inserthabit", {
        habit: input,
        username: username,
        days:generateStartArray()
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(response => {
        console.log("Item inserted successfully:", input);
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });


      // Clear input field
      
    }
    setInput("");
    loadGoals();

  }

  // Function to handle input change event
  function InputChange(event) {
    const { value } = event.target;
    setInput(value);
  }

   async function deleteItem(habitId) {
    console.log("before delted")
    console.log(habits)
    console.log(habitId);
   await setHabits(habits.filter(habit =>{
       return (habit.id !== habitId)
    }))
    

    axios.delete(`http://localhost:4000/deletehabit/${habitId}`)
    .then(response => {
        console.log("Habit deleted successfully:", response.data);
        // Update the state to remove the habit from the list
        setHabits(currentHabits => currentHabits.filter(habit => habit.id !== habitId));
    })
    .catch(error => {
        console.error("Error deleting habit:", error);
    });
    console.log("after")
    console.log(habits);

    


  };

    
  
    return (
      <div className="container">
            <div className="heading HabitTrackerHeading">
                <h1>Habit Tracker</h1>
            </div>
            <div className="form">
                {/* Input field */}
                <input onChange={InputChange} type="text" value={input} />
                {/* Button to add new item */}

                {add && <button onClick={buttonClicked}>
                <span className="addButton"><AddIcon /></span>
            </button>}
          
             </div>
            {/* Render each habit */}
             {habits.map((habit,index) => (
            <Habit
                key={habit.id || index}
                id={habit.id}
                check={props.check}
                delete={props.delete}
                name={habit.name}
                days={habit.days}
                onDelete={deleteItem}
                onToggleDay={ toggleDay }
            />
            ))} 
      </div>
    );
  }

  export default HabitTracker;