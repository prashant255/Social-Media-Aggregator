import React from 'react'

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


import classes from '../cardsFeed/CardsFeed.module.css'

import SvgIcon from '@material-ui/core/SvgIcon';

function CardsFeed(props) {
    console.log(props)

    return (
        <div>
            <Card className={classes.Card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={props.userName} className={classes.avatar} src={props.profilePicture}>
                            S
                        </Avatar>
                    }
                    // action={
                    //     props.postSource
                    // }
                    title={props.userName}
                    subheader={props.postTimeStamp}
                />
                <CardMedia
                    // className={classes.media}
                    component = "img"
                    image = {props.imageSource}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.caption}
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
        </div>
    )
}

export default CardsFeed
