export default function fetchYTVideoData() {
    // Replace 'YOUR_API_KEY' with your actual API key
    const API_KEY = 'AIzaSyBFZkk73PLbE6kPcTX73uYipX8Ru6oqTls';
    const VIDEO_ID = 'PfmWw0MLYwE'; // Replace with the actual video ID

    fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${VIDEO_ID}&key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const viewCount = data.items[0].statistics.viewCount;
        console.log(`View Count: ${viewCount}`);
    })
    .catch(error => console.error('Error fetching data:', error));
}