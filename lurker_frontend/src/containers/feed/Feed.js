import React, {useEffect, useState} from 'react'
import axios from '../../axios/lurkerBackend'
import { useSelector } from 'react-redux'

import CardsFeed from '../../components/ui/cardsFeed/CardsFeed'

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';

import Footer from '../../components/ui/footer/Footer'

const Feed = (props) => {
    

    const onScrollHandler = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            currentOffset += 5
            axios.get(`/posts/${props.selectedCategory}/${currentOffset}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            }).then(
                    res => {
                            setPosts(prevPosts => prevPosts!== null? [...prevPosts, ...res.data]: res.data)
                    }
                )
            .catch( e => console.log(e))
        }
    }

    const jwtToken = useSelector(state => state.jwtToken)
    const [posts, setPosts] = useState(null)
    let currentOffset = 0
    console.log(props.selectedCategory)
    useEffect(() => {
        axios.get(`/posts/${props.selectedCategory}/0`, {
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
            setPosts(null)
            currentOffset = 0
            console.log("Deleted")
        }
    }, [props.selectedCategory])

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler)
        return () => {
            setPosts(null)
            currentOffset = 0
            window.removeEventListener('scroll', onScrollHandler)
            console.log("Deleted")
        }   
    }, [props.selectedCategory])

    return (
        <div>
            {console.log(posts)}
            {/* TODO: Save the name of the logged in user in the redux, fetch the user name and send it to the header. */}
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

        
