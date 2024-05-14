import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useLocation } from "react-router-dom";
import InnerHeading from './InnerHeading';

function Profile() {

    //const username = location.state ? location.state.username : null;
    const location = useLocation();
    const username = location.state ? location.state.username : null;
    const [userInfo, setUserInfo] = useState({
        username: '', // User's username
        name: '', // User's name
        job: '' // User's job title
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Fetch user info when the component mounts
        axios.get(`${process.env.SERVER_URL}/api/user/${username}`)
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => console.error('Error fetching user info:', error));
    }, [username]);

    const handleUserInfoChange = (event) => {
        const { name, value } = event.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const updateProfile = (event) => {
        event.preventDefault();
        axios.put(`${process.env.SERVER_URL}/api/user/update`, userInfo,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }})
            .then(response => {
                alert('Profile updated successfully!');
                console.log('Updated user info:', response.data);
                // Optionally, update local state or perform other actions based on response
            })
            .catch(error => {
                console.error('Failed to update profile:', error);
                alert('Failed to update profile.');
            });
    };
    

    const changePassword = (event) => {
        event.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // API call to change password
        axios.post(`${process.env.SERVER_URL}/api/user/change-password`, {
            username:userInfo.username,
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        },{headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }})
            .then(() => alert('Password changed successfully!'))
            .catch(error => console.error('Failed to change password:', error));
    };

    return (
        <div style={{display:"flex", flexDirection:"column",height:"100vh",justifyContent:"center"}}>
            <InnerHeading username={username} />
            <div className='profile'>
            
                <form onSubmit={updateProfile}>
                <h2>Profile</h2>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={userInfo.username}
                            onChange={handleUserInfoChange}
                            placeholder="Username"
                            readOnly
                        />
                    </label>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={userInfo.name}
                            onChange={handleUserInfoChange}
                            placeholder="Full Name"
                        />
                    </label>
                    <label>
                        Job:
                        <input
                            type="text"
                            name="job"
                            value={userInfo.job}
                            onChange={handleUserInfoChange}
                            placeholder="Job Title"
                        />
                    </label>
                    <button type="submit">Update Profile</button>
                </form>

                
                <form onSubmit={changePassword}>
                <h2>Change Password</h2>
                    <label>
                        Old Password:
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Old Password"
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="New Password"
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm New Password"
                        />
                    </label>
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
