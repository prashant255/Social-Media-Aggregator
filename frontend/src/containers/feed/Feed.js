import React, { useEffect, useState } from 'react'
import axios from '../../axios/lurkerBackend'
import { useSelector } from 'react-redux'

import CardsFeed from '../../components/ui/cardsFeed/CardsFeed'

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import RedditIcon from '@material-ui/icons/Reddit';

const Feed = (props) => {

    const onScrollHandler = (element) => {
        if (element.scrollHeight - element.scrollTop === element.clientHeight && props.type !== null) {
            currentOffset += 5
            if (props.type === 'bookmark') {
                axios.get(`/bookmark/${currentOffset}`, {
                    headers
                }).then(
                    res => {
                        setPosts(prevPosts => prevPosts !== null ? [...prevPosts, ...res.data] : res.data)
                    }).catch(e => console.log(e))
            } else if(props.type === 'layout'){
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
    let postHandle = null;
    let url = null;
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
        } else if(props.type === 'layout') {
            axios.get(`/posts/${props.selectedCategory}/0`, {
                headers
            }).then(
                res => {
                    if (JSON.stringify(res.data) !== JSON.stringify(posts))
                        setPosts(res.data)
                }).catch(e => console.log(e))
        } else {
            setPosts(props.duplicatePosts)
        }
        return () => {
            setPosts(null)
            currentOffset = 0
        }
    }, [props.selectedCategory])

    useEffect(() => {
        let ele = document.getElementsByClassName('Pane vertical Pane1')
		for (let i = 0; i < ele.length; i++) {
			ele[i].addEventListener("scroll", () => onScrollHandler(ele[i]));
		}
        return () => {
            setPosts(null)
            currentOffset = 0
            window.removeEventListener('scroll', () => onScrollHandler(ele[0]))
        }
    }, [props.selectedCategory])


    const handleSelector = (post) => {
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
                url = `https://twitter.com/a/status/${post.postId}`
                break;
            
            default:
                console.log("Invalid Handle")
        }
    }

    return (
        <div>
            {
                posts ? posts.map(group => {
                    if(group.length === 0)
                        return;
                    let post = null;
                    if(!props.isDuplicate)
                        post = group[0]
                    else
                        post = group
                    handleSelector(post)

                    return (
                        <CardsFeed 
                            key={post.lurkerPostId} 
                            postDetails={post} 
                            postSource={postHandle} 
                            bookmark = {post.bookmark}
                            url = {url}
                            group = {props.isDuplicate ? null:  group.slice(1)}
                            duplicateHandler = {props.isDuplicate ? null: props.duplicateHandler}
                            isDuplicate = {props.isDuplicate}
                        />
                    )
                }) :
                    <h1>No post to display</h1>
            }
        </div>
    )
}

export default Feed


