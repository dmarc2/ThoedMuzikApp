import Navbar from '../components/navbar.js';
import Newsletter from '../components/newsletter.js';
import Footer from '../components/footer.js';
import {SongListHorizontal} from "../components/songList_horizontal.js";
import {SongListVertical} from "../components/songList_vertical.js";
import {SlideShow} from "../components/slideshow.js";
import $ from 'jquery';
import './artist.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SessionManager from "../SessionManager.js";
import {apiClient, getArtistData, sortOnDate, sortOnViews} from '../global.js';

export default function Artist() {
    const { name } = useParams();
    const [artistData, setArtistData] = useState({});
    const [slides, setSlides] = useState([]);
    let sessionMananger = new SessionManager();
    let userAccount = null;
    let muzik = [];
    let latestSongs = [];
    let mostViewedSongs = [];

    // useEffect(() => {
    //     loadContent();
    // }, []);

    async function loadContent() {
      let data = await getArtistData(getArtistNameFromParams());

      setArtistData(data);

        if (artistData.name != undefined) {
            userAccount = await sessionMananger.getAccount();
            muzik = await sessionMananger.getMuzik();

            setSlides(artistData.slides_json);

            await filterArtistMusik(muzik);
            shuffleArray(muzik);
            mostViewedSongs = [...muzik];
            latestSongs = [...muzik];

            await sortOnViews(mostViewedSongs);
            await sortOnDate(latestSongs);
            await loadSongs();

            await loadCTAs();
        }
    }

    function loadCTAs() {
        if(artistData.cta_json !== null) {
            let content = "";
            for(let i = 0; i < artistData.cta_json.length; i++) {
                content += `<p>${artistData.cta_json[i].text}</p>`;
            }

            $("header> div:last-child> div:nth-child(3)").html(content);

            for(let i = 0; i < artistData.cta_json.length; i++) {
                $("#artist > header > div:nth-child(2) > div > p:nth-child("+(i+1)+")").on("click", ()=>{
                    if(artistData.cta_json[i].link !== "") {
                        window.open(artistData.cta_json[i].link, "_blank");
                    }
                })
            }
        }
    }

    function getArtistNameFromParams() {
        let artistName = "";
        switch (name) {
            case "ebby":
                artistName = "Ebby";
                break;
            case "emj":
                artistName = "Em. J.";
                break;
            case "reece":
                artistName = "Reece";
                break;
            case "tee":
                artistName = "Tee";
                break;
            case "tdizzle":
                artistName = "T-Dizzle";
                break;
            case "danielmac":
                artistName  = "Daniel Mac";
                break;
            case "nate":
                artistName  = "Nate";
                break;
            case "dmarc":
                artistName  = "D-Marc";
                break;
            default:
              break;
        }
        return artistName;
    }

    // async function getArtistSlides() {
    //     const r = await apiClient.get("/api/artist/"+artistData.name+"/slides");
    //     console.log("Fetched slides data:", r.data);

    //     if(r.data.length == 0) {
    //         return [];
    //     }
        
    //     let slides_json = JSON.parse(r.data[0].slides_json);

    //     return slides_json;
    // }

    async function filterArtistMusik(list) {
        let artistSongs = [];
        for(let i = 0;  i < list.length; i++) {
            if(list[i].getContributers().includes(artistData.name)) {
                artistSongs = artistSongs.concat(list.slice(i,i+1));
            }
        }
        if(artistSongs.length != 0) {
            muzik = artistSongs;
        }
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    return(
        <div id="artist" onLoad={loadContent}>
            <Navbar/>
            <header style={artistData.heroBgColorStyle}>
                <div>
                    <img src={"/"+artistData.personalHeroImgUrl} alt={artistData.heroImgAlt}></img>
                </div>
                <div>
                    <h1>"{artistData.quote}"</h1>
                    <h1>- {(artistData.name != undefined)? artistData.name.toUpperCase():""}</h1>
                    <div>
                    </div>
                    <div>
                        <a href={(artistData.facebook_link !== null)? artistData.facebook_link:""} id="facebook-icon" target='_blank' onClick={(event)=>console.log(event.target.closest("a").getAttribute("href"))}></a>
                        <a href={(artistData.instagram_link !== null)? artistData.instagram_link:""} id="instagram-icon" target='_blank'></a>
                        <a href={(artistData.youtube_link !== null)? artistData.youtube_link:""} id="youtube-icon" target='_blank'></a>
                    </div> 
                </div>
            </header>
            <SlideShow slides={slides}/>
            <SongListHorizontal id="latest-sect" title="Latest" artist={artistData.name} sorter={sortOnDate}/>
            <SongListHorizontal id="most-viewed-sect" title="Most Viewed" artist={artistData.name} sorter={sortOnViews}/>
            <SongListVertical id="all-songs" title="All Songs" artist={artistData.name} sorter={null}/>
            <Newsletter/>
            <Footer/>
        </div>
    );
}