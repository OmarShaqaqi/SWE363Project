import React from "react";
import Zoom from '@mui/material/Zoom';
import DeleteIcon from '@mui/icons-material/Delete';

function Habit(props) {
  const { id, name, days, onToggleDay, onDelete } = props;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function handleOnDelete() {
    onDelete(id);  // Use the habit ID for deletion
  }

  return (
    <div className="habit">
      <Zoom in={true}>
        <div>
          <h3>{name} </h3>
          <div style={{ display: "flex" }}>
            {days.map((completed, index) => (
              <div className="Habit-day" key={index} style={{ marginRight: "2rem" }}>
                <label>{dayNames[index]} </label>
                <div>
                  <input
                    type="checkbox" 
                    disabled={props.check ? true : false} 
                    checked={completed}
                    onChange={() => onToggleDay(id, index)}  // Pass the habit ID and day index
                  />
                </div>
              </div>
            ))}
            <div>
              <button onClick={props.delete? null:handleOnDelete} className="deleteButton">
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      </Zoom>
    </div>
  );
}

export default Habit;
