import React from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import Page404 from '../../components/Page404/Page404'

function authentication() {
    return (
        <Switch>
            <Route path = "/register" render = {() => <p>Register</p>} />
            <Route path = "/login" render = {() => <p>Login</p>} />
            <Redirect from = "/" exact to = "/login" />
            <Route component = {Page404} />
        </Switch>
    )
}

export default authentication
