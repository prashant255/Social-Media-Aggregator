import React from 'react'

import facebookLogo from '../../assets/facebook.png'
import twitterLogo from '../../assets/twitter.png'
import redditLogo from '../../assets/reddit.png'

import classes from "./SocialLogin.module.css"
import { Link, Route, Redirect } from 'react-router-dom'

const SocialLogin = (props) => {
    console.log(props)
    let iconPath=""

    if(props.socialName==="Reddit"){
        iconPath=redditLogo
    }
    else if(props.socialName==="Facebook"){
        iconPath=facebookLogo
    }
    else{
        iconPath=twitterLogo
    }

    const renderImage = () => {
        if(props.isLinked){
            return <img className={classes.imgLinked} src={iconPath} alt={props.socialName}></img>
        }else{
            return (
                <a href={props.loginURL}>
                    <img className={classes.img} src={iconPath} alt={props.socialName}></img>
                </a>
            )
        }
    }

    return (
        <div>
            {renderImage()}
            <p> {props.socialName} </p>
        </div>
    )
}

export default SocialLogin
