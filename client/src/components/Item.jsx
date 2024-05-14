import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Zoom from '@mui/material/Zoom';

// or



function Item(props){


    function handleOnDelete() {
        props.onDelete(props.name)
    }
    return(
        <Zoom in={true}>
        <li>
        <div className="listDivider">
            <div className="itemText">{props.name}</div>
            
            <div><button onClick={handleOnDelete}className="deleteButton"><DeleteIcon /></button></div>
            
        </div>
      </li>
      </Zoom>
      
    );
}


export default Item;