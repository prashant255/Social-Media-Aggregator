import React, { useEffect, useState } from 'react'
import axios from '../../axios/lurkerBackend'
import { useSelector } from 'react-redux'

import CardsFeed from '../../components/ui/cardsFeed/CardsFeed'

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';

const Feed = (props) => {

    const onScrollHandler = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            currentOffset += 5
            if (props.type === 'bookmark') {
                axios.get(`/bookmark/${currentOffset}`, {
                    headers
                }).then(
                    res => {
                        setPosts(prevPosts => prevPosts !== null ? [...prevPosts, ...res.data] : res.data)
                    }).catch(e => console.log(e))
            } else {
                axios.get(`/posts/${props.selectedCategory}/${currentOffset}`, {
                    headers
                }).then(
                    res => {
                        setPosts(prevPosts => prevPosts !== null ? [...prevPosts, ...res.data] : res.data)
                    }).catch(e => console.log(e))
            }
        }
    }

    const jwtToken = useSelector(state => state.jwtToken)
    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    }
    const [posts, setPosts] = useState(null)
    let currentOffset = 0
    useEffect(() => {
        if (props.type === 'bookmark') {
            axios.get(`/bookmark/0`, {
                headers
            }).then(
                res => {
                    if (JSON.stringify(res.data) !== JSON.stringify(posts))
                        setPosts(res.data)
                }).catch(e => console.log(e))
        } else {
            axios.get(`/posts/${props.selectedCategory}/0`, {
                headers
            }).then(
                res => {
                    if (JSON.stringify(res.data) !== JSON.stringify(posts))
                        setPosts(res.data)
                }).catch(e => console.log(e))
        }
        return () => {
            setPosts(null)
            currentOffset = 0
        }
    }, [props.selectedCategory])

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler)
        return () => {
            setPosts(null)
            currentOffset = 0
            window.removeEventListener('scroll', onScrollHandler)
        }
    }, [props.selectedCategory])

    return (
        <div>
            {
                posts ? posts.map(post => {
                    let postHandle = null;
                    let url = null;
                    switch (post.handle) {
                        case "Reddit":
                            postHandle = RedditIcon;
                            url = `https://redd.it/${post.postId.slice(3)}`
                            break;
                        case "Facebook":
                            postHandle = FacebookIcon;
                            break;
                        case "Twitter":
                            postHandle = TwitterIcon;
                            break;
                        default:
                            console.log("Invalid Handle")
                    }
                    return (
                        <CardsFeed 
                            key={post.lurkerPostId} 
                            postDetails={post} 
                            postSource={postHandle} 
                            bookmark = {post.bookmark}
                            url = {url}
                        />
                    )
                }) :
                    <h1>No post to display</h1>
            }
        </div>
    )
}

export default Feed


