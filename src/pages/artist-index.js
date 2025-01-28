import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import './artist-index.css';

export default function ArtistIndex() {
    return (
        <div id="artist-index">
            <Navbar/>
            <div>
                <Link to="/artist/ebby" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#7B4B94"}}></div>
                    <div>
                        <h2>Ebby</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/emj" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#B27092"}}></div>
                    <div>
                        <h2>Em. J.</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/reece" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#950C15"}}></div>
                    <div>
                        <h2>Reece</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/tee" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#E5E7E6"}}></div>
                    <div>
                        <h2>Tee</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/tdizzle" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#FBB13C"}}></div>
                    <div>
                        <h2>T-Dizzle</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/danielmac" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#849324"}}></div>
                    <div>
                        <h2>Daniel</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/nate" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#1A659E"}}></div>
                    <div>
                        <h2>Nate</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
                <Link to="/artist/dmarc" className="artist-card">
                    <div className="artist-img" style={{"backgroundColor": "#14342B"}}></div>
                    <div>
                        <h2>D-Marc</h2>
                        <p>From: Pensacola</p>
                        <p>Age: 23</p>
                    </div>
                    <div className="follow-btn">Follow</div>
                </Link>
            </div>
            <Footer/>
        </div>
    );
}