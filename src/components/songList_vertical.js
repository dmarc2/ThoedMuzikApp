import { useEffect } from "react";
import { useParams } from "react-router-dom";
import $ from 'jquery';
import Account from "../Account.js";
import SessionManager from "../SessionManager.js";
import Song from "../Song.js";
import {shuffleArray} from '../global.js';

export function SongListVertical(props) {
    let sessionMananger = new SessionManager();
    let userAccount = null;
    let muzik = [];
    let currentIndex = 6;

    useEffect(() => {
        loadContent();
    });

    async function loadContent() {
        if (props.artist != undefined) {
            userAccount = await sessionMananger.getAccount();
            muzik = await sessionMananger.getMuzik();
            if(props.artist != "all") {
                await filterArtistMusik();
            }
            if(props.sorter !== null) {
                props.sorter(muzik);
            }
            else {
                shuffleArray(muzik);
            }
            loadSongs();
        }
    }

    async function filterArtistMusik() {
        let artistSongs = [];
        for(let i = 0;  i < muzik.length; i++) {
            if(muzik[i].getContributers().includes(props.artist)) {
                artistSongs = artistSongs.concat(muzik.slice(i,i+1));
            }
        }
        if(artistSongs.length != 0) {
            muzik = artistSongs;
        }
    }

    function loadMoreSongs() {
        let maxSongs = 6;
        let songCount = 0;
        let html = "";
        for(let i = currentIndex; songCount < maxSongs && i < muzik.length; i++) {
            html += `<a href="/muzik/songs/${muzik[i].id}" class="card-style2">
                        <div class="card-style2-img-placeholder"></div>
                        <div>
                            <h3>${muzik[i].name}</h3>
                            <h4>${muzik[i].contributers.join(', ')}</h4>
                            <h4>${muzik[i].viewCount} Views</h4>
                        </div>
                    </a>`;
            songCount++;
        }
        currentIndex += maxSongs;
        $("#all-songs> div").append(html);
    }

    async function loadSongs() {
        let allSongsHTML = "";
        let songCount = 0;

        muzik.forEach((song, index) => {

            if (songCount < 6) {
                allSongsHTML += `<a href="/muzik/songs/${song.id}" class="card-style2">
                                    <div class="card-style2-img-placeholder"></div>
                                    <div>
                                        <h3>${song.name}</h3>
                                        <h4>${song.contributers.join(', ')}</h4>
                                        <h4>${song.viewCount} Views</h4>
                                    </div>
                                </a>`;
                songCount++;
            }
            else {
                return;
            }
        });

        // Insert all songs HTML into the page
        $('#'+props.id+'> div').html(allSongsHTML);
    }

    return (
        <section id={props.id} className='card-showcase'>
            <h2 className='section-title'>{props.title}</h2>
            <div></div>
            <button onClick={loadMoreSongs}>See More</button>
        </section>
    );
}