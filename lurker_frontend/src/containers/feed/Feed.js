import React, { Component } from 'react'

// import FacebookIcon from '@material-ui/icons/Facebook';
// import TwitterIcon from '@material-ui/icons/Twitter';
// import RedditIcon from '@material-ui/icons/Reddit';

import FeedCard from '../../components/ui/cardsFeed/CardsFeed'
import Header from '../../components/ui/header/Header'

export class Feed extends Component {
    render() {
        return (
            <div>
                {/* TODO: Remove hardcoded name (maybe add name to Redux store?) */}
                <Header name="Swapnil Markhedkar"></Header>
                <FeedCard
                    id = {1}
                    userName = {"Shruti Phadke"}
                    postTimeStamp = {"March 20, 2021"}
                    profilePicture = {"test"}
                    imageSource = {"https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FImage&psig=AOvVaw0IZlHIPH-5SjQp-4CaLN37&ust=1616332747122000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIDivez6vu8CFQAAAAAdAAAAABAD"}
                    // postSource = {FacebookIcon} // Facebook | Reddit | Twitter
                    caption = {"test3 this is a caption hello world"}
                />
            </div>
        )
    }
}

export default Feed
