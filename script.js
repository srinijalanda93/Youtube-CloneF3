const API_KEY = "AIzaSyCCWwPLs-Wp05YVEnGHukkLrNA2YmthzaU";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("DOMContentLoaded", () => {
    //when it DOM loades we are fetching the video of "learn js of max =10 videos"
    fetchVideos("Learn Java", 21);
});

//using async await function here fetchVideos is used to get the videos
async function fetchVideos(searchQuery, maxResults) {
const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`);
    const data = await response.json();
    console.log(data);
    displayVideos(data.items);
}

//let create a getVideo function where it takes  query by the input onclick on the button it will display
function getVideo(query) {
    fetch(`${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&maxResults=22&part=snippet`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
       // console.log(data.items); //video array passed to displayVideos
        displayVideos(data.items);
      });
  }
  const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        //event.preventDefault();
        search();
    }
});

function search() {
    const searchTerm = searchInput.value;
    // Add your search logic here
    getVideo(searchTerm);
    
}

async function fetchChannelData(channelId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        let ArrayChannel=[];
        if (response.ok) {
            const dataOfChannel = await response.json();
            //console.log("channel data", dataOfChannel);
            //channelImg
             //console.log(dataOfChannel.items[0].snippet.thumbnails.high.url);
             //channelImg,channelPub in the array
             const channelImg = dataOfChannel.items[0].snippet.thumbnails.high.url;
            const channelPub = new Date(dataOfChannel.items[0].snippet.publishedAt);
            //console.log("the channelimg url:",channelImg);
            //console.log("the published time:",channelPub);
            const today = new Date();
            // Calculate the difference in milliseconds
            const timeDifference = today - channelPub;
            // Convert milliseconds to weeks
            const weeksDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
           // console.log(`${weeksDifference}weeks`);
            ArrayChannel.push(channelImg,weeksDifference)
            return ArrayChannel;

        } else {
            console.error('Failed to fetch channel data');
        }
    } catch (error) {
        console.log('An error occurred:', error);
    }
}

async function displayVideos(videos) {
    const container = document.getElementById("video-gallery");
    container.innerHTML = '';

    for (const video of videos) {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.high.url;
        const channelId = video.snippet.channelId;
        const channerlTitle = video.snippet.channelTitle;
        //console.log("channel id",channelId);
        // Use await to get the resolved value of fetchChannelData
       const channelArray = await fetchChannelData(channelId);

       console.log("the video_id",video.id.videoId);
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <div class="channel-div">
                    <img src="${channelArray[0]}" alt="${title}">
                    <span>
                    <h3>${title}</h3>
                    <p>${channerlTitle} | ${channelArray[1]}k views</p>
                   
                    <span>
                </div>
            </a>
        `;

        container.appendChild(videoCard);
    }
}