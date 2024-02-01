const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

/*
//http://127.0.0.1:5500/index.html?name1=srinija&age=22
console.log(window.location.href); //give the reference
let params=new URLSearchParams(window.location.search);
console.log(params.get("name1") ,params.get("age"));
*/

//display Videos used to display Video from Query using snipnet.title,snippnet.idVideo

function displayVideos(videos) {
    document.getElementById("videos-container").innerHTML = "";
    //here the videos are array
    videos.map((video, i) => {
      //get the videoId of each Video
      //console.log(video.id.videoId);
      document.getElementById("videos-container").innerHTML += `
      <a href='/video.html?id=${video.id.videoId}'>
         <li>
         <img src=${video.snippet.thumbnails.high.url}>
         <p>${video.snippet.title}</p>
         </li>
         </a> `;
    });
  }
  
//to get the videos use the API call
function getVideo(query) {
  fetch(`${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&part=snippet&maxResults=10`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(data.items); //video array passed to displayVideos
      displayVideos(data.items);
    });
}
getVideo("");
document.getElementById("search-btn").addEventListener("click", () => {
  const searchInput = document.getElementById("search-input").value;
  getVideo(searchInput);
});
