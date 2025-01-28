import { useEffect } from "react";
import { useParams } from "react-router-dom";
import $ from 'jquery';
import SessionManager from "../SessionManager.js";
import {findIframeLink, shuffleArray} from '../global.js';

export function SongListHorizontal(props) {
    let sessionMananger = new SessionManager();
    let userAccount = null;
    let muzik = [];
    let currentIndex = 0;

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

    function sideScrollHandler(direction) {
        const deltaScroll = 4;
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
        if(sectChange >= 0 && sectChange < muzik.length) {
            currentIndex = sectChange;
        }
    }

    function updateSection() {
        const maxCards = 4;
        let count = 0;
        let updateHTML = "";
        console.log("updating section " + props.id);

        for(let i = currentIndex; count < maxCards && i < muzik.length; i++) {
            const linkIndex = muzik[i].links.findIndex(findIframeLink);
            updateHTML += `<a href="/muzik/songs/${muzik[i].id}" class="card-style1">
                                <iframe width="560" height="315" src="${muzik[i].links[linkIndex]}" title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <h3>${muzik[i].name}</h3>
                                <p>${muzik[i].contributers.join(', ')}</p>
                                <p>${muzik[i].viewCount} Views</p>
                            </a>`;
            count++;
        }

        $('#'+props.id+'> div> div:nth-child(2)').html(updateHTML);
    }

    async function loadSongs() {
        let songsHTML = "";
        let songCount = 0;
        const maxSongs = 4;

        for(let i = 0; songCount < maxSongs && i < muzik.length; i++) {
            const linkIndex = muzik[i].links.findIndex(findIframeLink);
            songsHTML += `<a href="/muzik/songs/${muzik[i].id}" class="card-style1">
                                <iframe width="560" height="315" src="${muzik[i].links[linkIndex]}" title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                <h3>${muzik[i].name}</h3>
                                <p>${muzik[i].contributers.join(', ')}</p>
                                <p>${muzik[i].viewCount} Views</p>
                            </a>`;
            songCount++;
        }
        songCount = 0;

        // Insert songs HTML into the page
        $('#'+props.id+'> div> div:nth-child(2)').html(songsHTML);
    }

    return (
        <section id={props.id} className='card-showcase'>
            <h2 className='section-title'>{props.title}<div><div className='left-btn-style1' onClick={()=>sideScrollHandler("left")}>&lt;</div><div className='right-btn-style1' onClick={()=>sideScrollHandler("right")}>&gt;</div></div></h2>
            <div>
                <div className='left-btn-style1' onClick={()=>sideScrollHandler("left")}>&lt;</div>
                <div>
                    {/* <div className='card-style1'>
                        <iframe width="560" height="315" src="" title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        <h3>Song Name</h3>
                        <p>Artist Name</p>
                        <p>Views</p>
                    </div>
                    <div className='card-style1'>
                        <iframe width="560" height="315" src="" title="YouTube video player" frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        <h3>Song Name</h3>
                        <p>Artist Name</p>
                        <p>Views</p>
                    </div>
                    <div className='card-style1'>
                        <div className='img-demo'></div>
                        <h3>Song Name</h3>
                        <p>Artist Name</p>
                        <p>Views</p>
                    </div>
                    <div className='card-style1'>
                        <div className='img-demo'></div>
                        <h3>Song Name</h3>
                        <p>Artist Name</p>
                        <p>Views</p>
                    </div> */}
                </div>
                <div className='right-btn-style1' onClick={()=>sideScrollHandler("right")}>&gt;</div>
            </div>
        </section>
    );
}