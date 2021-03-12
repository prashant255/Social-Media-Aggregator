import React from 'react'

import facebookLogo from '../../assets/facebook.png'
import twitterLogo from '../../assets/twitter.png'
import redditLogo from '../../assets/reddit.png'

import "./SocialLogin.module.css"
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

    return (
        <div>
            <a href={props.loginURL}><img src={iconPath} alt={props.socialName}></img></a>
            <p> {props.socialName} </p>
        </div>
    )
}

export default SocialLogin
