import axios from '../../axios/lurkerBackend'
import React, { useEffect } from 'react'

const SuccessCallback = (props) => {

    useEffect(() => {
        console.log("SuccessCallback")
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
                axios.post("/reddit/callback", params).then(
                    res => {
                        props.history.push('/linksocialmedia')
                    }
                ).catch( e =>
                    console.log("Error")
                );
                break;
            
            case "FACEBOOK":
                params = parseParams(props.location.search)
                axios.post("/facebook/callback", params).then(
                    res => {
                        props.history.push('/linksocialmedia')
                    }
                )
                break;

            case "TWITTER":
                params = parseParams(props.location.search)
                axios.post("twitter/callback", params).then(
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
