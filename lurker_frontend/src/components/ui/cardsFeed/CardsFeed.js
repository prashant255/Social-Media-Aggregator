import React, {useEffect, useState} from 'react'

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
import * as constants from '../../../constants'
import axios from 'axios'
import parse from 'html-react-parser'

const CardsFeed = (props) => {

    const [feedData, setFeedData] = useState(null)

    useEffect(() => {
        //Switch Statement for Twitter, Reddit and Facebook
        switch(props.postDetails.handle) {
            case constants.HANDLES.TWITTER:
                console.log("Twitter")
                
                break;
            case constants.HANDLES.REDDIT:
                console.log("Reddit")
                axios.get(`https://api.reddit.com/by_id/${props.postDetails.postId}`).then(
                    res => 
                        setFeedData(res.data.data.children[0].data)
                ).catch(
                    e => console.log(e)
                )
                break;
            case constants.HANDLES.FACEBOOK:
                console.log("Facebook")  
                break;  
        }
 
    }, [])

    let displayFeed = null
    if(feedData !== null) {

    console.log(feedData.selftext_html)
            displayFeed = (
            <Card className={classes.Card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={feedData.author} className={classes.avatar} src={props.profilePicture} />
                    }
                    // action={
                    //     props.postSource
                    // }
                    title={feedData.subreddit}
                    subheader={props.postTimeStamp}
                />
                <CardMedia
                    // className={classes.media}
                    component = "img"
                    image = {props.imageSource}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {parse(parse(feedData.selftext_html))}
                    </Typography>
                </CardContent>
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
