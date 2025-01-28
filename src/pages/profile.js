import axios from 'axios';
import Navbar from '../components/navbar.js';
import Newsletter from '../components/newsletter.js';
import Footer from '../components/footer.js';
import './profile.css';
import { useEffect, useState } from 'react';
import SessionManager from '../SessionManager.js';
import {apiClient} from '../global.js';

export default function Profile() {
    const [username, setUsername] = useState("");
    let sessionMananger = new SessionManager();
    let userAccount = null;

    useEffect(() => {
        userAccount = sessionMananger.getAccount();

        if(userAccount.getType() != "visitor") {
            setUsername(userAccount.getUsername());
        }
        else {
            document.location.href = "/";
        }
        
    });

    function removeAccount() {
        if(window.confirm("You are about to delete your account?")) {
            apiClient.post(`/api/account/delete/${username}`)
                .then(response => {
                    console.log(response);
                    if(response.status == 200) {
                        console.log("Account successfully removed:", response.data);
                        alert("Account successfully removed");

                        sessionStorage.removeItem("account");

                        document.location.href = "/";
                    }
                    else {
                        console.error("Failed Removing Account");
                    }
                // Handle successful login (e.g., redirect to another page)
                })
                .catch(error => {
                console.error("Error Removing Account:", error);
                // Handle login error (e.g., show error message)
                });
        }
    }

    return (
        <div id="Profile">
            <Navbar/>
            <div id='account-settings'>
                <h2>Account Settings</h2>
                <div>
                    <aside>
                        <ul>
                            <li>My Profile</li>
                            <li>Security</li>
                            <li>Billing</li>
                            <li onClick={removeAccount}>Delete Account</li>
                        </ul>
                    </aside>
                    <div>
                        <h3>My Profile</h3>
                        <div>
                            <div className='profile-img'></div>
                            <div>
                                <h4>{username}</h4>
                            </div>
                            <button>Edit</button>
                        </div>
                    </div>
                </div>
            </div>
            <Newsletter/>
            <Footer/>
        </div>
    );
}