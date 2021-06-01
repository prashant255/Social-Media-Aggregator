import { Typography } from '@material-ui/core'
import React, { Component } from 'react'

import classes from './About.module.css'

import Footer from '../../components/ui/footer/Footer'
import Header from '../../components/ui/header/Header'

import facebookLogo from '../../assets/facebook.png'
import twitterLogo from '../../assets/twitter.png'
import redditLogo from '../../assets/reddit.png'

export class About extends Component {
    render() {
        return (
            <Typography>
                <div>
                    <Header />
                    <div className={classes.aboutUs}>
                        <img className={classes.imageAboutUs} src="/about/lurker-about.png" alt="about-us" />
                    </div>
                    <div>
                        <div className={classes.heading}>
                            <h1>Key Features</h1>
                        </div>
                        <div className={classes.featureHolder}>
                            <img src="/about/diagram.png" alt="classification" className={classes.featureImage} />
                            <img src="/about/duplicate.png" alt="duplicate detection" className={classes.featureImage} />
                            <img src="/about/social-media.png" alt="social media" className={classes.featureImage} />
                        </div>
                        <div className={classes.featureHolder}>
                            <span className={classes.featureTitle}><b> Accurate Classification</b></span>
                            <span className={classes.featureTitle}><b> Duplicate Detection </b></span>
                            <span className={classes.featureTitle}><b> Social Media Aggregation </b></span>
                        </div>
                        <div className={classes.heading}>
                            <h1>Why Lurker?</h1>
                        </div>
                        <div className={classes.description}>
                            With the advent of social media, it has become more important than ever to have a social media presence. Social media is a useful tool to keep up with your friends and with what’s going on around the world. However, with the increase of pop- ularity of social media, it is easy to drown in a live feed that updates every second. <br />
                            We propose a solution to categorise, summarise and group duplicates in one’s feed from accounts on multiple social media platforms. Categorisation would help the user choose the topic of interest to explore posts at any given time. All the posts under a topic, including images and video, would then be grouped and summarised. In this process, duplicate posts will also be detected and displayed together.
                        </div>

                        <div className={classes.heading}>
                            <h1>Our Resources</h1>
                        </div>
                        <div className={classes.featureHolder}>
                            <img className={classes.resourceImage} src="/about/node.png"/>
                            <img className={classes.resourceImage} src="/about/react.png"/>
                            <img className={classes.resourceImage} src="/about/tensorflow.png"/>
                            <img className={classes.resourceImage} src="/about/postgres.png"/>
                            <br/>
                            <img className={classes.resourceImage} src={redditLogo}/>
                            <img className={classes.resourceImage} src={twitterLogo}/>
                            <img className={classes.resourceImage} src={facebookLogo}/>
                        </div>
                        <div className={classes.heading}>
                            <h1>Created By</h1>
                        </div>
                        <div className={classes.description}>
                            Lurker was created by Prashant Agrawal, Swapnil Markhedkar, Shruti Phadke and Sudhanshu Bhoi as part of their capstone project for their Bachelor's of Engineering in Computer Engineering.
                        </div>
                    </div>
                    <Footer />
                </div>
            </Typography>
        )
    }
}

export default About
