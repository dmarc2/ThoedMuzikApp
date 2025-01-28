import { BrowserRouter as Router, Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import $ from 'jquery';
import './App.css';
import './tapeIndex.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer.js';
import Newsletter from '../components/newsletter.js';
import Tape from "../Tape.js";
import Song from "../Song.js";
import {apiClient, getVideoData, handleAPIError} from '../global.js';
import SessionManager from "../SessionManager.js";

export default function TapeIndex() {
    const { tapeType } = useParams();
    const { tapeId } = useParams();
    const [tapeName, setTapeName] = useState("");
    let sessionMananger = new SessionManager();
    var tape = null;
    var songList = [];

    async function loadContent() {
        if (tape === null) {
            console.log("Fetching tape...");
            await fetchMuzik();

            console.log(tape.getSongs());
            // await getVideoData(tape.getSongs());
            await loadSongs();
        }

        const thumbnail = (tape.thumbnail == null)? "tape_placeholder.jpg" : tape.thumbnail;
        if(thumbnail.search("https") != -1) {
            $("#tape-cover").attr("style", `background-image:url('${thumbnail}')`)
        }
        else {
            $("#tape-cover").attr("style", `background-image:url('/${thumbnail}')`)
        }

        setTapeName(tape.name);
        console.log("Content loaded.");
    }

    async function fetchMuzik() {
        let tapes = await sessionMananger.getTapes();
        tape = tapes.find(tape => tape.getId() == tapeId && tape.getType() == tapeType);
    }

    async function loadSongs() {
        $(".related-video-card").remove();
        let allSongsHTML = "";
        // let songCount = 0;
        // const maxSongs = 6;

        let thumbnail = (tape.thumbnail == null)? "tape_placeholder.jpg" : tape.thumbnail;
        if(thumbnail.search("https") == -1) {
            thumbnail = `/${thumbnail}`;
        }

        tape.getSongs().forEach((song) => {
                allSongsHTML += `<a href="/muzik/songs/${song.id}" class="related-video-card">
                                    <div class='video-img' style="background-image: url('${thumbnail}')"></div>
                                    <div>
                                        <h3>${song.name}</h3>
                                        <h4>${song.contributers.join(', ')}</h4>
                                        <h4>${song.viewCount} Views | 0 Likes | 0 shares</h4>
                                    </div>
                                </a>`;
        });

        // Insert all songs HTML into the page
        $('#tape-songs-list').html(allSongsHTML);
    }

    return (
        <div id="TapeIndex" onLoad={loadContent}>
        <Navbar/>
        <section id='tape-index-hero'>
            <div>
                <div id='tape-cover'></div>
                <div>
                    <h2>{tapeName}</h2>
                    <h3>Creator: Artist Name</h3>
                    {/* <div>
                        <div className='video-profile-img'></div>
                        <div>
                        <h3>Username</h3>
                        <p>999k followers</p>
                        </div>
                        <div className='follow-btn'>Follow</div>
                        <div>
                        <div className='like-btn'>Like</div>
                        <div className='share-btn'>Share</div>
                        </div>
                    </div> */}
                </div>
            </div>
            <div>
            <ul id='tape-songs-list'>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
                </div>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
                </div>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
                </div>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
                </div>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
                </div>
                <div className='related-video-card'>
                    <div className='video-img'></div>
                    <div>
                    <h3>Video title</h3>
                    <h3>Username</h3>
                    <p>Views | Likes | Shares</p>
                    </div>
            </div>
            </ul>
            </div>
        </section>
        <Newsletter/>
        <Footer/>
        </div>
    );
}