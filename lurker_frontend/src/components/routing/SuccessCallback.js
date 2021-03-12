import axios from 'axios';
import React from 'react'
import { Redirect } from 'react-router-dom'

const successCallback = (props) => {

    console.log("SuccessCallback")
    //?state=redditlurker123&code=DGnCjtvcnoFDAjPF56MbcWEc9FZwwQ#_
    const parseParams = (params = "") => {
        const rawParams = params.replace("?", "").split("&");
        const extractedParams = {};
        rawParams.forEach((item) => {
            item = item.split("=");
            extractedParams[item[0]] = item[1];
        });
        return extractedParams;
    };
    
    console.log("props : ",props);

    switch(props.socialMedia){
        case "REDDIT":
            console.log("reddit");
            const params = parseParams(props.location.search); // returns an object like:
            // console.log(props.location.search)
            console.log(params);
            try{
            axios.post("http://localhost:8080/api/reddit/callback", params)
            }catch(e){
                console.log("Error")
            };
            break;
        
        case "FACEBOOK":
            console.log("facebook");
            break;

        case "TWITTER":
            console.log("twitter");
            break;

        default:
            console.log("Wrong props!");
    }
    
    return (
        <div>
            Successful! redirecting...
        </div>
    )
}

export default React.memo(successCallback)
