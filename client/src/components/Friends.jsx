import React, { useState } from 'react';
import axios from 'axios';
import InnerHeading from "./InnerHeading"
import { useLocation } from "react-router-dom";
import HabitTracker from './HabitTracker';

function FriendManager() {
    const [friends, setFriends] = useState([]);
    const [friendId, setFriendId] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const username = location.state ? location.state.username : null;
    console.log(username);


    React.useEffect(() => {
        const fetchFriends = async () => {
            if (username) {
                const friendsList = await addFriendsHabits();
                setFriends(friendsList);
                console.log("This is friends");
                console.log(friendsList);
            }
        };

        fetchFriends();
    }, [username]);


    async function addFriendsHabits(){
        const result = await axios.post(`${process.env.SERVER_URL}/api/friends/get`,{ user_id: username },{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        console.log("This is the get method")
        console.log(typeof(result.data))

        let tempFrinds = []
        if(result.data.length > 0){
            console.log(result.data.length)
            for(let friend in result.data) {
                tempFrinds.push(result.data[friend].friend_id)
            }
            console.log(tempFrinds)
            return tempFrinds
        }
        return []
    }

    const handleAddFriend = () => {
        axios.post(`${process.env.SERVER_URL}/api/friends/add`, { user_id: username, friend_id: friendId },{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                setMessage(response.data);
                alert(response.data)

            })
            .catch(error => {
                setMessage(error.response.data);
                alert(error.response.data)
            });
    };

    const handleDeleteFriend = () => {
        axios.delete(`${process.env.SERVER_URL}/api/friends/delete`,  { user_id: username, friend_id: friendId } ,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                setMessage(error.response.data);
            });
    };

    return (
        <div className='main'>
            <InnerHeading username = {username}/>
             <h1>Manage Friends</h1>

            <div>
                <div>
                <input
                    type="text"
                    placeholder="Friend's User ID"
                    value={friendId}
                    onChange={e => setFriendId(e.target.value)}
                />
                </div>
                <div style={{display:"flex",flexDirection:"column", width:"10rem",justifyContent:"space-evenly", alignContent:"space-around",margin:"auto"}}>
                <button onClick={handleAddFriend}>Add Friend</button>
                <button onClick={handleDeleteFriend}>Delete Friend</button>
                
                </div>
                 
            </div>

            {friends.map(friend => (<div> 
                <h1>friend username {friend}</h1>
                <HabitTracker key={friend.friend_id} username={friend} add={false} check={true} delete={true} />
            </div>
   
))}

           
            

            <p>{message}</p>
        </div>
    );
}

export default FriendManager;
