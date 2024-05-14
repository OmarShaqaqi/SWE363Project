import React, { useState } from "react";
import Input from "./Input";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import Heading from "./Heading";

function Register() {

     const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        job: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Optionally clear errors as user types
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Check required fields
        Object.entries(formData).forEach(([key, value]) => {
            if (!value.trim()) {
                newErrors[key] = `${key[0].toUpperCase() + key.slice(1)} is required`; // Capitalize first letter
                isValid = false;
            }
        });

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {

            const userData = {
                username: formData.username,
                password: formData.password,
                name: formData.name,
                job: formData.job
            };
    
            // POST request using Axios inside the Register component
            axios.post('http://localhost:4000/api/register',{
                username: formData.username,
                password: formData.password,
                name: formData.name,
                job: formData.job
            } ,{
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
          })
            .then(response => {
                alert("Registration successful!");
                navigate("/login");
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error during registration:', error.response.data);
                alert("An error occurred during registration!");
            });
        }
    };

    return (
        <div>
            <Heading />
            <form className="form" onSubmit={handleSubmit}>
            <Input type="text" placeholder="Username" name="username" value={formData.username} change={value => handleChange('username', value)} />
            {errors.username && <p className="error">{errors.username}</p>}
            
            <Input type="text" placeholder="Full Name" name="name" value={formData.name} change={value => handleChange('name', value)} />
            {errors.name && <p className="error">{errors.name}</p>}
            
            <Input type="text" placeholder="Job Title" name="job" value={formData.job} change={value => handleChange('job', value)} />
            {errors.job && <p className="error">{errors.job}</p>}
            
            <Input type="password" placeholder="Password" name="password" value={formData.password} change={value => handleChange('password', value)} />
            {errors.password && <p className="error">{errors.password}</p>}
            
            <Input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} change={value => handleChange('confirmPassword', value)} />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            
            <button className="button" type="submit">Register</button>
        </form>




        </div>
        
    );
}

export default Register; 
