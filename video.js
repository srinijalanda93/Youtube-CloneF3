const API_KEY = "AIzaSyDZTQW9azQgJzyp-Q4ALmFl0-QYYEF2JSE";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
/**
 * from the video.html we need to fetch/get the query parameter of ?videoId=idno
 */
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId');
    if (videoId) {
        loadVideo(videoId);
        loadComments(videoId);
        loadVideoDetails(videoId);
    } else {
        console.error("No video ID found in URL");
    }
});

function loadVideo(videoId) {
    if (YT) {
        new YT.Player('video-container', {
            height: "500",
            width: "1000",
            videoId: videoId
        });
    }
}
/**
 * using async await function with try and catch to handle the errors
 * the below each function used to fetch the API based on the requirement
 */

/**
 * used to get the VideoDetails
 */
async function loadVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("the getVideoDetails info:",data)
        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].snippet.channelId;
            //hit the API to get the channel Dteails
            loadChannelInfo(channelId);
        }
    } catch (error) {
        console.log('Error fetching video details: ', error);
    }
}

async function loadChannelInfo(channelId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("fetch the channel data:",data);
        if (data.items) {
            //call the function to display the data
            displayChannelInfo(data.items[0]);
            loadRecommendedVideos(data.items[0].snippet.title);
        }
    } catch (error) {
        console.log('Error fetching channel info: ', error);
    }
}
//used to display the channel
function displayChannelInfo(channelData) {
    const channelInfoSection = document.getElementById('channel-info');
    channelInfoSection.innerHTML = `
        <h3>${channelData.snippet.title}</h3>
        <img src="${channelData.snippet.thumbnails.default.url}" alt="${channelData.snippet.title}">
        <p>${channelData.snippet.description}</p>
    `;
}

async function loadComments(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("comments", data)
        if (data.items) {
            //call the function to display the commets
            displayComments(data.items);
        } else {
            console.log("No comments available or data is undefined.");
        }
    } catch (error) {
        console.log('Error fetching comments: ', error);
    }
}

function displayComments(comments) {
    const commentSection = document.getElementById('comment-section');
    commentSection.innerHTML = '';

    comments.forEach(comment => {
        const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
        const commentElement = document.createElement('p');
        commentElement.innerHTML = commentText;
        commentSection.appendChild(commentElement);
    });
}

async function loadRecommendedVideos(channelName) {
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&maxResults=10&part=snippet&q=${channelName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Recommended videos", data)
        if (data.items) {
            //call used to display the recommededVideos
            displayRecommendedVideos(data.items);
        } else {
            console.log("No recommended videos available or data is undefined.");
        }
    } catch (error) {
        console.log('Error fetching recommended videos: ', error);
    }
}

function displayRecommendedVideos(videos) {
    const recommendedSection = document.getElementById('recommended-videos');
    recommendedSection.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <p>${title}</p>
            </a>
        `;
        recommendedSection.appendChild(videoCard);
    });
}