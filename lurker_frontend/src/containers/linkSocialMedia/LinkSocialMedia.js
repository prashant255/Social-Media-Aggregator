import React, { Component } from "react";
import Typist from "react-typist";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import SocialLogin from "../../components/socialLogin/SocialLogin";
import classes from "./LinkSocialMedia.module.css";

class LinkSocialMedia extends Component {
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
                <SocialLogin socialName="Reddit" loginURL="http://localhost:8080/api/reddit/connect" />
              </GridListTile>
    
              <GridListTile cols={1} className="twitterLogo">
                <SocialLogin socialName="Twitter" loginURL="http://localhost:8080/api/twitter/connect" />
              </GridListTile>
    
              <GridListTile cols={1}>
                <SocialLogin socialName="Facebook" loginURL="http://localhost:8080/api/facebook/connect" />
              </GridListTile>
    
            </GridList>
          </div>
        );
    }
}

export default LinkSocialMedia

