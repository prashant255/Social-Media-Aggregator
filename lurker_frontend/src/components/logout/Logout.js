import React from 'react'
import Aux from '../../hoc/Aux/Aux'
import { useDispatch } from 'react-redux'
import * as actionTypes from '../../store/actions'
import { Redirect } from 'react-router-dom'

const Logout = () => {

    const dispatch = useDispatch()
    const logout  = () => {
        dispatch({
            type: actionTypes.AUTH_TOKEN, jwtToken: null, name: null
        })
    }
    return (
        <Aux>
            {logout()}
            <Redirect to = "/login" />
        </Aux>
    )
}

export default Logout