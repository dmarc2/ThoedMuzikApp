import $ from 'jquery';
import axios from 'axios';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import {Link} from "react-router-dom";
import './signup.css';
import {apiClient} from '../global.js';

const bcrypt = require('bcryptjs');

export default function SignUpPage() {
    const signup = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");
        const password2 = formData.get("retype_password");

        if(!isValidPassword(password)) {
            return false;
        }

        if(password != password2) {
            alert("Passwords do not match!");
            return false;
        }

        let hashedPassword = await encryptPassword(password);

        apiClient.post(`/api/account/signup/${username}/${encodeURIComponent(hashedPassword)}`)
            .then(response => {
                console.log(response);
                if(response.status == 200) {
                    alert("Signup successful");
                    document.location.href = "/signin";
                }
                else {
                    alert("Failed signing up");
                }
                // Handle successful login (e.g., redirect to another page)
            })
            .catch(error => {
                console.error("Error signing up: ", error);
                // Handle login error (e.g., show error message)
            });
    };


    async function encryptPassword(password) {
        const saltRounds = 10; // You can adjust the salt rounds as needed

        return bcrypt.hash(password, saltRounds);
    }

    function isValidPassword(password) {
        return (password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*,.?":<>]/.test(password));
    }

    function checkPassword() {
        let password = $("input[name='password']").val();
        console.log(password);

        if(password.length >= 8) {
            $("#passwordLength-helper").css("border", "2px solid limegreen");
        }
        else {
            $("#passwordLength-helper").css("border", "2px solid red");
        }

        //Check for captial letter
        if(/[A-Z]/.test(password)) {
            $("#capitalLetter-helper").css("border", "2px solid limegreen");
        }
        else {
            $("#capitalLetter-helper").css("border", "2px solid red");
        }

        //Check for special char
        if(/[!@#$%^&*,.?":<>]/.test(password)) {
            $("#specialCharacter-helper").css("border", "2px solid limegreen");
        }
        else {
            $("#specialCharacter-helper").css("border", "2px solid red");
        }
    }

    return (
        <div id="SignUpPage">
            <Navbar/>
            <h1>Sign Up</h1>
            <div>
                <form onSubmit={signup}>
                    <label for="username">Username: </label>
                    <input name='username' type="text" placeholder="Enter Username"></input>
                    <label for="password">Password: </label>
                    <input name='password' type="password" placeholder="Enter Password" onChange={checkPassword}></input>
                    <div>
                        <div id='passwordLength-helper' className='password-help'>Minimum of 8 characters</div>
                        <div id='capitalLetter-helper' className='password-help'>Atleast 1 captial letter</div>
                        <div id='specialCharacter-helper' className='password-help'>Atleast 1 special character</div>
                    </div>
                    <label for="retype_password">Retype Password: </label>
                    <input name='retype_password' type="password" placeholder="Retype Password"></input>
                    <input type="submit" value="Submit"></input>
                    <Link to="/signin">Sign in</Link>
                </form>
            </div>
            <Footer/>
        </div>
    );
}