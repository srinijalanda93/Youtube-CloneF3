const API_KEY = "AIzaSyDZTQW9azQgJzyp-Q4ALmFl0-QYYEF2JSE";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("DOMContentLoaded", () => {
    //when it DOM loades we are fetching the video of "learn js of max =10 videos"
    fetchVideos("Learn JS", 10);
});

//using async await function here fetchVideos is used to get the videos
async function fetchVideos(searchQuery, maxResults) {
    const response = await fetch(
        `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
    );
    const data = await response.json();
    displayVideos(data.items);
}
//let create a getVideo function where it takes  query by the input onclick on the button it will display
function getVideo(query) {
    fetch(`${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&part=snippet&maxResults=20`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
       // console.log(data.items); //video array passed to displayVideos
        displayVideos(data.items);
      });
  }
  document.getElementById("search-btn").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input").value;
    getVideo(searchInput);
  });


  /**
   * here in displayVideo used take data.items= video array
   * using forEach (e,i,arr) e=video feteching videoId,title,image wrap inside <a></a>
   * create a div assign the className(videoCard) append to the div#video-gallery
   * onclick on the img redirect to other(video.html) using videoId plays the video
   */
function displayVideos(videos) {
    const container = document.getElementById("video-gallery");
    container.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.high.url;

        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <h3>${title}</h3>
            </a>
        `;
        container.appendChild(videoCard);
    });
}