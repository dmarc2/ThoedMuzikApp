import axios from 'axios';

const apiClient = axios.create({
//   baseURL: 'http://localhost:3000', // Your API base URL
  baseURL: 'https://thoedmuzikapp.onrender.com', // Your API base URL
  // Other configuration options (headers, timeout, etc.)
  headers: {"Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Headers": "*"
  },
});

async function getArtistData(name) {
    const r = await apiClient.get("/api/artist/"+name+"/data");
    
    if(r.data.length == 0) {
        return [];
    }

    return {
        name: r.data[0].name,
        heroImgUrl: r.data[0].heroImage,
        heroImgAlt: `${name} hero image`,
        personalHeroImgUrl: r.data[0].personalHeroImage,
        themeColor: r.data[0].themeColor,
        heroBgColorStyle: { backgroundColor: r.data[0].themeColor },
        cta_json: (r.data[0].cta_json !== null)? JSON.parse(r.data[0].cta_json): [],
        slides_json: (r.data[0].slides_json !== null)? JSON.parse(r.data[0].slides_json):[],
        quote: r.data[0].quote,
        facebook_link: r.data[0].facebook_link,
        instagram_link: r.data[0].instagram_link,
        youtube_link: r.data[0].youtube_link,
    };
}

async function getArtistSlides(name) {
    const r = await apiClient.get("/api/artist/"+name+"/slides");

    if(r.data.length == 0) {
        return [];
    }
    
    let slides_json = JSON.parse(r.data[0].slides_json);

    return slides_json;
}

function handleAPIError(error) {
    if (error.response) {
        console.log("API Error Response:", error.response.data);
        console.log("Status:", error.response.status);
        console.log("Headers:", error.response.headers);
    } else if (error.request) {
        console.log("API Error Request:", error.request);
    } else {
        console.log("API Error Message:", error.message);
    }
    console.log("API Error Config:", error.config);
    console.log(error);
}

async function getVideoData(muzik) {
    console.log("Getting youtube data");
    for(let i = 0; i < muzik.length; i++) {
        let currentSong = muzik[i];
        let songStats = await fetchYTVideoData(currentSong.getYoutubeVideoID());
        if(songStats.viewCount > 0) {
            currentSong.setViewCount(songStats.viewCount);
        }
        currentSong.setPublishDate(songStats.publishDate);
    }
}

async function fetchYTVideoData(vidID) {
    const API_KEY = 'AIzaSyBFZkk73PLbE6kPcTX73uYipX8Ru6oqTls';
    const VIDEO_ID = vidID;
    let stats = {viewCount:0, publishDate:""};

    await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${VIDEO_ID}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        stats.viewCount = data.items[0].statistics.viewCount;
    })
    .catch(error => console.error('Error fetching data:', error));

    await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            stats.publishDate = data.items[0].snippet.publishedAt;
        })
        .catch(error => console.error('Error fetching data:', error));

    return stats;
}

function findIframeLink(value) {
    return value.includes("https://www.youtube.com/embed/") || value.includes("https://w.soundcloud.com/player/");
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }

export function showProfileLinkPopup() { 
    alert("Link clicked");
}


async function sortOnDate(arr) {
const len = arr.length;
for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
        if (arr[j].getPublishDate() < arr[j + 1].getPublishDate()) {
            [arr[j], arr[j + 1]] = 
                        [arr[j + 1], arr[j]];
        }
    }
}
return arr;
}

function sortOnViews(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            // Ensure getViewCount() returns a number
            const viewCountCurrent = parseInt(arr[j].getViewCount(), 10);
            const viewCountNext = parseInt(arr[j + 1].getViewCount(), 10);

            if (viewCountCurrent < viewCountNext) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

function isSquadArtist(name) {
    return (name === "Ebby" || name === "Em. J." ||name === "Reece" ||name === "Tee" ||name === "T-Dizzle" ||name === "Daniel Mac" ||name === "Nate" ||name === "D-Marc");
}
export {apiClient, getArtistData, getArtistSlides, sortOnViews, sortOnDate, shuffleArray, findIframeLink, fetchYTVideoData, getVideoData, handleAPIError, isSquadArtist};