import { BrowserRouter as Router, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import './App.css';
import './songPage.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer.js';
import Comments from '../components/comments.js';
import Newsletter from '../components/newsletter.js';
import SessionManager from "../SessionManager.js";
import {apiClient, findIframeLink, shuffleArray, getVideoData, handleAPIError, getArtistData, isSquadArtist} from '../global.js';
import Song from "../Song.js";

function SongPage() {
    const { songId } = useParams();
    const [link, setLink] = useState("");
    const [linkComponent, setLinkComponent] = useState("");
    const [songName, setSongName] = useState("");
    let sessionMananger = new SessionManager();
    let userAccount = sessionMananger.getAccount();
    var song = null;
    var muzik = [];

    async function loadContent() {
        console.log("Loading content...");
        if (muzik.length === 0) {
            muzik = await sessionMananger.getMuzik();
            // await getVideoData(muzik);
        }

        if (song === null || song === undefined) {
            //Find song by searching muzik list for songId
            song = muzik.find(elem=>elem.getId()==songId);
        }

        loadFeaturedArtists();

        const linkIndex = song.links.findIndex(findIframeLink);
        if (linkIndex !== -1) {
            // $('#video-sect> iframe').attr("src", song.links[linkIndex]);
            setLink(song.links[linkIndex]);
            setLinkComponent(song.getLinksComponent());
            setSongName(song.name);
        }

        $("#song-view-count").text(song.viewCount);

        await loadRelatedSongs();
        // console.log("Content loaded.");
    }

    async function loadRelatedSongs() {
        let allSongsHTML = "";
        let songCount = 0;
        const maxSongs = 6;
        let relatedSongs = [...muzik];
        shuffleArray(relatedSongs);
        


        for(let i = 0; i < maxSongs && i < relatedSongs.length; i++) {
            let song = relatedSongs[i];
            let thumbnail = (song.thumbnail == null)? "tape_placeholder.jpg" : song.thumbnail;
            if(thumbnail.search("https") == -1) {
                thumbnail = `/${thumbnail}`;
            }

            // console.log(`Songcount = ${songCount}`);
            if (songCount < maxSongs) {
                allSongsHTML += `<a href="/muzik/songs/${song.id}" class="related-video-card">
                                    <div class='video-img' style="background-image: url('${thumbnail}')"></div>
                                    <div>
                                        <h3>${song.name}</h3>
                                        <h4>${song.contributers.join(', ')}</h4>
                                        <h4>${song.viewCount} Views | 0 Likes | 0 shares</h4>
                                    </div>
                                </a>`;
                songCount++;
            }
        };

        // Insert all songs HTML into the page
        $('#related-sect> div').html(allSongsHTML);
    }

    async function loadFeaturedArtists() {
        let artists = "";
        const contributers = await song.getContributers();

        for (const contributer of contributers) {
            if(isSquadArtist(contributer)) {
                // const artistData = await getArtistData(contributer.toLowerCase().replace(/[\s\.-]/g, ""));
                const artistData = await getArtistData(contributer);
                artists += `<a href="/artist/${contributer.toLowerCase().replace(/[\s\.-]/g, "")}" class="artist-card">
                                <div class="artist-img" style="background-color:${artistData.themeColor}"></div>
                                <div>
                                    <h2>${artistData.name}</h2>
                                    <p>From: Pensacola</p>
                                    <p>Age: 23</p>
                                </div>
                                <div class="follow-btn">Follow</div>
                            </a>`;
            }
        }

        $("#video-sect > div:nth-child(2) > div:nth-child(2) > div").html(artists);
    }

  return (
    <div id="SongPage" onLoad={loadContent}>
      <Navbar/>
      <section id='video-sect'>
        <iframe width="560" height="315" src={link} title="YouTube video player" frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <div>
          {linkComponent}
            <div>
                <h2>Featured Artists:</h2>
                <div></div>
            </div>
        </div>
        <div>
          <h2>{songName}</h2>
          <h3><span id='song-view-count'>0</span> Views</h3>
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
        <div id='related-sect'>
          <h2>Related</h2>
          <div></div>
        </div>
        <Comments username={userAccount.getUsername()} songId={songId}/>
      </section>
      <Newsletter/>
      <Footer/>
    </div>
  );
}

export default SongPage;
