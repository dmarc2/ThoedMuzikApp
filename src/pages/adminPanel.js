import Navbar from '../components/navbar.js';
import Footer from '../components/footer.js';
import './adminPanel.css';
import { useState, useEffect } from 'react';
import SessionManager from '../SessionManager.js';
import axios from 'axios';
import $, { error } from 'jquery';
import {apiClient, getArtistData} from '../global.js';

const MAX_CTAS = 3;

export default function AdminPanel() {
    const [artistData, setArtistData] = useState(null);

    let sessionManager = new SessionManager();
    let userAccount = null;
    let clickedCTAIndex = -1;
    let tapes = [];
    let muzik = [];

    let formTape = null;
    let formSongs = [];
    let formContributers = [];
    let formLinks = [];


    useEffect(()=>{
        const fetchData = async () => {
            userAccount = sessionManager.getAccount();
            if (userAccount.getType() !== "admin") {
                document.location.href = "/";
                return;
            }

            const data = await getArtistData(userAccount.forArtist);
            setArtistData(data);
        };
        fetchData();
      
    }, []);

    useEffect(() => { 
        const asyncLoading = async () => {
            if (artistData) { 
                loadContent(); 
            } 

            tapes = await sessionManager.getTapes();
            muzik = await sessionManager.getMuzik();

            switchMuzikDBTab("View");
        }

        asyncLoading();
    }, [artistData]);

    function loadContent() {
        //Load artist themeColor
        $("input[name='themeColor']").val(artistData.themeColor);
        //Load artist quote
        $("textarea[name='quote']").html(artistData.quote);

        //Load artist ctas
        let ctas = JSON.parse(JSON.stringify(artistData.cta_json));
        $(".cta").remove();//Clear list
        ctas.forEach(cta => {
            $("#hero-cta-list").append(
                `<div class='cta'>
                    <p>Text: <span id='cta-text'>${cta.text}</span></p>
                    <p>Link: <span id='cta-link'>${cta.link}</span></p>
                </div>`
            );
        });

        $(".cta").on("click", (e) => {
            handleCtaClick(getParentUntil("cta",e.target));
        });

        $("#hero-cta-count").text(ctas.length);

        //assign addCta button its eventhandler
        $("#edit-personal-page > div:nth-child(7) > button:nth-child(3)").on("click", handleAddCTA);

        //Load personal hero image
        $("#hero-personal-image-container> p").text(artistData.personalHeroImgUrl);

        //Load personal hero slides
        let slides = JSON.parse(JSON.stringify(artistData.slides_json));
        $(".slide").remove();//Clear list
        slides.forEach(slide => {
            $("#hero-slides-list").append(
                `<div class='slide'>
                    <p><b>Img:</b> ${slide.image}</p>
                    <p><b>Text:</b> ${slide.heading}</p>
                    <p><b>Link:</b> ${slide.link}</p>
                </div>`
            );
        });
        $("#hero-slide-count").text(slides.length);
    }

    async function handleChangeQuote() {
        let val = $("textarea[name='quote']").val().replaceAll("'", "''");
        const r = await apiClient.post(`/api/artist/update/${artistData.name}/quote/${encodeURIComponent(val)}`);
        // console.log(r);
        if(r.status === 200) {
            alert("Quote successfully changed.");
        }
    }

    async function handleAddCTA() {
        if($("input[name='hero-cta-text']").val() === undefined || $("input[name='hero-cta-text']").val().trim() == "") {
            return;
        }

        let val = {
            "text":$("input[name='hero-cta-text']").val(),
            "link":$("input[name='hero-cta-link']").val()
        };
        let ctas = JSON.parse(JSON.stringify(artistData.cta_json));
        console.log(ctas);

        if(ctas.length < MAX_CTAS) {
            ctas.push(val);
            console.log(ctas);

            const r = await apiClient.post(`/api/artist/update/${artistData.name}/cta_json/${encodeURIComponent(JSON.stringify(ctas))}`);
            if(r.status === 200) {
                alert("Cta successfully added.");
                window.location.reload();
            }
        }
        else {
            alert("Max number of ctas reached.");
        }
    }

    async function handleEditCTA() {
        if($("input[name='hero-cta-text']").val() === undefined || $("input[name='hero-cta-text']").val().trim() == "") {
            return;
        }

        let val = {
            "text":$("input[name='hero-cta-text']").val(),
            "link":$("input[name='hero-cta-link']").val()
        };

        let ctas = JSON.parse(JSON.stringify(artistData.cta_json));
        ctas[clickedCTAIndex] = val;
        console.log(ctas);

        const r = await apiClient.post(`/api/artist/update/${artistData.name}/cta_json/${encodeURIComponent(JSON.stringify(ctas))}`);
        if(r.status === 200) {
            alert("Cta successfully edited.");
            window.location.reload();
        }
    }

    async function handleRemoveCTA() {
        let ctas = JSON.parse(JSON.stringify(artistData.cta_json));

        if(clickedCTAIndex != -1) {
            ctas.splice(clickedCTAIndex, 1);
            const r = await apiClient.post(`/api/artist/update/${artistData.name}/cta_json/${encodeURIComponent(JSON.stringify(ctas))}`);
            if(r.status === 200) {
                alert("Cta successfully removed.");
                window.location.reload();
            }
        }
        else {
            console.error("Index wasn't found for a clicked cta");
        }
    }

    async function handleChangePersonalHeroImage() {
        // console.log($("#hero-personal-image-container > input[type=file]")[0].files);
        let file = $("#hero-personal-image-container > input[type=file]")[0].files[0];
        console.log(file);
        if(file) {
            // $('#imagePreview').attr('src', "/"+ $("#hero-personal-image-container > input[type=file]")[0].files[0].name).show();
            var reader = new FileReader();
            reader.onload = function(e) {
                // e.target.result contains the data URL of the image
                console.log(e.target.result);
                $('#imagePreview').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    }

    function handleCtaClick(elem) {
        const editButton = $("#edit-personal-page > div:nth-child(7) > button");
    
        if (elem.classList.contains("selected-cta")) {
            $("#remove-cta-btn").remove();
            elem.classList.remove("selected-cta");
            $("input[name='hero-cta-text']").val("");
            $("input[name='hero-cta-link']").val("");
            editButton.text("Add CTA");
    
            // Remove the previous event handler for editing
            editButton.off("click", handleEditCTA);
    
            // Add the event handler for adding
            editButton.on("click", handleAddCTA);
        } else {
            let ctas = JSON.parse(JSON.stringify(artistData.cta_json));
    
            $("#remove-cta-btn").remove();
            $(".selected-cta").removeClass("selected-cta");
    
            elem.classList.add("selected-cta");
            $("input[name='hero-cta-text']").val(elem.querySelector("span#cta-text").innerHTML);
            $("input[name='hero-cta-link']").val(elem.querySelector("span#cta-link").innerHTML);
    
            clickedCTAIndex = ctas.findIndex(cta => cta.text === $("input[name='hero-cta-text']").val() && cta.link === $("input[name='hero-cta-link']").val());
            console.log(`Clicked CTA INDEX ${clickedCTAIndex}`);
    
            editButton.text("Edit CTA");
            editButton.after("<button id='remove-cta-btn'>Remove CTA</button>");
    
            // Remove the previous event handler for adding
            editButton.off("click", handleAddCTA);
    
            // Add the event handler for editing
            editButton.on("click", handleEditCTA);
            $("#remove-cta-btn").on("click", handleRemoveCTA);
        }
    }

    function getParentUntil(className, elem) {
        let element = elem;
    
        while (element && !element.classList.contains(className)) {
            element = element.parentElement;
        }
    
        return element; // This will be the .className element or null if not found
    }

    async function switchMuzikDBTab(tab) {
        $(".tab.selected").removeClass("selected");
        let content = "";
        switch(tab) {
            case "Add":
                $("#tabs-container > div:nth-child(2)").addClass("selected");
                content += `<div id='add-tab-content'>
                                <div>
                                    <span>*Tape Type:</span>
                                    <input type='radio' name='tape-type' value='album'></input> Album
                                    <input type='radio' name='tape-type' value='extendedplay'></input> ExtendedPlay
                                    <input type='radio' name='tape-type' value='mixtape'></input> Mixtape
                                    <input type='radio' name='tape-type' value='single'></input> Single
                                </div>
                                <div>
                                    <div>
                                        <label for="tape-name">*Tape Name:</label>
                                        <input type='text' name='tape-name' id='tape-name'></input>
                                        <label for="tape-name">Tape Thumbnail URL:</label>
                                        <input type='text' name='tape-thumbnail-url' id='tape-thumbnail-url'></input>
                                        <label for="tape-name">*Song Name:</label>
                                        <input type='text' name='song-name' id='song-name'></input>
                                        <label for="tape-name">*Youtube vID:</label>
                                        <input type='text' name='ytvidID' id='ytvidID'></input>
                                        <label for="tape-name">Song Thumbnail URL:</label>
                                        <input type='text' name='song-thumbnail-url' id='song-thumbnail-url'></input>

                                        <label for="contributers">*Contributers:</label>
                                        <label for="contributer-name">Name:</label>
                                        <div>
                                            <input type='text' name='contributer-name' id='contributer-name'></input>
                                            <input type='button' value="Add"></input>
                                        </div>
                                        <ul>
                                        </ul>

                                        <label for="links">*Links:</label>
                                        <label for="link">Link:</label>

                                        <div>
                                            <input type='text' name='link' id='link'></input>
                                            <input type='button' value="Add"></input>
                                        </div>
                                        <ul>
                                        </ul>
                                        <button>Add Song</button>
                                    </div>
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Song Name</th>
                                                    <th>Youtube Video Id</th>
                                                    <th>Thumbnail</th>
                                                    <th>Contributers</th>
                                                    <th>Links</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <button>Reset</button>
                                    <button>Submit</button>
                                </div>
                            </div>`;
                break;
            case "Remove":
                $("#tabs-container > div:nth-child(3)").addClass("selected");
                content += `<div id='remove-tab-content'>
                                <div>
                                    <span>Tape Type:</span>
                                    <input type='checkbox' name='album' checked></input> Albums
                                    <input type='checkbox' name='extendedplay' checked></input> ExtendedPlays
                                    <input type='checkbox' name='mixtape' checked></input> Mixtapes
                                    <input type='checkbox' name='single' checked></input> Singles
                                </div>
                                <div>
                                    <div>
                                        <div>
                                            <button>Remove Tape</button>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Tape Name</th>
                                                    <th>Thumbnail</th>
                                                    <th>Song Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;

                                            (await getAllTapesHTML("album")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllTapesHTML("mixtape")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllTapesHTML("extendedplay")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllSinglesHTML()).forEach(singleHtml => {
                                                content += singleHtml;
                                            });

                                            content += `</tbody>
                                        </table>

                                        <div>
                                            <button>Remove Song</button>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Song Name</th>
                                                    <th>Youtube Video Id</th>
                                                    <th>Thumbnail</th>
                                                    <th>Contributers</th>
                                                    <th>Links</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Morocco</td>
                                                    <td>CvUmI8iDLBk</td>
                                                    <td>thumbnail.jpeg</td>
                                                    <td>Daniel Mac, Nate</td>
                                                    <td>https:embedlink, someOtherLink.com</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>`;
                break;
            case "Update":
                $("#tabs-container > div:nth-child(4)").addClass("selected");
                content += `<div id='update-tab-content'>
                                <div>
                                    <span>Tape Type:</span>
                                    <input type='checkbox' name='album' checked></input> Albums
                                    <input type='checkbox' name='extendedplay' checked></input> ExtendedPlays
                                    <input type='checkbox' name='mixtape' checked></input> Mixtapes
                                    <input type='checkbox' name='single' checked></input> Singles
                                </div>
                                <div>
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Tape Name</th>
                                                    <th>Thumbnail</th>
                                                    <th>Song Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;

                                            (await getAllTapesHTML("album")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllTapesHTML("mixtape")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllTapesHTML("extendedplay")).forEach(tapeHtml => {
                                                content += tapeHtml;
                                            });
                                            (await getAllSinglesHTML()).forEach(singleHtml => {
                                                content += singleHtml;
                                            });


                                            content += `</tbody>
                                        </table>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Song Name</th>
                                                    <th>Youtube Video Id</th>
                                                    <th>Thumbnail</th>
                                                    <th>Contributers</th>
                                                    <th>Links</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>`;
                break;
            default:
                $("#tabs-container > div:nth-child(1)").addClass("selected");
                content += `<div id='view-tab-content'>
                            <div>
                                <span>Tape Type:</span>
                                <input type='checkbox' name='album' checked></input> Albums
                                <input type='checkbox' name='extendedplay' checked></input> ExtendedPlays
                                <input type='checkbox' name='mixtape' checked></input> Mixtapes
                                <input type='checkbox' name='single' checked></input> Singles
                            </div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Tape Name</th>
                                            <th>Thumbnail</th>
                                            <th>Song Count</th>
                                        </tr>
                                    </thead><tbody>`;

                                    (await getAllTapesHTML("album")).forEach(tapeHtml => {
                                        content += tapeHtml;
                                    });
                                    (await getAllTapesHTML("mixtape")).forEach(tapeHtml => {
                                        content += tapeHtml;
                                    });
                                    (await getAllTapesHTML("extendedplay")).forEach(tapeHtml => {
                                        content += tapeHtml;
                                    });
                                    (await getAllSinglesHTML()).forEach(singleHtml => {
                                        content += singleHtml;
                                    });

                                content += `</tbody></table>


                                <table>
                                    <thead>
                                        <tr>
                                            <th>Song Name</th>
                                            <th>Youtube Video Id</th>
                                            <th>Thumbnail</th>
                                            <th>Contributers</th>
                                            <th>Links</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>`;
                break;
        }

        //Tab officially updated and displayed
        $("#muzik-db-pane> div> #tab-content").html(content);

        addEventListeners(tab);
    }

    async function addEventListeners(tab) {
        switch(tab) {
            case "Add":
                $("#add-tab-content > div:nth-child(1)> input").on("change", (event) => {
                    if(event.target.checked && event.target.getAttribute("value") === 'single') {
                        $("#tape-name").prop("disabled", true);
                        $("#tape-thumbnail-url").prop("disabled", true);
                        $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > button").prop("disabled", true);
                    }
                    else {
                        $("#tape-name").prop("disabled", false);
                        $("#tape-thumbnail-url").prop("disabled", false);
                        $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > button").prop("disabled", false);
                    }
                });

                //Add contributers button
                $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(13) > input[type=button]:nth-child(2)").on("click", ()=>{
                    let contributer = $("#contributer-name").val().trim();
                    if(contributer != "" && !formContributers.includes(contributer)) {
                        formContributers.push(contributer);
                        $("#contributer-name").val("");
                        $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > ul:nth-child(14)").append("<li>"+contributer+"</li>");
                    }
                });

                //Add links button
                $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(17) > input[type=button]:nth-child(2)").on("click", ()=>{
                    let link = $("#link").val().trim();
                    if(link != "" && !formLinks.includes(link)) {
                        formLinks.push(link);
                        $("#link").val("");
                        $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > ul:nth-child(18)").append("<li>"+link+"</li>");
                    }
                });

                //Add song button
                $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > button").on("click", async ()=> {
                    if(requiredSongInputsAreFilled()) {
                        let song = {
                            "name": $("#song-name").val().trim(),
                            "youtube_video_id": $("#ytvidID").val().trim(),
                            "thumbnail": $("#song-thumbnail-url").val().trim(),
                            "contributers": [...formContributers],
                            "links": [...formLinks]
                        };

                        if(!formSongs.find(current => {
                            //Check for a duplicate entry
                            for(let i = 0; i < song.contributers.length; i++) {
                                if(!current.contributers.includes(song.contributers[i]))
                                    return false;
                            };
                            for(let i = 0; i < song.links.length; i++) {
                                if(!current.links.includes(song.links[i]))
                                    return false;
                            };
                            return (current.name === song.name && current.youtube_video_id === song.youtube_video_id && current.thumbnail === song.thumbnail);
                        })) {
                            formSongs.push(song);

                            let songHTML = `<tr>
                                                <td>${song.name}</td>
                                                <td>${song.youtube_video_id}</td>
                                                <td>${song.thumbnail}</td>
                                                <td>${song.contributers}</td>
                                                <td>${song.links}</td>
                                            </tr>`;

                            $("#add-tab-content > div:nth-child(2) > div:nth-child(2) > table > tbody").append(songHTML);
                            clearSongInputs();
                        }
                    }
                });

                //Reset button
                $("#add-tab-content > div:nth-child(3) > button:nth-child(1)").on("click", ()=>{resetAddForm()});

                //Submit button
                $("#add-tab-content > div:nth-child(3) > button:nth-child(2)").on("click", async () => {
                    let tapeTypeInput = $("#add-tab-content > div:nth-child(1)> input:checked");
                    if(tapeTypeInput.length != 0) {
                        let tapeType = tapeTypeInput.val();
                        console.log(tapeType);
                        try {
                            if(tapeType === "single") {
                                if(requiredSongInputsAreFilled()) {
                                    let songName = $("#song-name").val().trim();
                                    let songYTVD_ID = $("#ytvidID").val().trim();
                                    let songThumbnail = $("#song-thumbnail-url").val().trim();
                                    //Insert INTO song
                                    await insertSong(songName,songYTVD_ID,songThumbnail);
                                    // const songInsertResp = await apiClient.post(`/api/song/${songName}/${songYTVD_ID}/${songThumbnail}`);
                                    // if(songInsertResp.status !== 200) {
                                    //     console.error(songInsertResp);
                                    //     throw new Error("Error inserting song.");
                                    // }
                                    
                                    //Get Song ID's
                                    let songIdResp = null;
                                    if(songThumbnail.length > 0) {
                                        songIdResp = await apiClient.get(`/api/song/id/${songName}/${songYTVD_ID}/${songThumbnail}`);
                                    }
                                    else {
                                        songIdResp = await apiClient.get(`/api/song/id/${songName}/${songYTVD_ID}`);
                                    }

                                    if(songIdResp.data.length !== 1) {
                                        console.error(songIdResp);
                                        throw new Error("Error getting songId.");
                                    }

                                    let currentSongID = songIdResp.data[0]["songId"];
                                    console.log(currentSongID);

                                    //Insert INTO song_link
                                    await Promise.all(formLinks.map(async (link) => {
                                        await insertLink(currentSongID, link);
                                    }));
                                    
                                    //Insert INTO song_contributer
                                    await Promise.all(formContributers.map(async (contributer) => {
                                        await insertContributer(currentSongID, contributer);
                                    }));

                                    alert("You've successfully added a " + tapeType);
                                    resetAddForm();
                                    tapes = await sessionManager.getTapes(true);
                                    muzik = await sessionManager.getMuzik(true);
                                }
                            }
                            else {
                                if(requiredTapeInputsAreFilled()) {
                                    let tapeName = $("#tape-name").val().trim();
                                    let tapeThumbnail = $("#tape-thumbnail-url").val().trim();

                                    //Insert tape
                                    const tapeInsertResp = await apiClient.post(`/api/tape/${tapeType}/${tapeName}/${tapeThumbnail}`);
                                    if(tapeInsertResp.status !== 200) {
                                        console.error(tapeInsertResp);
                                        throw new Error("Error inserting tape.");
                                    }
                                    
                                    //Get Tape ID
                                    const tapeIdResp = await apiClient.get(`/api/tape/${tapeType}/id/${tapeName}/${tapeThumbnail}`);
                                    if(tapeIdResp.data.length !== 1) {
                                        console.error(tapeIdResp);
                                        throw new Error("Error getting tapeId.");
                                    }

                                    let key = (tapeType === "extendedplay")? "epId":tapeType+"Id";
                                    let tapeId = tapeIdResp.data[0][key];

                                    for(let i = 0; i < formSongs.length; i++) {
                                        let songName = formSongs[i].name;
                                        let songYTVD_ID = formSongs[i].youtube_video_id;
                                        let songThumbnail = formSongs[i].thumbnail;
                                        //Insert INTO song
                                        await insertSong(songName,songYTVD_ID,songThumbnail);
                                        // const songInsertResp = await apiClient.post(`/api/song/${songName}/${songYTVD_ID}/${songThumbnail}`);
                                        // if(songInsertResp.status !== 200) {
                                        //     console.error(songInsertResp);
                                        //     throw new Error("Error inserting song.");
                                        // }
                                        
                                        //Get Song ID's
                                        let songIdResp = null;
                                        if(songThumbnail.length > 0) {
                                            songIdResp = await apiClient.get(`/api/song/id/${songName}/${songYTVD_ID}/${songThumbnail}`);
                                        }
                                        else {
                                            songIdResp = await apiClient.get(`/api/song/id/${songName}/${songYTVD_ID}`);
                                        }

                                        if(songIdResp.data.length !== 1) {
                                            console.error(songIdResp);
                                            throw new Error("Error getting songId.");
                                        }

                                        let currentSongID = songIdResp.data[0]["songId"];
                                        console.log(currentSongID);

                                        //Insert INTO tape_song
                                        const tape_song_Resp = await apiClient.post(`/api/tape/${tapeType}/${tapeId}/song/${currentSongID}`);
                                        if(tape_song_Resp.status !== 200) {
                                            console.error(tape_song_Resp);
                                            throw new Error("Error inserting into tape_song.");
                                        }
                                        
                                        //Insert INTO song_link
                                        await Promise.all(formSongs[i].links.map(async (link) => {
                                            await insertLink(currentSongID,link);
                                            // const songLinkResp = await apiClient.post(`/api/song/link`, {
                                            //     id: currentSongID,
                                            //     link: encodeURIComponent(link)
                                            // });
                                            // if (songLinkResp.status !== 200) {
                                            //     console.error(songLinkResp);
                                            //     throw new Error("Error inserting into song_link.");
                                            // }
                                        }));
                                        
                                        //Insert INTO song_contributer
                                        await Promise.all(formSongs[i].contributers.map(async (contributer) => {
                                            await insertContributer(currentSongID,contributer);
                                            // const songContributerResp = await apiClient.post(`/api/song/contributer`, {
                                            //     id: currentSongID,
                                            //     contributer: contributer
                                            // });
                                            // if(songContributerResp.status !== 200) {
                                            //     console.error(songContributerResp);
                                            //     throw new Error("Error inserting into song_contributer.");
                                            // }
                                        }));
                                    }
                                    alert("You've successfully added a " + tapeType);
                                    resetAddForm();
                                    tapes = await sessionManager.getTapes(true);
                                    muzik = await sessionManager.getMuzik(true);
                                }
                            }

                        }catch(error) {
                            console.error("Caught an error: ", error);
                        }
                    }
                });
                break;
            case "Remove":
                $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr:not(.single)").on("click",(event)=> {
                    handleTapeTableClick(event, "tape", "Remove");
                });
                $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr.single").on("click",(event)=> {
                    handleTapeTableClick(event, "single", "Remove");
                });
                $("#remove-tab-content > div:nth-child(1)> input").on("change", (event) => {
                    if($("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr." + event.target.getAttribute("name")).hasClass("hidden")) {
                        $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr." + event.target.getAttribute("name")).removeClass("hidden").css("display", "table-row");
                    }
                    else {
                        $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr." + event.target.getAttribute("name")).addClass("hidden");
                        $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr." + event.target.getAttribute("name")).css("display", "none");
                    }
                });
                $("#remove-tab-content > div:nth-child(2) > div > div:nth-child(1) > button").on("click",()=> {
                    handleRemoveTapeClick();
                });
                $("#remove-tab-content > div:nth-child(2) > div > div:nth-child(3) > button").on("click",()=> {
                    handleRemoveSongClick();
                });
                break;
            case "Update":
                $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr:not(.single)").on("click",(event)=> {
                    handleTapeTableClick(event, "tape", "Update");
                });
                $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr.single").on("click",(event)=> {
                    handleTapeTableClick(event, "single", "Update");
                });
                $("#update-tab-content > div:nth-child(1)> input").on("change", (event) => {
                    if($("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr." + event.target.getAttribute("name")).hasClass("hidden")) {
                        $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr." + event.target.getAttribute("name")).removeClass("hidden").css("display", "table-row");
                    }
                    else {
                        $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr." + event.target.getAttribute("name")).addClass("hidden");
                        $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr." + event.target.getAttribute("name")).css("display", "none");
                    }
                });
                $("#update-tab-content > div:nth-child(2) > div > table > tbody> tr> td.editable").on("dblclick", (event)=>{
                    let editingInput = document.querySelector("input[name='editCol']");

                    if(editingInput) {//Remove and ingore current editing input
                        let editingCol = editingInput.closest("td");
                        editingCol.innerHTML = editingInput.getAttribute("value");
                    }

                    let selectedCol = event.target.closest("td");
                    if(selectedCol === null) return;//Usually mean't user dblclicked currently active editing input
                    let prevVal = selectedCol.textContent;
                    selectedCol.innerHTML = "<input type='text' name='editCol' value=\""+prevVal+"\"/>";
                    $("input[name='editCol']").on("keydown", async (event) => {
                        let newVal = $("input[name='editCol']").val().trim();
                        let changingObj = null;
                        if (event.key === 'Enter' && prevVal !== newVal) {
                            let colName = (selectedCol.cellIndex === 1)? "name":"thumbnail";
                            let editingRow = event.target.closest("tr");
                            // if(editingRow.classList.contains("single") || editingRow.classList.contains("song")) {
                            if(editingRow.classList.contains("single")) {
                                changingObj = muzik[editingRow.getAttribute("key")];
                                updateSong(changingObj.getId(),colName,newVal);
                                console.log("Col: " + colName);
                                console.log("Were changing "); 
                                console.log(changingObj);
                                alert("You've successfully updated a single");
                            }
                            else {
                                changingObj = tapes[editingRow.getAttribute("key")];
                                updateTape(changingObj.getType(),changingObj.getId(),colName,newVal);
                                console.log("Col: " + colName);
                                console.log("Were changing "); 
                                console.log(changingObj);
                                alert("You've successfully updated a " + changingObj.getType());
                            }
                            console.log("going to save this:" + newVal);
                            $("input[name='editCol']").attr("value", newVal);

                            tapes = await sessionManager.getTapes(true);
                            muzik = await sessionManager.getMuzik(true);
                        }
                    })
                });
                break;
            default:
                $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr:not(.single)").on("click",(event)=> {
                    handleTapeTableClick(event, "tape", "View");
                });
                $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr.single").on("click",(event)=> {
                    handleTapeTableClick(event, "single", "View");
                });
                $("#view-tab-content > div:nth-child(1)> input").on("change", (event) => {
                    if($("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr." + event.target.getAttribute("name")).hasClass("hidden")) {
                        $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr." + event.target.getAttribute("name")).removeClass("hidden").css("display", "table-row");
                    }
                    else {
                        $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr." + event.target.getAttribute("name")).addClass("hidden");
                        $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr." + event.target.getAttribute("name")).css("display", "none");
                    }
                });
        }
    }

    function resetAddForm() {
        formSongs = []; 
        clearTapeInputs();
        clearSongInputs();
        clearSongList();
    }

    function clearTapeInputs() {
        $("#add-tab-content > div:nth-child(1)> input").prop("checked", false);
        $("#tape-name").val("");
        $("#tape-thumbnail-url").val("");
    }

    function clearSongInputs() {
        formContributers = []; 
        formLinks = []; 
        $("#add-tab-content > div:nth-child(2) > div:nth-child(1)> input:not(#tape-name):not(#tape-thumbnail-url)").val("");
        $("#add-tab-content > div:nth-child(2) > div:nth-child(1)> div> input:first-child").val("");
        $("#add-tab-content > div:nth-child(2) > div:nth-child(1) > ul").html("");
    }

    function clearSongList() {
        $("#add-tab-content > div:nth-child(2) > div:nth-child(2) > table > tbody").html("");
    }

    function requiredTapeInputsAreFilled() {
        return ($("#tape-name").val().trim() !== "" && formSongs.length > 0);
    }

    function requiredSongInputsAreFilled() {
        return ($("#song-name").val().trim() !== "" && $("#ytvidID").val().trim() !== "" && formContributers.length > 0 && formLinks.length > 0);
    }
    async function handleSongTableClick(event) {
        $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(4) > tbody> tr.selected").removeClass("selected");
        // let index = event.target.closest('tr').getAttribute("key");
        event.target.closest('tr').classList.add("selected");
    }

    async function handleTapeTableClick(event, type, tab) {
        if(tab === "Remove") {
            $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr.selected").removeClass("selected");
        }
        else if(tab === "Update") {
            $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr.selected").removeClass("selected");
        }
        else {
            $("#view-tab-content > div:nth-child(2) > table:nth-child(1)> tbody> tr.selected").removeClass("selected");
        }
        let index = event.target.closest('tr').getAttribute("key");
        event.target.closest('tr').classList.add("selected");

        if(tab === "Remove") {
            $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(4) > tbody > tr").remove();
        }
        else if(tab === "Update") {
            $("#update-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody > tr").remove();
        }
        else {
            $("#view-tab-content > div:nth-child(2) > table:nth-child(2) > tbody > tr").remove();
        }

        let songsHTML = "";
        if(type === "tape") {
            (await getAllTapeSongsHTML(index)).forEach(songHtml => {
                songsHTML += songHtml;
            });

        }
        else {
            (await getSingleSongHTML(index)).forEach(songHtml => {
                songsHTML += songHtml;
            });
        }

        if(tab === "Remove") {
            $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(4) > tbody").append(songsHTML);
            $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(4) > tbody> tr").on("click", (event)=> {
                handleSongTableClick(event);
            })
        }
        else if(tab === "Update") {
            $("#update-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody").append(songsHTML);
            $("#update-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr> td.editable").on("dblclick", (event)=>{
                let editingInput = document.querySelector("input[name='editCol']");

                if(editingInput) {//Remove and ingore current editing input
                    let editingCol = editingInput.closest("td");
                    editingCol.innerHTML = editingInput.getAttribute("value");
                }

                const colOptions = ["name", "youtube_video_id", "thumbnail", "contributer", "link"];
                let selectedCol = event.target.closest("td");
                if(selectedCol === null) return;//Usually mean't user dblclicked currently active editing input
                let prevVal = selectedCol.textContent;
                selectedCol.innerHTML = "<input type='text' name='editCol' value=\""+prevVal+"\"/>";
                $("input[name='editCol']").on("keydown", async (event) => {
                    let newVal = $("input[name='editCol']").val().trim();
                    let changingObj = null;
                    if (event.key === 'Enter' && prevVal !== newVal) {
                        let colName = colOptions[selectedCol.cellIndex];
                        let selectedTape = $("#update-tab-content > div:nth-child(2) > div > table:nth-child(1) > tbody> tr.selected");
                        let editingRow = event.target.closest("tr");

                        if(selectedTape.hasClass("single")) {
                            changingObj = muzik[editingRow.getAttribute("key")];
                        }
                        else {
                            changingObj = tapes[selectedTape.attr("key")].getSongs()[editingRow.getAttribute("key")];
                        }

                        if(selectedCol.cellIndex > 2) {
                            let prevTokens = prevVal.split(",");
                            let newTokens = newVal.split(",");
                            newTokens = newTokens.map(elem=>elem.trim());
                            // console.log(prevTokens);
                            // console.log(newTokens);
                            if(selectedCol.cellIndex == 3) {
                                //Updating Song_Contributers
                                for(const token of prevTokens) {
                                    if(!newTokens.includes(token)) {
                                        console.log(`removing oldVal ${token}`);
                                        //delete
                                        removeContributer(changingObj.getId(),token);
                                    }
                                }
                                for(const token of newTokens) {
                                    if(token !== "" && !prevTokens.includes(token)) {
                                        console.log(`insert newVal ${token.trim()}`);
                                        //insert
                                        insertContributer(changingObj.getId(),token);
                                    }
                                }
                            } 
                            else {
                                //Updating Song_Links
                                for(const token of prevTokens) {
                                    if(!newTokens.includes(token)) {
                                        console.log(`removing oldVal ${token}`);
                                        //delete
                                        removeLink(changingObj.getId(),token);
                                    }
                                }
                                for(const token of newTokens) {
                                    if(token !== "" && !prevTokens.includes(token)) {
                                        console.log(`insert newVal ${token}`);
                                        //insert
                                        insertLink(changingObj.getId(),token);
                                    }
                                }
                            }
                        }
                        else {
                            updateSong(changingObj.getId(),colName,newVal);
                        }
                        // console.log("Col: " + colName);
                        // console.log("Were changing "); 
                        // console.log(changingObj);
                        // console.log(prevVal + " -> " + newVal);
                        $("input[name='editCol']").attr("value", newVal);

                        alert("You've successfully updated a Song");
                        tapes = await sessionManager.getTapes(true);
                        muzik = await sessionManager.getMuzik(true);
                    }
                })
            });
        }
        else {
            $("#view-tab-content > div:nth-child(2) > table:nth-child(2) > tbody").append(songsHTML);
        }

    }

    async function handleRemoveSongClick() {
        let selectedTapeRow = $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr.selected");
        let selectedSongRow = $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(4) > tbody> tr.selected");
        if(selectedTapeRow.length === 0 || selectedSongRow.length === 0) {
            return;
        }


        if(selectedTapeRow.hasClass("single")) {
            let selectedSong = muzik[selectedSongRow.attr("key")];

            if(!window.confirm("You are about to remove a song '"+selectedSong.getName()+"'. Continue?")) {
                return;
            }

            console.log("Removing song " + selectedSong.getId());
            await removeSong(selectedSong.getId());
        }
        else {//else song in tape:
            let tapeWasRemoved = false;
            let songInAnotherTape = false;
            let selectedTape = tapes[selectedTapeRow.attr("key")];
            let selectedSong = selectedTape.getSongs()[selectedSongRow.attr("key")];

            if(!window.confirm("You are about to remove a song '"+selectedSong.getName()+"'. Continue?")) {
                return;
            }

            //if this is the tape's last song:
            if(selectedTape.getSongsCount() === 1) {
                tapeWasRemoved = true;
                console.log("Removing tape " + selectedTape.getId());
                removeTape(selectedTape.getType(), selectedTape.getId());
            }

            //Check if song is in another tape
            for(const tape of tapes) {
                if(tape !== selectedTape) {
                    if(tape.getSongs().find(elem => elem.getId() === selectedSong.getId())) {
                        songInAnotherTape = true;
                        if (!tapeWasRemoved) {
                            console.log("Removing Tape_Song " + selectedTape.getId() + ", " + selectedSong.getId());
                            removeTape_Song(selectedTape.getType(), selectedTape.getId(), selectedSong.getId());
                        }
                        break;
                    }
                }
            }

            if(!songInAnotherTape) {
                if (!tapeWasRemoved) {
                    console.log("Removing Tape_Song " + selectedTape.getId() + ", " + selectedSong.getId());
                    removeTape_Song(selectedTape.getType(), selectedTape.getId(), selectedSong.getId());
                }
                console.log("Removing song " + selectedSong.getId());
                removeSong(selectedSong.getId());
            }
        }

        tapes = await sessionManager.getTapes(true);
        muzik = await sessionManager.getMuzik(true);
        // window.location.reload();
    }

    async function handleRemoveTapeClick() {
        let selectedRow = $("#remove-tab-content > div:nth-child(2) > div > table:nth-child(2) > tbody> tr.selected");
        if(selectedRow.length === 0) {
            return;
        }

        if(selectedRow.hasClass("single")) {
            let selectedSingle = muzik[selectedRow.attr("key")];
            if(!window.confirm("You are about to remove a single '"+selectedSingle.getName()+"'. Continue?")) {
                return;
            }
            console.log("Removing Single " + selectedSingle.getId());
            removeSong(selectedSingle.getId());
        }
        else {
            let selectedTape = tapes[selectedRow.attr("key")];
            if(!window.confirm("You are about to remove a tape '"+selectedTape.getName()+"'. Continue?")) {
                return;
            }

            //Get list of tape songIDs
            let songIds = selectedTape.getSongs().map((song)=>song.getId());
            console.log("songIds:");
            console.log(songIds);

            //Note*: tape should also be removed from tapes
            console.log(`Removing Tape: ${selectedTape.getType()} ${selectedTape.getId()}`)
            await removeTape(selectedTape.getType(),selectedTape.getId());

            let singles = await getAllSingles();
            console.log("singles:");
            console.log(singles);

            for(const songId of songIds) {
                if(singles.find((elem) => elem.songId == songId)) {
                    //Note*: song should also be removed from muzik and tapes
                    console.log("Removing Tape Song " + songId);
                    await removeSong(songId);
                }
            }
        }

        tapes = await sessionManager.getTapes(true);
        muzik = await sessionManager.getMuzik(true);
        // window.location.reload();
    }

    async function removeTape_Song(tapeType, tapeId, songId) {
        const r = await apiClient.post(`/api/tape/song/remove`, {
            tapeType: tapeType,
            tapeId: tapeId,
            songId: songId
        });
        if(r.status === 200) {
            alert("Tape_Song successfully removed.");
        }
    }

    async function insertSong(name, ytvidID, thumbnail) {
        const r = await apiClient.post(`/api/song/insert`, {
            name: name,
            youtube_video_id: ytvidID,
            thumbnail: (thumbnail !== "")? thumbnail:null
        });
        if(r.status !== 200) {
            console.error(r);
            throw new Error("Error inserting a Song.");
        }
    }

    async function insertContributer(songId, contributer) {
        const r = await apiClient.post(`/api/song/contributer/insert`, {
            songId: songId,
            contributer: contributer
        });
        if(r.status !== 200) {
            console.error(r);
            throw new Error("Error inserting into song_contributer.");
        }
    }
    
    async function insertLink(songId, link) {
        const r = await apiClient.post(`/api/song/link/insert`, {
            songId: songId,
            link: link
        });
        if(r.status !== 200) {
            console.error(r);
            throw new Error("Error inserting into song_link.");
        }
    }

    async function removeContributer(songId, contributer) {
        const r = await apiClient.post(`/api/song/contributer/update`, {
            songId: songId,
            contributer: contributer
        });
        if(r.status === 200) {
            alert("Song Contributer successfully removed.");
        }
    }

    async function removeLink(songId, link) {
        const r = await apiClient.post(`/api/song/link/update`, {
            songId: songId,
            link: link
        });
        if(r.status === 200) {
            alert("Song Link successfully removed.");
        }
    }

    async function updateSong(songId, col, val) {
        const r = await apiClient.post(`/api/song/update`, {
            songId: songId,
            col: col,
            newVal: val
        });
        if(r.status === 200) {
            alert("Song successfully updated.");
        }
    }

    async function updateTape(tapeType, tapeId, col, val) {
        const r = await apiClient.post(`/api/tape/update`, {
            tapeType: tapeType,
            tapeId: tapeId,
            col: col,
            newVal: val
        });
        if(r.status === 200) {
            alert("Tape successfully updated.");
        }
    }

    async function removeTape(tapeType, tapeId) {
        const r = await apiClient.post(`/api/tape/remove`, {
            tapeType: tapeType,
            tapeId: tapeId
        });
        if(r.status === 200) {
            alert("Tape successfully removed.");
        }
    }

    async function removeSong(songId) {
        const r = await apiClient.post(`/api/song/remove`, {
            songId: songId
        });
        if(r.status === 200) {
            alert("Song successfully removed.");
            // window.location.reload();
        }
    }

    async function getAllTapeSongsHTML(index) {
        let songsHTML = await tapes[index].getSongs().map((song, index) => `
                    <tr key="${index}" class="song">
                        <td class="editable">${song.getName()}</td>
                        <td class="editable">${song.getYoutubeVideoID()}</td>
                        <td class="editable"></td>
                        <td class="editable">${song.getContributers()}</td>
                        <td class="editable">${song.getLinks()}</td>
                    </tr>
                `
        );

        return songsHTML;
    }

    async function getAllTapesHTML(type) {
        let neededTapesHTML = await tapes.map((tape, index) => {
            if(tape.getType() === type) {
                return `
                    <tr key="${index}" class="${type}">
                        <td>${capitalizeWord(tape.getType())}</td>
                        <td class="editable">${tape.getName()}</td>
                        <td class="editable">${tape.getThumbnail()}</td>
                        <td>${tape.getSongsCount()}</td>
                    </tr>
                `;
            }
            return "";
        });

        return neededTapesHTML;
    }

    async function getAllSingles() {
        const r = await apiClient.get(`/api/singles`);
        const singles = JSON.parse(JSON.stringify(r.data));

        if(r.status === 200) {
            return singles;
        }
    }

    function getSingleIndex(songId) {
        return muzik.findIndex(song => song.getId() == songId);
    }

    async function getAllSinglesHTML() {
        let singlesHTML = (await getAllSingles()).map((single) => `
                    <tr key="${getSingleIndex(single.songId)}" class="single">
                        <td>Single</td>
                        <td class="editable">${single.name}</td>
                        <td class="editable">${(single.thumbnail)? single.thumbnail:""}</td>
                        <td>1</td>
                    </tr>
                `
        );

        return singlesHTML;
    }

    function getSingleSongHTML(index) {
        let song = muzik[index];
        return [`<tr key="${index}" class="song">
                    <td class="editable">${song.getName()}</td>
                    <td class="editable">${song.getYoutubeVideoID()}</td>
                    <td class="editable">${song.getThumbnail()}</td>
                    <td class="editable">${song.getContributers()}</td>
                    <td class="editable">${song.getLinks()}</td>
                </tr>`];
    }

    function capitalizeWord(word) {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    return (
        <div id="AdminPanel">
            <Navbar/>
            <main>
                <h1>Admin Panel</h1>
                <section id='edit-personal-page' className='pane'>
                    <h2>Edit Personal Info</h2>
                    <label for="themeColor">Theme Color:</label>
                    <input type='color' name='themeColor'></input>

                    <label for="quote">Quote:</label>
                    <div>
                        <textarea name='quote'></textarea>
                        <button onClick={handleChangeQuote}>Change Quote</button>
                    </div>

                    <label for="hero-cta">Hero Call To Action:</label>
                    <div>
                        <input name='hero-cta-text' type='text' placeholder='Enter text'></input>
                        <input name='hero-cta-link' type='text' placeholder='Enter link'></input>
                        <button>Add CTA</button>
                        <p><span id='hero-cta-count'>0</span> of 3</p>
                    </div>
                    <div id='hero-cta-list'>
                        <div className='cta'>
                            <p>Text: Check out my new song</p>
                            <p>Link: Link to a page resource</p>
                        </div>
                        <div className='cta'>
                            <p>Text: Come see me at</p>
                            <p>Link: Link to Tickemaster</p>
                        </div>
                        <div className='cta'>
                            <p>Text: New merch alert!</p>
                            <p>Link: Link to a shop page</p>
                        </div>
                        {/* <div className='cta'>
                            <p>Text: New video just dropped</p>
                            <p>Link: Link to a Song page</p>
                        </div> */}
                    </div>

                    <label>Personal Hero Image:</label>
                    <div id='hero-personal-image-container'>
                        <p>myImg.png</p>
                        <input type='file' accept="image/*"></input>
                    </div>
                    <button onClick={handleChangePersonalHeroImage}>Change Image</button>

                    <label for="hero-slides">Personal Hero Slides:</label>
                    <div>
                        <input name='hero-slide-img' type='file'></input>
                        <input name='hero-slide-text' type='text' placeholder='Enter text'></input>
                        <input name='hero-slide-link' type='text' placeholder='Enter link'></input>
                        <button>Add Slide</button>
                        <p><span id='hero-slide-count'>0</span> of 9</p>
                    </div>
                    <div id='hero-slides-list'>
                        <div className='slide'>
                            <p><b>img:</b> myImg.png</p>
                            <p><b>Text:</b> Check out my new song</p>
                            <p><b>Link:</b> Link to a page resource</p>
                        </div>
                        <div className='slide'>
                            <p><b>img:</b> myImg.png</p>
                            <p><b>Text:</b> Come see me at</p>
                            <p><b>Link:</b> Link to Tickemaster</p>
                        </div>
                        <div className='slide'>
                            <p><b>img:</b> myImg.png</p>
                            <p><b>Text:</b> New merch alert!</p>
                            <p><b>Link:</b> Link to a shop page</p>
                        </div>
                        <div className='slide'>
                            <p><b>img:</b> myImg.png</p>
                            <p><b>Text:</b> New video just dropped</p>
                            <p><b>Link:</b> Link to a Song page</p>
                        </div>
                    </div>
                </section>
                    <img id='imagePreview' src=''></img>
                <section id='muzik-db-pane' className='pane'>
                    <h2>Edit Muzik Database</h2>
                    <div>
                        <div id='tabs-container'>
                            <div className='tab selected' onClick={() => switchMuzikDBTab("View")}>View</div>
                            <div className='tab' onClick={() => switchMuzikDBTab("Add")}>Add</div>
                            <div className='tab' onClick={() => switchMuzikDBTab("Remove")}>Remove</div>
                            <div className='tab' onClick={() => switchMuzikDBTab("Update")}>Update</div>
                        </div>
                        <div id='tab-content'>
                        </div>
                    </div>
                </section>
                <section className='pane'>
                    <h2>Edit Product Database</h2>
                </section>
            </main>
            <Footer/>
        </div>
    );
}