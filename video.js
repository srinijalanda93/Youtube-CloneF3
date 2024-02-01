
const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk";
const BASE_URL = "https://www.googleapis.com/youtube/v3";


window.addEventListener("load", () => {
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
//console.log(videoId)

/**adding the div#video-container in video.html */
  if (YT) {
    new YT.Player("video-container", {
      height: "500",
      width: "1000",
      videoId: videoId,
    });
  }


  //to the channel detail under the video

  function getChannelDetails(channelId){

  }
  //to get the videoDetails
  function getVideoDetails(){
    //videos?key={API_KEY}&part=snippet&id={videoId}
    fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`)
    .then((res) =>res.json())
    .then((data) =>{
        console.log(data);
        console.log("the channel Id:",data.items[0].snippet.channelId);
        //hit API to get the channel Details
    getChannelDetails(data.items[0].snippet.channelId);
    })
  }
  getVideoDetails();
})