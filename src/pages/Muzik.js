import Navbar from "../components/navbar";
import Newsletter from '../components/newsletter.js';
import Footer from '../components/footer.js';
import axios from 'axios';
import $ from 'jquery';
import './App.css';
import './Muzik.css';
import { useState, useEffect } from "react";
import Account from "../Account.js";
import {SongListHorizontal} from "../components/songList_horizontal.js";
import {SongListVertical} from "../components/songList_vertical.js";
import SessionManager from "../SessionManager.js";
import {SlideShow} from "../components/slideshow.js";
import Tape from "../Tape.js";
import Song from "../Song.js";
import {sortOnDate, sortOnViews, shuffleArray} from '../global.js';

export default function Muzik() {
    let sessionMananger = new SessionManager();
    let userAccount = null;
    let muzik = [];
    let tapes = [];
    let latestSongs = [];
    let mostViewedSongs = [];
    let allSongsSectIndex = 6;
    let currentIndex = 0;

    useEffect(() => {
        loadContent();
    }, []);

    async function loadContent() {
        userAccount = await sessionMananger.getAccount();
        muzik = await sessionMananger.getMuzik();
        tapes = await sessionMananger.getTapes();
        console.log(tapes);
        shuffleArray(tapes);
        shuffleArray(muzik);
        mostViewedSongs = muzik.slice();
        latestSongs = muzik.slice();
        await sortOnViews(mostViewedSongs);
        await sortOnDate(latestSongs);
        await loadTapes();
        await loadSongs();
    }

    async function loadTapes() {
        let tapesHTML = "";
        let tapeCount = 0;
        const maxTapes = 6;

        for(let i = 0; tapeCount < maxTapes && i < tapes.length; i++) {
            const thumbnail = (tapes[i].thumbnail == null)? "tape_placeholder.jpg" : tapes[i].thumbnail;
            tapesHTML += `<a href="/muzik/tapes/${tapes[i].type}/${tapes[i].id}" class="album-mixtape-placeholder" style="background-image:url('${thumbnail}')"></a>`;
            tapeCount++;
        }

        $('#albums-mixtapes> div> div:nth-child(2)').html(tapesHTML);
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
        $('#all-songs> div').html(allSongsHTML);
    }

    function loadMoreSongs() {
        let maxSongs = 6;
        let songCount = 0;
        let html = "";
        for(let i = allSongsSectIndex; songCount < maxSongs && i < muzik.length; i++) {
            html += `<a href="/muzik/songs/${muzik[i].id}" class="card-style2">
                        <div class="card-style2-img-placeholder"></div>
                        <div>
                            <h3>${muzik[i].name}</h3>
                            <h4>${muzik[i].contributers.join(', ')}</h4>
                            <h4>${muzik[i].viewCount}</h4>
                        </div>
                    </a>`;
            songCount++;
        }
        allSongsSectIndex += maxSongs;
        $("#all-songs> div").append(html);
    }

    function sideScrollHandler(direction) {
        const deltaScroll = 6;
        if(direction.toLowerCase() == "left") {
            updateSectionIndex(-deltaScroll);
        }
        else if(direction.toLowerCase() == "right") {
            updateSectionIndex(deltaScroll);
        }
        updateSection();
    }

    function updateSectionIndex(deltaIndex) {
        let sectChange = currentIndex + deltaIndex;
        if(sectChange >= 0 && sectChange < tapes.length) {
            currentIndex = sectChange;
        }
    }

    function updateSection() {
        let tapesHTML = "";
        let tapeCount = 0;
        const maxTapes = 6;

        for(let i = currentIndex; tapeCount < maxTapes && i < tapes.length; i++) {
            const thumbnail = (tapes[i].thumbnail == null)? "tape_placeholder.jpg" : tapes[i].thumbnail;
            tapesHTML += `<a href="/muzik/tapes/${tapes[i].type}/${tapes[i].id}" class="album-mixtape-placeholder" style="background-image:url('${thumbnail}')"></a>`;
            tapeCount++;
        }

        $('#albums-mixtapes> div> div:nth-child(2)').html(tapesHTML);
    }
    
    
    return (
        <div id="Muzik">
            <Navbar/>
            <SlideShow slides={[]}/>
            <div id="albums-mixtapes">
                <h2 className='section-title'>Albums & Mixtapes<div><div className='left-btn-style1' onClick={()=>sideScrollHandler("left")}>&lt;</div><div className='right-btn-style1' onClick={()=>sideScrollHandler("right")}>&gt;</div></div></h2>
                <div>
                    <div className='left-btn-style1' onClick={()=>sideScrollHandler("left")}>&lt;</div>
                    <div>
                    </div>
                    <div className='right-btn-style1' onClick={()=>sideScrollHandler("right")}>&gt;</div>
                </div>
            </div>
            <SongListHorizontal id="latest-sect" title="Latest" artist="all" sorter={sortOnDate}/>
            <SongListHorizontal id="most-viewed-sect" title="Most Viewed" artist="all" sorter={sortOnViews}/>
            <SongListVertical id="all-songs" title="All Songs" artist="all" sorter={null}/>
            <Newsletter/>
            <Footer/>
        </div>
    );
}