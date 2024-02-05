/**
 * fetching fetch count from that video
 */

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const apiKey = "AIzaSyDI7xuxOTRzMaDfaecSlpFJfHOKQV04dnk";
const videoId = 'eIrMbAQSU34';
const apiUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
function formatViewCount(viewCount) {
    if (viewCount >= 1000000) {
      return (viewCount / 1000000).toFixed(1) + 'M';
    } else if (viewCount >= 1000) {
      return (viewCount / 1000).toFixed(1) + 'K';
    } else {
      return viewCount.toString();
    }
  }

// Fetch data from YouTube API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Extract view count from the response
    const viewCount = data.items[0].statistics.viewCount;
    const formattedViewCount = formatViewCount(viewCount);
      console.log(`The view count for the video is: ${formattedViewCount}`);
  })
  .catch(error => console.error('Error fetching data:', error));


  async function loadChannelInfo(channelId, videoId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        const responseSub = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=statistics&id=${channelId}`);
        
        console.log("Channel Info API Response:", response.status, await response.json());
        console.log("Subscription Count API Response:", responseSub.status, await responseSub.json());

        if (!(response.ok && responseSub.ok)) {
            throw new Error(`HTTP error! status: ${response.status}, ${responseSub.status}`);
        }

        // Rest of your code...
    } catch (error) {
        console.log('Error fetching channel info: ', error);
    }
}

async function loadRecommendedVideos(channelName, channelId) {
  try {
      const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=20&part=snippet&q=${channelName}`);
      const response2 = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);

      if (!(response.ok && response2.ok)) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const data2 = await response2.json();

      console.log("Recommended videos", data);
      console.log("channel data :", data2);

      if (data.items) {
          // Fetch view count for each video and then display recommended videos
          const recommendedVideosWithViewCount = await Promise.all(data.items.map(async (video) => {
              const videoId = video.id.videoId;
              const title = video.snippet.title;
              const thumbnail = video.snippet.thumbnails.default.url;
              const viewCount = await displayView(videoId); // Fetch view count using the displayView function

              return {
                  videoId,
                  title,
                  thumbnail,
                  viewCount,
              };
          }));

          displayRecommendedVideos(recommendedVideosWithViewCount);
      } else {
          console.log("No recommended videos available or data is undefined.");
      }
  } catch (error) {
      console.log('Error fetching recommended videos: ', error);
  }
}

function displayRecommendedVideos(recommendedVideos) {
  const recommendedSection = document.getElementById('recommended-videos');
  recommendedSection.innerHTML = '';

  recommendedVideos.forEach(video => {
      const { videoId, title, thumbnail, viewCount } = video;
      const videoCard = document.createElement('div');
      videoCard.innerHTML = `
          <a href="video.html?videoId=${videoId}">
              <img src="${thumbnail}" alt="${title}">
              <p>${title}</p>
              <p>Views: ${viewCount}</p>
          </a>
      `;
      recommendedSection.appendChild(videoCard);
  });
}

const srinija = await Promise.all(
  data.items.map(async (video) => {
      // Your logic here...

      // Assuming you have some condition to determine if the video ID is undefined
      const videoId = /* Some logic to get the video ID */;

      // Return the video ID or undefined based on your condition
      return videoId;
  })
);

// Filter out undefined values
const filteredVideoIds = srinija.filter((videoId) => videoId !== undefined);

console.log("Filtered Video IDs:", filteredVideoIds);
