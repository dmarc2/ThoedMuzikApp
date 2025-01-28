import SessionManager from "./SessionManager.js";
import AdminController from "./AdminController.js";

class Account {
    constructor(type, username, forArtist = null) {
        this.type = type;
        this.username = username;
        this.forArtist = forArtist;
        this.adminController = new AdminController(this.id);
    }

    getType() {
        return this.type;
    } 

    getUsername() {
        return this.username;
    }
}

export default Account;