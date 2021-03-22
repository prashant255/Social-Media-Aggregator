import React, {useEffect, useState} from 'react'
import axios from '../../axios/lurkerBackend'
import { useSelector } from 'react-redux'
import FeedCard from '../../components/ui/cardsFeed/cardsFeed'


// import FacebookIcon from '@material-ui/icons/Facebook';
// import TwitterIcon from '@material-ui/icons/Twitter';
// import RedditIcon from '@material-ui/icons/Reddit';


const Feed = () => {
    
    const jwtToken = useSelector(state => state.jwtToken)
    const [posts, setPosts] = useState(null)
    useEffect(() => {
        axios.get("/posts/all", {
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        }).then(
                res => {
                    if(JSON.stringify(res.data) !== JSON.stringify(posts))
                        setPosts(res.data)
                }
            )
        .catch( e => console.log(e))
        return () => {
        }
    }, [posts])
    return (

        <div>
            {
                posts ? posts.map(post => {

                    // <FeedCard
                    // id = {1}
                    // userName = {"Shruti Phadke"}
                    // postTimeStamp = {"March 20, 2021"}
                    // profilePicture = {"test"}
                    // imageSource = {"https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FImage&psig=AOvVaw0IZlHIPH-5SjQp-4CaLN37&ust=1616332747122000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIDivez6vu8CFQAAAAAdAAAAABAD"}
                    // // postSource = {FacebookIcon} // Facebook | Reddit | Twitter
                    // caption = {"test3 this is a caption hello world"}
                // />
                    return <FeedCard key = {post.lurkerPostId} postDetails = {post}
                    userName = "Prashant Agrawal"
                    postTimeStamp = {"March 20, 2021"}
                    profilePicture = {"test"}
                    imageSource = {"Some image"}/>
                }) : 
                    <h1>No post to display</h1>
            }
        </div>
    )
}

export default Feed

        
