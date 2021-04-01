import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import Signup from '../../containers/authentication/signup/Signup'
import Login from '../../containers/authentication/login/Login'
import Page404 from '../page404/Page404'
import Cards from '../../containers/categories/Categories'
import SuccessCallback from './SuccessCallback'
import LinkSocialMedia from '../../containers/linkSocialMedia/LinkSocialMedia'
import Settings from '../../containers/settings/Settings'
// import ClippedDrawer from '../../containers/settings/ClippedDrawer'
import Aux from '../../hoc/Aux/Aux'
import Feed from '../../containers/feed/Feed'

import { useSelector } from 'react-redux'


const Routing = () => {

    const isAuthenticated = useSelector(state => state.jwtToken !== null)
    
    let routes  = (
        <Switch>
            <Route path = "/register" component = {Signup} />
            <Route path = "/login" component  = {Login} />
            <Redirect from = "/" exact to = "/login" />
            <Route component = {Page404} />
        </Switch>
    )

    if(isAuthenticated) {
        routes = (
            <Switch>
                <Route path = "/register" component = {Signup} />
                <Route path = "/login" component  = {Login} />
                <Route path = "/category" component  = {Cards} />
                <Route path = "/feed" component = {Feed} />
                <Route 
                    path="/callback/reddit"  
                    component={(props) => <SuccessCallback {...props} socialMedia="REDDIT" />}
                />
                <Route 
                    path="/callback/facebook"  
                    component={(props) => <SuccessCallback {...props} socialMedia="FACEBOOK" />}
                />
                <Route 
                    path="/callback/twitter"  
                    component={(props) => <SuccessCallback {...props} socialMedia="TWITTER" />}
                />
                <Route path="/linkSocialMedia" component={LinkSocialMedia}/>
                <Route path = "/settings" component = {Settings}/>
                <Redirect from = "/" exact to = "/feed" />
                <Route component = {Page404} />
            </Switch>
        )
    }

    return (
        <Aux>
            {routes}
        </Aux>
    )
}

export default Routing
