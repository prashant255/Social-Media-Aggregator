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

import MobileStepper from '@material-ui/core/MobileStepper';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CardsFeed = (props) => {

    const jwtToken = useSelector(state => state.jwtToken)
    const [feedData, setFeedData] = useState(null)
    const [bookmarkSelected, setBookmarkSelected] = useState(props.bookmark)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const dispatch = useDispatch()
    let posts = useSelector(state => state.posts)
    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    }

    const bookmarkClickHanlder = () => {
        axios.post(`/bookmark/${props.postDetails.lurkerPostId}`, {}, {
            headers
        }).then(res => {
            if (res.data !== '') {
                setSnackbarOpen(true)
                setBookmarkSelected(res.data)
            }
            else {
                setSnackbarOpen(true)
                setBookmarkSelected(null)
            }
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

    useEffect(() => {
        //Switch Statement for Twitter, Reddit and Facebook
        //Add headers

        if (fetchFromCache(props.postDetails.postId))
            return; //if true, then it was already present in cache

        switch (props.postDetails.handle) {
            case constants.HANDLES.TWITTER:
                addToCache(`http://localhost:8080/api/twitter/post/${props.postDetails.postId}`)
                break;

            case constants.HANDLES.REDDIT:
                addToCache(`http://localhost:8080/api/reddit/post/${props.postDetails.postId}`)
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
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="bookmark" size="medium" onClick={bookmarkClickHanlder}>
                        {/* NOTE: unfilled bookmark icon to denote "not selected" also imported above */}
                        {bookmarkSelected !== null ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        <Snackbar
                            autoHideDuration={2000}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            open={snackbarOpen}
                            onClose={() => setSnackbarOpen(false)}
                        >
                            {bookmarkSelected !== null ?
                                <Alert onClose={() => setSnackbarOpen(false)} severity="success"> Bookmark Added </Alert>
                                :
                                <Alert onClose={() => setSnackbarOpen(false)} severity="error"> Bookmark Removed </Alert>
                            }
                        </Snackbar>
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
