import { useEffect } from "react";
import {Link} from "react-router-dom";
import $ from 'jquery';
// import { showProfileLinkPopup } from "../global.js";
// import "../global.js";

// function ConfirmationDialog({ message, onConfirm, onCancel }) {
//     return (
//         <div className="confirmation-dialog">
//             <p>{message}</p>
//             <button onClick={onConfirm}>OK</button>
//             <button onClick={onCancel}>Cancel</button>
//         </div>
//     );
// }
// function App() {
//     const [showDialog, setShowDialog] = useState(false);

//     const handleDelete = () => {
//         setShowDialog(true);
//     };

//     const handleConfirm = () => {
//         setShowDialog(false);
//         console.log('Confirmed!');
//         // Perform the action here
//     };

//     const handleCancel = () => {
//         setShowDialog(false);
//         console.log('Cancelled!');
//     };

//     return (
//         <div>
//             <button onClick={handleDelete}>Delete</button>
//             {showDialog && (
//                 <ConfirmationDialog
//                     message="Are you sure you want to delete this?"
//                     onConfirm={handleConfirm}
//                     onCancel={handleCancel}
//                 />
//             )}
//         </div>
//     );
// }

function Navbar() {
    useEffect(()=> {
        if(userHasSignedIn()) {
            addAccountNavOption();
        }
    });

    /*
        Function used to check if an account is an admin.
    */
    function userIsAdmin() {
        if(sessionStorage.getItem("account") == null) return false;

        if(JSON.parse(sessionStorage.getItem("account")).type == "admin") {
            return true;
        }

        return false;
    }

    /*
        Function used to check if an account has been signed in.
    */
    function userHasSignedIn() {
        if(sessionStorage.getItem("account") != null) {
            // console.log(sessionStorage.getItem("account"));
            return true;
        }
        return false;
    }

    /*
        Function used to replace the signin nav option with the account option 
        while implementing event handlers.
    */
    function addAccountNavOption() {
        $("nav> ul:nth-child(3)> li:last-child").html("<a class='nav-profile-link' href='#'></a>");
        $(".nav-profile-link").on("click", function(event) {
            event.preventDefault();
            toggleProfileLinkPopup();
        });

        $("nav> ul:nth-child(5)> li:last-child").html("<a href='#'>Account</a>");
        $("#root > div > nav > ul:nth-child(5) > li:nth-child(6) > a").on("click", function(event) {
            event.preventDefault();
            toggleMobileProfileLinkPopup();
        });
    }

    /*
        Function used to add the adminPanel option to the account option popup.
    */
    function addAdminPanelOption() {
        $(".nav-profile-link-popup> ul> li:first-child").after("<li>Admin Panel</li>");
        $(".nav-profile-link-popup> ul> li:nth-child(2)").on("click", function(event) {
            event.preventDefault();
            openPage("/adminPanel");
        });
    }

    function toggleMobileProfileLinkPopup() {
        if($(".nav-mobile-account-dropdown").length) {
            $(".nav-mobile-account-dropdown").remove();
        }
        else {
            let popup = `<li class='nav-mobile-dropdown nav-mobile-account-dropdown'>
                <ul>
                    <li>Profile</li>
                    <li>Order History</li>
                    <li>Sign out</li>
                </ul>
            </li>`;
            $("#root > div > nav > ul:nth-child(5)").append(popup);

            if(userIsAdmin()) {
                // addAdminPanelOption();
                $(".nav-mobile-account-dropdown> ul> li:first-child").after("<li>Admin Panel</li>");
                $(".nav-mobile-account-dropdown> ul> li:nth-child(2)").on("click", function(event) {
                    event.preventDefault();
                    openPage("/adminPanel");
                });
            }

            //Add event listeners
            $(".nav-mobile-account-dropdown> ul> li:nth-child(1)").on("click", function(event) {
                event.preventDefault();
                openPage("/profile");
            });

            $(".nav-mobile-account-dropdown> ul> li:last-child").on("click", function(event) {
                event.preventDefault();
                signOut();
            });
        }
    }

    function toggleProfileLinkPopup() { 
        if($(".nav-profile-link-popup").length) {
            $(".nav-profile-link-popup").remove();
        }
        else {
            let popup = `<div class='nav-profile-link-popup'>
                <ul>
                    <li>Profile</li>
                    <li>Order History</li>
                    <li>Sign out</li>
                </ul>
            </div>`;
            $("nav> ul:nth-child(3)> li:last-child").append(popup);

            if(userIsAdmin()) {
                addAdminPanelOption();
            }

            //Add event listeners
            $(".nav-profile-link-popup> ul> li:nth-child(1)").on("click", function(event) {
                event.preventDefault();
                openPage("/profile");
            });

            $(".nav-profile-link-popup> ul> li:last-child").on("click", function(event) {
                event.preventDefault();
                signOut();
            });
        }
    }

    function openPage(pageLink) {
        document.location.href = pageLink;
    }

    function signOut() {
        sessionStorage.removeItem('account');
        alert("You've successfully signed out.");
        document.location.href = "/";
    }

    function showMobileNav() {
        $("nav> div:nth-child(4)").after(
        `<ul>
            <li>
                <h1>THOED MUZIK</h1>
                <h1 onClick="document.querySelector('nav> ul:nth-child(5)').remove()">X</h1>
            </li>
            <li>
                <a href="/" onClick="document.querySelector('nav> ul:nth-child(5)').remove()">Home</a>
            </li>
            <li>
                <a href="/artists" onClick="document.querySelector('nav> ul:nth-child(5)').remove()">Artists</a>
            </li>
            <li>
                <a href="/muzik" onClick="document.querySelector('nav> ul:nth-child(5)').remove()">Muzik</a>
            </li>
            <li>
                <a href="#" onClick="document.querySelector('nav> ul:nth-child(5)').remove()">Shop</a>
            </li>
            <li>
                <a href="/signin" onClick="document.querySelector('nav> ul:nth-child(5)').remove()">Sign in</a>
            </li>
        </ul>`);

        if(userHasSignedIn()) {
            addAccountNavOption();
        }
    }

    return (
      <nav>
        <img src="/squad_mushroom_logo_trans.png" alt="The Squad Logo"></img>
        <h1>THOED MUZIK</h1>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/artists">Artists</Link>
            </li>
            <li>
                <Link to="/muzik">Muzik</Link>
            </li>
            <li>
                <Link to="#">Shop</Link>
            </li>
            <li>
                <Link to="/signin">Sign in</Link>
            </li>
        </ul>

        {/* Mobile version nav */}
        <div>
            <img src="/squad_mushroom_logo_trans.png" alt="The Squad Logo"></img>
            <h1>THOED MUZIK</h1>
            <img src="/hamburger.png" alt="See Navigation" onClick={showMobileNav}></img>
        </div>
      </nav>
    );
}

export default Navbar;