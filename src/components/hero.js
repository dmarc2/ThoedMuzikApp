import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import {getArtistData} from '../global.js';

export default function Hero() {
    const [artistData, setArtistData] = useState({});
    let heroTimeout = null;
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsFirstLoad(false);
            const data = await getArtistData("Ebby");
            setArtistData(data);
        };

        if(isFirstLoad)
            fetchData();

    }, [isFirstLoad]);

    useEffect(() => {
        const intervalId = setInterval(autoScrollHero, 10000); // Repeat the function every 30 seconds
        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [artistData]);

    function autoScrollHero() {
        if(heroTimeout == null)
        // heroTimeout = setTimeout(changeToNextHero, 10000); // Repeat the function every 30 seconds
        heroTimeout = setInterval(changeToNextHero, 10000); // Repeat the function every 30 seconds
        changeToNextHero();
    }

    function changeToNextHero() {
        let nextElem = $('.App-header> .index-wheel> .dot.selected').next(".dot");
        if(nextElem.length === 0)
            nextElem = $('.App-header> .index-wheel> .dot:first-child');

        let nextHero = nextElem.attr("name");
        $('.App-header> .index-wheel> .dot.selected').removeClass("selected");
        $('.App-header> .index-wheel> .dot[name="'+nextHero+'"]').addClass('selected');
        changeHero(nextHero);
        // clearTimeout(heroTimeout);
        clearInterval(heroTimeout);
    }

    async function changeHero(nameArg) {
        setArtistData(await getArtistData(nameArg));
        console.log(artistData);
    }

    function getArtistLink() {
        let link = "/artist/";
        switch(artistData.name) {
        case "Ebby":
            link += "ebby";
            break;
        case "Em. J.":
            link += "emj";
            break;
        case "Reece":
            link += "reece";
            break;
        case "Tee":
            link += "tee";
            break;
        case "T-Dizzle":
            link += "tdizzle";
            break;
        case "Daniel Mac":
            link += "danielmac";
            break;
        case "Nate":
            link += "nate";
            break;
        case "D-Marc":
            link += "dmarc";
            break;
        default:
            link += "ebby";
        }
        return link;
    }

    function handleIndexWheelMouseEnter(e) {
        e.target.innerHTML = '<div class="index-wheel-hover"><h2>' + e.target.getAttribute('name') + '</h2></div>';
    }
    function handleIndexWheelMouseLeave(e) {
        e.target.innerHTML = '';
    }
    function handleIndexWheelClick(e) {
        $('.dot.selected').removeClass('selected');
        let name = e.target.getAttribute('name');
        e.target.classList.add('selected');
        changeHero(name);
        clearTimeout(heroTimeout);
    }

    function addCtas() {
        if(artistData.cta_json) {
            return (
                <div>
                    <p onClick={() => {
                    if(artistData.cta_json[0].link !== "") {
                        window.open(artistData.cta_json[0].link, "_blank");
                    }
                    }}>{(artistData.cta_json[0] !== undefined) ? artistData.cta_json[0].text : ""}</p>

                    <p onClick={() => {
                    if(artistData.cta_json[1].link !== "") {
                        window.open(artistData.cta_json[1].link, "_blank");
                    }
                    }}>{(artistData.cta_json[1] !== undefined) ? artistData.cta_json[1].text : ""}</p>

                    <p onClick={() => {
                    if(artistData.cta_json[2].link !== "") {
                        window.open(artistData.cta_json[2].link, "_blank");
                    }
                    }}>{(artistData.cta_json[2] !== undefined) ? artistData.cta_json[2].text : ""}</p>
                </div>
            );
        }
        return (
            <div>
            </div>
        );
    }

    return (
      <header className="App-header" style={artistData.heroBgColorStyle}>
          <div className='index-wheel'>
            <div name="Ebby" className='dot selected' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="Em. J." className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="Reece" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="Tee" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="T-Dizzle" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="Daniel Mac" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="Nate" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
            <div name="D-Marc" className='dot' onMouseEnter={handleIndexWheelMouseEnter} onMouseLeave={handleIndexWheelMouseLeave} onClick={handleIndexWheelClick}></div>
          </div>
          <div>
                <div>
                    <a href={(artistData.facebook_link !== null)? artistData.facebook_link:""} id="facebook-icon" target='_blank' onClick={(event)=>console.log(event.target.closest("a").getAttribute("href"))}></a>
                    <a href={(artistData.instagram_link !== null)? artistData.instagram_link:""} id="instagram-icon" target='_blank'></a>
                    <a href={(artistData.youtube_link !== null)? artistData.youtube_link:""} id="youtube-icon" target='_blank'></a>
                </div> 
                <h1>{artistData.name || "Ebby"}</h1>
                {addCtas()}
                <Link to={getArtistLink()} className='more-btn'>More</Link>
          </div>
          <div>
            <img src={artistData.heroImgUrl} alt={artistData.heroImgAlt}></img>
          </div>
      </header>
    );
}