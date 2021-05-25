import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import * as actionTypes from '../../../store/actions'

import parse from 'html-react-parser'

import classes from './CardsFeed.module.css'

import * as constants from '../../../constants'
import axios from '../../../axios/lurkerBackend'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import MobileStepper from '@material-ui/core/MobileStepper';

var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const CardsFeed = (props) => {

    const jwtToken = useSelector(state => state.jwtToken)
    const [feedData, setFeedData] = useState(null)
    const [bookmarkSelected, setBookmarkSelected] = useState(props.bookmark)
    const [voteStatus, setVoteStatus] = useState(null)
    const dispatch = useDispatch()
    let posts = useSelector(state => state.posts)

    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    }
    
    const bookmarkClickHandler = () => {
        axios.post(`/bookmark/${props.postDetails.lurkerPostId}`, {}, {
            headers
        }).then(res => res.data !== '' ? setBookmarkSelected(res.data): setBookmarkSelected(null))    
    }

    const redditVote = () => {
        const voteUrl = '/reddit/vote'
        const data = {
            id: props.postDetails.postId,
            dir: voteStatus ? 0 : 1
        }
        return {voteUrl, data}
    }

    const voteClickHandler = () => {
        
        let voteUrl='', data = {}

        switch(props.postDetails.handle){
            case constants.HANDLES.TWITTER:
                return;
            case constants.HANDLES.REDDIT:
                ({voteUrl, data} = redditVote());
                break;
            case constants.HANDLES.FACEBOOK:
                return
        }

        axios.post(voteUrl, data, {
            headers
        }).then(() => {
            if(voteStatus) setVoteStatus(null)
            else setVoteStatus(true)
        })
    }

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const fetchFromCache = (postId) => {
        let currPost = null

        posts.map(post => {
            if (post.id === postId)
                currPost = post
            return null
        })

        if (currPost) {
            setFeedData(currPost)
            return true
        }

        return false
    }

    const addToCache = (url) => {
        axios.get(url, { headers }).then(
            res => {
                setFeedData(res.data)

                dispatch({
                    type: actionTypes.POSTS,
                    post: { ...res.data, id: props.postDetails.postId }
                })
            }
        ).catch(
            e => console.log(e)
        )
    }

    const getVoteStatus = (url) => {
        axios.get(url, {headers}).then(status => {
            if(status.data === 1)
                setVoteStatus(true);
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        //Switch Statement for Twitter, Reddit and Facebook
        //Add headers

        const baseUrl = 'http://localhost:8080/api/'

        switch (props.postDetails.handle) {
            case constants.HANDLES.TWITTER:
                if (fetchFromCache(props.postDetails.postId))
                    break; //if true, then it was already present in cache
                addToCache(`${baseUrl}twitter/post/${props.postDetails.postId}`)
                break;

            case constants.HANDLES.REDDIT:
                getVoteStatus(`${baseUrl}reddit/post/${props.postDetails.postId}/voteStatus`)
                if (fetchFromCache(props.postDetails.postId)) break;
                addToCache(`${baseUrl}reddit/post/${props.postDetails.postId}`)
                break;

            case constants.HANDLES.FACEBOOK:
                console.log("Facebook")
                break;
            default:
                console.log("Invalid Handle")
        }

    }, [])

    let mediaPost = null
    let displayFeed = null
    if (feedData !== null) {
        if (feedData.videos !== null) {
            mediaPost = (
                <CardMedia
                    // className={classes.media}
                    component="video"
                    src={feedData.videos}
                    controls
                    autoplay
                />
            )
        }
        else if (feedData.images.length === 1) {
            mediaPost = (
                <CardMedia
                    component="img"
                    src={feedData.images[0]}
                />
            )
        }
        else if (feedData.images.length > 1) {
            mediaPost = (
                <div>
                    <img
                        className={classes.img}
                        src={feedData.images[activeStep]}
                        alt='feed'
                    />
                    <MobileStepper
                        variant="dots"
                        steps={feedData.images.length}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === feedData.images.length - 1}>
                                <KeyboardArrowRight />
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}>
                                <KeyboardArrowLeft />
                            </Button>
                        }
                    />
                </div>

            )
        }

        displayFeed = (
            <Card className={classes.Card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={feedData.senderName} className={classes.avatar} src={feedData.senderImage} />
                    }
                    action={
                        <props.postSource />
                    }
                    title={feedData.senderName}
                    subheader={
                        dayjs(feedData.createdAt).fromNow()
                    }
                />
                {mediaPost}
                {feedData.text ?
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {parse(parse(feedData.text))}
                        </Typography>
                    </CardContent> : null
                }
                <CardActions>
                    <IconButton aria-label="add to favorites" onClick = {voteClickHandler} >
                    {voteStatus ? <FavoriteIcon style={{ color: "#fb3958" }} /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="bookmark" size="medium" onClick = {bookmarkClickHandler}>
                        {/* NOTE: unfilled bookmark icon to denote "not selected" also imported above */}
                        {bookmarkSelected !== null ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                </CardActions>
            </Card>
        )
    }

    return (
        <div>
            {displayFeed}
        </div>
    )
}

export default CardsFeed
