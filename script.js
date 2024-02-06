// const API_KEY = "AIzaSyCCWwPLs-Wp05YVEnGHukkLrNA2YmthzaU";
const API_KEY="AIzaSyAo7626fi4DK5OsZN8_nVm0G12CwtmPBzA";
// const API_KEY = "AIzaSyAT_bd6XUSKbtz0x4vVrGha688NcedYybk";
// const API_KEY = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk";
// const API_KEY="AIzaSyAs2-vpVNYH7dSfUZd73eo09R5Nrmxx4Vs";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("DOMContentLoaded", () => {
  //when it DOM loades we are fetching the video of "learn js of max =10 videos"
  fetchVideos("Learn Java", 51);
});

//using async await function here fetchVideos is used to get the videos
async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  let array = data.items;
  let VideosDefinedId = [];
  array.forEach((obj, index) => {
    if (obj.id.videoId !== undefined) {
      VideosDefinedId.push(obj);
    }
  });
  displayVideos(VideosDefinedId);
}

//let create a getVideo function where it takes  query by the input onclick on the button it will display
function getVideo(query) {
  fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&maxResults=22&part=snippet`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // console.log(data.items); //video array passed to displayVideos
      displayVideos(data.items);
    });
}
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keypress", function (event) {
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
  //need to API to get the ViewCount
  try {
    const response = await fetch(
      `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`
    );

    let ArrayChannel = [];
    if (response.ok && response.ok) {
      const dataOfChannel = await response.json();
      const channelImg = dataOfChannel.items[0].snippet.thumbnails.high.url;
      const channelPub = new Date(dataOfChannel.items[0].snippet.publishedAt);
      console.log("the published time:", channelPub);
      const today = new Date();
      // Calculate the difference in milliseconds
      const timeDifference = today - channelPub;
      // Convert milliseconds to weeks
      const weeksDifference = Math.floor(
        timeDifference / (1000 * 60 * 60 * 24 * 7)
      );
      ArrayChannel.push(channelImg, weeksDifference);
      return ArrayChannel;
    } else {
      console.error("Failed to fetch channel data");
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

async function displayView(videoId) {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      const viewCount = data.items[0].statistics.viewCount;
      const formattedViewCount = formatViewCount(viewCount);
      return formattedViewCount;
    } else {
      console.error("Failed to fetch channel data");
    }
  } catch (e) {
    console.error("An error occurred:", e);
  }
}
function formatViewCount(viewCount) {
  if (viewCount >= 1000000) {
    return (viewCount / 1000000).toFixed(1) + "M";
  } else if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + "K";
  } else {
    return viewCount.toString();
  }
}
async function displayVideos(videos) {
  console.log("BRO THE VIDOES ARRAY:", videos);

  //PENDING video.snippnet.publishedAt
  //even the channel give same publishedDate holy shitt!!
  const container = document.getElementById("video-gallery");
  container.innerHTML = "";

  for (const video of videos) {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;
    const channelId = video.snippet.channelId;
    const channerlTitle = video.snippet.channelTitle;
    //console.log("channel id",channelId);
    // Use await to get the resolved value of fetchChannelData return an Array
    const channelArray = await fetchChannelData(channelId);
    const viewCount = await displayView(videoId);
    console.log("video id", videoId);
    const videoCard = document.createElement("div");
    videoCard.className = "video-card";
    videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <div class="channel-div">
                    <img src="${channelArray[0]}" alt="${title}">
                    <span >
                    <h3>${title}</h3>
                 <p style="padding-block:3px">${channerlTitle} | ${viewCount}views . ${channelArray[1]}weeks</p>
                   
                    <span>
                </div>
            </a>
        `;

    container.appendChild(videoCard);
  }
}
