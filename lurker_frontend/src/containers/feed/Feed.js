import React, {useEffect, useState} from 'react'
import axios from '../../axios/lurkerBackend'
import { useSelector } from 'react-redux'
import CardsFeed from '../../components/ui/cardsFeed/CardsFeed'

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';

import FeedCard from '../../components/ui/cardsFeed/CardsFeed'
import Header from '../../components/ui/header/Header'
import Footer from '../../components/ui/footer/Footer'

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
            {/* TODO: Save the name of the logged in user in the redux, fetch the user name and send it to the header. */}
            <Header name="Swapnil Markhedkar"></Header>
            {
                posts ? posts.map(post => {
                    let postHandle = null;
                    switch(post.handle){
                        case "Reddit": 
                            postHandle = RedditIcon;
                            break;
                        case "Facebook": 
                            postHandle = FacebookIcon;
                            break;
                        case "Twitter": 
                            postHandle = TwitterIcon;
                            break;
                    }
                    return <CardsFeed key = {post.lurkerPostId} postDetails = {post} postSource={postHandle}/>
                }) : 
                    <h1>No post to display</h1>
            }
            <Footer/>
        </div>
    )
}

export default Feed

        
