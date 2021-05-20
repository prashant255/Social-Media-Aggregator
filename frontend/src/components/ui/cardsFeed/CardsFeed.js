import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
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
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import MobileStepper from '@material-ui/core/MobileStepper';

var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const CardsFeed = (props) => {

    const jwtToken = useSelector(state => state.jwtToken)
    const [feedData, setFeedData] = useState(null)
    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    }

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    useEffect(() => {
        //Switch Statement for Twitter, Reddit and Facebook
        //Add headers
        switch(props.postDetails.handle) {
            case constants.HANDLES.TWITTER:
                axios.get(`http://localhost:8080/api/twitter/post/${props.postDetails.postId}`, { headers }).then(
                    res => 
                        setFeedData(res.data)
                ).catch(
                    e => console.log(e)
                )
                break;
            case constants.HANDLES.REDDIT:
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
            } 
            else if (feedData.images.length==1){
                mediaPost = (
                    <CardMedia
                        component="img"
                        src={feedData.images[0]}
                    />
                )
            }
            else if (feedData.images.length >1) {
                mediaPost = (
                    <div>
                        <img
                            className={classes.img}
                            src={feedData.images[activeStep]}
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
                        <Avatar aria-label={feedData.senderName} className={classes.avatar} src={feedData.senderImage} isMaximized={true} />
                    }
                    action={
                        <props.postSource/>
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
