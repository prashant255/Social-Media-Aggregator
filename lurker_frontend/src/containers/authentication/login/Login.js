import React from 'react';
// import classes from './Login.module.css';

//TODO: Add Link to instead of href
const Login = () => (
    <form>
        <label>Email id:</label>
        <input type = "email"></input><br />
        <label>Password:</label>
        <input type = "password"></input><br />
        <button type = "submit">LOGIN</button>
        <p>Don't have an account? <a href = "#">Register</a></p>
    </form>
)

export default Login