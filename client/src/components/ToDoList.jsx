import React, { useState } from "react";
import Item from "./Item";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";

 function ToDoList(props) {
  // Initialize state variables for items and input
  const username = props.username;
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");



  async function fetchGoals() {
    if (username) {
      try {
        const response = await axios.post(
          `${process.env.SERVER_URL}/goals`,
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

  React.useEffect(() => {
    async function loadGoals() {
      const goals = await fetchGoals();

      console.log("THsi is fetch goals");
      console.log(goals.data);
      setItems(goals.data);
    }
    loadGoals();
  }, [username]);




  // Function to handle button click event
  // Function to handle button click event
function buttonClicked(event) {
  event.preventDefault(); // Prevent form submission

  if (input.trim() !== "") {
    // Add new goal with the same structure as fetched goals
    setItems([...items, { goal: input }]); // Add { goal: input } object here
    // Clear input field
    

    axios.post(`${process.env.SERVER_URL}/insertgoal`, {
      goal: input,
      username: username
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
    
  }
  setInput("");
}


  // Function to handle input change event
  function InputChange(event) {
    const { value } = event.target;
    setInput(value);
  }

  function deleteItem(name) {
    // Filter out the item to be deleted
    const filteredItems = items.filter(listItem => listItem.goal !== name);
  
    // Update the state with the filtered items
    setItems(filteredItems);
    console.log("indside dlete items");
    console.log(items);
  
    // Convert filteredItems to JSON
    const questionsJSON = JSON.stringify(filteredItems);
  
    // Perform axios post request
    axios.post(`${process.env.SERVER_URL}/deletegoal`, {
      goals: questionsJSON,
      username: username
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(response => {
      console.log("Item deleted successfully:", name);
    })
    .catch(error => {
      console.error("Error deleting item:", error);
    });

    console.log(items);
  }
  

  return (
    <div className="container ">
      <div className="heading">
        <h1>Goals</h1>
      </div>
      <div className="form">
        {/* Input field */}
        <input onChange={InputChange} type="text" value={input} />
        {/* Button to add new item */}
        <button onClick={buttonClicked}>
          <span className="addButton"><AddIcon /></span>
        </button>
      </div>
      <div>
        {/* Render the list of items */}
        <ul>
          {items.map((goal, index) => (
            <Item key={index} name={goal.goal} onDelete={deleteItem}/>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
