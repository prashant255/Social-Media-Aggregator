import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'

import * as constants from '../../../constants'
import axios from '../../../axios/lurkerBackend'

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';

import classes from './CardsFeed.module.css'

var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const CardsFeed = (props) => {

    const jwtToken = useSelector(state => state.jwtToken)
    const [feedData, setFeedData] = useState(null)
    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    }

    useEffect(() => {
        //Switch Statement for Twitter, Reddit and Facebook
        //Add headers
        switch(props.postDetails.handle) {
            case constants.HANDLES.TWITTER:
                console.log("Twitter")
                axios.get(`http://localhost:8080/api/twitter/post/${props.postDetails.postId}`, { headers }).then(
                    res => 
                        setFeedData(res.data)
                ).catch(
                    e => console.log(e)
                )
                break;
            case constants.HANDLES.REDDIT:
                console.log("Reddit")
                axios.get(`http://localhost:8080/api/reddit/post/${props.postDetails.postId}`, { headers }).then(
                    res => 
                        setFeedData(res.data)
                ).catch(
                    e => console.log(e)
                )
                break;
            case constants.HANDLES.FACEBOOK:
                console.log("Facebook")  
                break;  
        }
 
    }, [])
   
    let mediaPost = null
    let displayFeed = null
    if(feedData !== null) {
            if(feedData.videos !== null) {
                mediaPost = (
                    <CardMedia
                    // className={classes.media}
                        component = "video"
                        src = {feedData.videos}
                        controls
                        autoplay
                    />
                )
            } else if (feedData.images.length >0) {
                mediaPost = (
                    <CardMedia
                        component = "img"
                        src = {feedData.images[0]}
                    />
                )
            }

            displayFeed = (
            <Card className={classes.Card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={feedData.senderName} className={classes.avatar} src={feedData.senderImage} />
                    }
                    action={
                        <props.postSource/>
                    }
                    title={feedData.senderName}
                    subheader={ 
                        dayjs(feedData.createdAt).fromNow()
                    }
                />
                {console.log(mediaPost)}
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
