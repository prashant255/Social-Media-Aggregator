import React from 'react'
import classes from './Page404.module.css'

function Page404() {
    return (
        <div className = {classes.Page404}>
            <p className = {classes.Text404}>404</p>
            <p className = {classes.TextOops}>Ooops!</p>
            <p>That page doesn't exist or is unavailable</p>
        </div>
    )
}

export default Page404
