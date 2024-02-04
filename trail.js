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