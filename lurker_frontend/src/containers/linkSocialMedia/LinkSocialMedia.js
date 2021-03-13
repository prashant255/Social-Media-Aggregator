import React, { Component } from "react";
import Typist from "react-typist";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import SocialLogin from "../../components/socialLogin/SocialLogin";
import classes from "./LinkSocialMedia.module.css";
import axios from '../../axios/lurkerBackend';

class LinkSocialMedia extends Component {

    state = {
      twitter: false,
      reddit: false,
      facebook: false
    }

    getSocialMediaStatus = () => {
      axios.get("/auth/status").then(status => {
        console.log("status : ", status.data)
        this.setState({
          reddit: status.data.reddit,
          facebook: status.data.facebook,
          twitter: status.data.twitter
        })
        console.log(this.state)
      });
    }

    componentDidMount(){
      this.getSocialMediaStatus();
    }

    render() {
        return (
          <div className={classes.container}>
            <GridList cellHeight={400} cols={3} alignItems='center' justifyContent='center'>
                <GridListTile cols={3}>
                    <Typist avgTypingSpeed={40} cursor={{ show: false }}>
                        <h1 className={classes.title}>Welcome to Lurker!</h1>
                        <Typist.Delay ms={500} />
                        <h3 className={classes.subtitle}>Pick your poison</h3>
                    </Typist>
                </GridListTile>
    
              <GridListTile cols={1}>
                <SocialLogin socialName="Reddit" loginURL="http://localhost:8080/api/reddit/connect" isLinked={this.state.reddit}/>
              </GridListTile>
    
              <GridListTile cols={1} className="twitterLogo">
                <SocialLogin socialName="Twitter" loginURL="http://localhost:8080/api/twitter/connect" />
              </GridListTile>
    
              <GridListTile cols={1}>
                <SocialLogin socialName="Facebook" loginURL="http://localhost:8080/api/facebook/connect" />
              </GridListTile>

            {/* TODO: Add conditional next */}
            </GridList>
          </div>
        );
    }
}

export default LinkSocialMedia

