import axios from 'axios';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import Account from '../Account.js';
import {Link} from "react-router-dom";
import './signin.css';
import {apiClient} from '../global.js';

export default function SignInPage() {
    const login = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        apiClient.post(`/api/account/login/${username}/${encodeURIComponent(password)}`)
            .then(response => {
                console.log(response);
                if(response.data.length == 1) {
                    console.log("Login successful:", response.data);
                    let account = new Account(response.data[0].type, response.data[0].username, response.data[0].for_artist)
                    console.log("Account loging in: " + JSON.stringify(account));
                    sessionStorage.setItem("account", JSON.stringify(account));
                    document.location.href = "/";
                }
                else {
                    console.error("Failed logging in");
                }
            // Handle successful login (e.g., redirect to another page)
            })
            .catch(error => {
                console.error("Error logging in:", error);
                // Handle login error (e.g., show error message)
            });
    };

    return (
        <div id="SignInPage">
            <Navbar/>
            <h1>Sign In</h1>
            <div>
                <form method='POST' onSubmit={login}>
                    <label for="username">Username: </label>
                    <input name='username' type="text" placeholder="Enter Username"></input>
                    <label for="password">Password: </label>
                    <input name='password' type="text" placeholder="Enter Password"></input>
                    <input type="submit" value="Submit"></input>
                    <Link to="/signup">Sign up</Link>
                </form>
            </div>
            <Footer/>
        </div>
    );
}