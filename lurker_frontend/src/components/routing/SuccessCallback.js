import axios from '../../axios/lurkerBackend'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const SuccessCallback = (props) => {

    const jwtToken = useSelector(state => state.jwtToken)
    
    useEffect(() => {
        const parseParams = (params = "") => {
            const rawParams = params.replace("?", "").split("&")
            const extractedParams = {}
            rawParams.forEach((item) => {
                item = item.split("=")
                extractedParams[item[0]] = item[1]
            })
            return extractedParams
        }
        console.log("props : ",props)
        let params = null
            
        switch(props.socialMedia){
            case "REDDIT":
                params = parseParams(props.location.search) // returns an object like:
                axios.post("/reddit/callback", params, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }).then(
                    res => {
                        props.history.push('/linksocialmedia')
                    }
                ).catch( e =>
                    console.log("Error")
                );
                break;

            case "TWITTER":
                params = parseParams(props.location.search) // returns an object like:
                axios.post("/twitter/callback", params, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }).then(
                    res => {
                        props.history.push('/linksocialmedia')
                    }
                ).catch( e =>
                    console.error(e)
                );
                break;


            case "FACEBOOK":
                params = parseParams(props.location.search)
                axios.post("/facebook/callback", params, {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }).then(
                    res => {
                        props.history.push('/linksocialmedia')
                    }
                )
                break;

            default:
                console.log("Wrong props!");
        }
        return () => {
            
        }
    }, [])
    
    return (
        <div>
            Successful! redirecting...
        </div>
    )
}

export default SuccessCallback
