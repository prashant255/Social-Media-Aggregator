import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import Signup from '../../containers/authentication/signup/Signup'
import Login from '../../containers/authentication/login/Login'
import Page404 from '../page404/Page404'
import Cards from '../../containers/categories/Categories'
import SuccessCallback from './SuccessCallback'
// import SuccessCallback2 from './SuccessCallback2'
import LinkSocialMedia from '../../containers/linkSocialMedia/LinkSocialMedia'

const routing = () => {
    console.log("ROUTING!");
    return (
        <Switch>
            <Route path = "/register" component = {Signup} />
            <Route path = "/login" component  = {Login} />
            <Route path = "/category" component  = {Cards} />
            <Redirect from = "/" exact to = "/login" />
            <Route 
                path="/callback/reddit"  
                component={(props) => <SuccessCallback {...props} socialMedia="REDDIT" />}
            />
            <Route 
                path="/callback/facebook"  
                component={(props) => <SuccessCallback socialMedia="FACEBOOK" />}
            />
            <Route 
                path="/callback/twitter"  
                component={(props) => <SuccessCallback socialMedia="TWITTER" />}
            />
            <Route path="/linkSocialMedia" component={LinkSocialMedia}/>
            <Route component = {Page404} />
        </Switch>
    )
}

export default React.memo(routing)
