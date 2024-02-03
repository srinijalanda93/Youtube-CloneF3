const API_KEY = "AIzaSyCCWwPLs-Wp05YVEnGHukkLrNA2YmthzaU";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
/**
 * from the video.html we need to fetch/get the query parameter of ?videoId=idno
 */
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId'); //videoId
    if (videoId) {
        loadVideo(videoId);
        loadComments(videoId);
        loadVideoDetails(videoId);
        loadVideoStats(videoId);
    } else {
        console.error("No video ID found in URL");
    }
});

//here we fetch video using it id and display on video-container
function loadVideo(videoId) {
    if (YT) {
        new YT.Player('video-container', {
            height: "400",
            width: "750",
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
       // console.log("the getVideoDetails info:",data)
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
        //fetching the subscription count
       const responseSub=await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=statistics&id=${channelId}`);
        if (! (response.ok && responseSub.ok) ) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const dataSub=await responseSub.json();
        console.log("fetch the Sub data:",dataSub);
        //console.log("fetch the channel data:",data);
        if (data.items && dataSub.items) {
            //call the function to display the data
            displayChannelInfo(data.items[0],dataSub.items[0]);
            loadRecommendedVideos(data.items[0].snippet.title);

        }
       
    } catch (error) {
        console.log('Error fetching channel info: ', error);
    }
}


//from this function we will fetch the viewcount,likecount and pass to the function in the form of array
async function loadVideoStats(videoId){
    try{
        const response=await  fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`); 
        }
        const data = await response.json();
        console.log("fetch the statistics data:",data);
        const ArrayStat=[]
        if(data.items){
       const viewCount=data.items[0].statistics.viewCount
       const likeCount=data.items[0].statistics.likeCount
       console.log("the viewCount:",viewCount);
       console.log("the likeCount:",likeCount);
     

       // Call another API using the second API key
       const SnippetResponse = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=snippet&id=${videoId}`);
       const secondApiData = await SnippetResponse.json();
       // Process the data from the second API as needed
       //console.log("Data from the second API:", secondApiData);
      // const published=secondApiData.items[0].snippet.publishedAt;

         // Extract and display full date, month, and year from timestamp
         const timestamp = secondApiData.items[0].snippet.publishedAt; // Assuming the timestamp is in the snippet.publishedAt field
         const dateObject = new Date(timestamp);
         const options = { year: 'numeric', month: 'long', day: 'numeric' };
         const formattedDate = dateObject.toLocaleDateString('en-US', options);

         console.log(`Published on ${formattedDate}`);
       const title=secondApiData.items[0].snippet.title;
       const description=secondApiData.items[0].snippet.description;
       ArrayStat.push(title,description,viewCount,formattedDate,likeCount);
       getVideoStats(ArrayStat);
      
        }
        

    }catch(error){
        console.log('Error fetching Statistics info: ', error);
    }

}
function getVideoStats(ArrayStat) {
    const displayViewsDiv= document.getElementById('display-views');
    displayViewsDiv.innerHTML +=`
    <h1>${ArrayStat[0]}</h1>
    <span>
     <p><span>${ArrayStat[2]} Views. ${ArrayStat[3]}</span></p>
    <p> ${ArrayStat[4]}<img src="./assets/displayview0.svg"></p> 
    <p><img src="./assets/displayview2.svg"> Share</p>
    <p><img src="./assets/displayview3.svg"> Save</p>
    <p><img src="./assets/displayview4.svg"><p>
    </span>
    
    ` 
}


function formatSubscriberCount(subscriberCount) {
    const num = parseFloat(subscriberCount);
    
    if (num >= 1e6) {
        // Format the number to include one decimal place for millions
        return (num / 1e6).toFixed(1) + 'M';
    } else {
        return num.toString();
    }
}

function displayChannelInfo(channelData, subscriptionData) {
    console.log("the channel data subscriptions:", channelData);
    const channelInfoSection = document.getElementById('channel-info');

    // Format the subscriber count
    const formattedSubscriberCount = formatSubscriberCount(subscriptionData.statistics.subscriberCount);

    // Update the HTML content
    channelInfoSection.innerHTML += `
    <div>
        <img src="${channelData.snippet.thumbnails.high.url}" alt="${channelData.snippet.title}">
        <span>
            <p>${formattedSubscriberCount} Subscribers</p>
            <p>${channelData.snippet.title}</p>
        </span>
    </div>
    <div>
        <button>Subscribe</button>
    </div>
`;

    const channelInfoToggle = document.getElementById('channel-info-toggle');
    channelInfoToggle .innerHTML+=`<p>${channelData.snippet.description}</p>`
}



async function loadComments(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
     //   console.log("comments", data)
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
       // console.log("Recommended videos", data)
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