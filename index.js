import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }

    else if (e.target.dataset.deleteTweetBtn){
        handleDeleteTweetBtn(e.target.dataset.deleteTweetBtn)
    }
})

function handleDeleteTweetBtn(tweetId){

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]

    const index = tweetsData.indexOf(targetTweetObj)

    if (index > -1) {
        tweetsData.splice(index, 1)
    }
    render()

    console.log(targetTweetObj)
    console.log(tweetsData.indexOf(targetTweetObj))
}


function handleReplyBtnClick(tweetId){

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]

    const replyInputArea = document.getElementById(`reply-input-area-${tweetId}`)

    if (replyInputArea.value){
        targetTweetObj.replies.unshift(
            {
                handle: "@NotAvgJoe",
                profilePic: "./images/notavgjoe.png",
                tweetText: replyInputArea.value
            }
        )
        render()
        document.getElementById(`reply-container-${tweetId}`).classList.toggle("hidden")
        replyInputArea.value = ""
    }
}

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`reply-container-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@NotAvgJoe`,
            profilePic: `images/notavgjoe.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                    </div>
                `
            })
        }

        let hiddenClass = ""

        if (tweet.handle != "@NotAvgJoe") {
           hiddenClass = "hidden"
        }
          
        feedHtml += `
            <div class="tweet">

                <div class="delete-tweet-btn-container">
                    <button class="${hiddenClass} delete-tweet-btn" 
                        id="x"
                        data-delete-tweet-btn="${tweet.uuid}"
                        >X</button>
                <div>

                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div> 
                </div>
                <div class="hidden" id="reply-container-${tweet.uuid}">
                    <div class="reply-textarea-container" id="reply-input-${tweet.uuid}">
                        <img class="profile-pic" src="images/notavgjoe.png" alt="notavgjoe-logo">
                        <textarea class="reply-textarea" placeholder="Tweet your reply" 
                            id="reply-input-area-${tweet.uuid}" 
                            ></textarea>
                        
                    </div>
                    <button class="reply-btn" id="reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
                    <div class="" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                    </div>   
                </div>
            </div>
        `
   })
   return feedHtml 
   
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

