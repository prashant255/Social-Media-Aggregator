import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import Signup from '../../containers/authentication/signup/Signup'
import Login from '../../containers/authentication/login/Login'
import Page404 from '../page404/Page404'

function routing() {
    return (
        <Switch>
            <Route path = "/register" component = {Signup} />
            <Route path = "/login" component  = {Login} />
            <Redirect from = "/" exact to = "/login" />
            <Route component = {Page404} />
        </Switch>
    )
}

export default routing
