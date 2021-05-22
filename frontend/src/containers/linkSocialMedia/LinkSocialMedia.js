import React, { Component } from "react";
import Typist from "react-typist";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Header from '../../components/ui/header/Header'
import Footer from '../../components/ui/footer/Footer'

import Button from '../../components/ui/button/Button'
import SocialLogin from "../../components/socialLogin/SocialLogin";

import classes from "./LinkSocialMedia.module.css";

import axios from '../../axios/lurkerBackend';
import { connect } from 'react-redux'
import { Typography } from "@material-ui/core";

class LinkSocialMedia extends Component {

	state = {
		twitter: false,
		reddit: false,
		facebook: false
	}

	getSocialMediaStatus = () => {
		axios.get("/auth/status", {
			headers: {
				'Authorization': `Bearer ${this.props.jwtToken}`
			}
		}).then(status => {
			this.setState({
				reddit: status.data.reddit,
				facebook: status.data.facebook,
				twitter: status.data.twitter
			})
		});
	}

	componentDidMount() {
		this.getSocialMediaStatus();
	}

	nextClickHandler = () =>{
		this.props.history.push('/feed');
	}

	getUrl = (name) => {
		const backendUrl = "http://localhost:8080";
		const url = `${backendUrl}/api/${name}/connect`;
		return url;
	}

	showUnlink = (socialName) => {
		const url = "http://localhost:8080/api/"+socialName+"/unlink";

		axios.post(url, {}, {
			headers: {
				'Authorization': `Bearer ${this.props.jwtToken}`
			}
		}).then(status => {
			switch(socialName) {
				case "reddit":
					this.setState({
						reddit: false
					});
					break;
				case "facebook":
					this.setState({
						facebook: false
					});
					break;
				case "twitter":
					this.setState({
						twitter: false
					});
					break;
			}
		}).catch(e => {
			console.log(e);
		});
		
	}

	render() {
		return (
			<Typography>
			<div className={classes.background}>
				<Header/>
				<div className={classes.centerAll}>
				<GridList cellHeight={'auto'} cols={3} alignItems='center' justifyContent='center'>
					<GridListTile cols={3}>
						<Typist avgTypingSpeed={40} cursor={{ show: false }}>
							<h1 className={classes.title}>Choose what you see.</h1>
						</Typist>
					</GridListTile>

					<GridListTile cols={1}>
						<SocialLogin socialName="Reddit" loginURL={this.getUrl("reddit")} isLinked={this.state.reddit} />
						{this.state.reddit ? <p className={classes.removeAccess} onClick={()=>this.showUnlink("reddit")}>remove access</p> : <p></p>}
					</GridListTile>

					<GridListTile cols={1} className="twitterLogo">
						<SocialLogin socialName="Twitter" loginURL={this.getUrl("twitter")} isLinked={this.state.twitter} />
						{this.state.twitter ? <p className={classes.removeAccess} onClick={()=>this.showUnlink("twitter")}>remove access</p> : <p></p>}
					</GridListTile>

					<GridListTile cols={1}>
						<SocialLogin socialName="Facebook" loginURL={this.getUrl("facebook")} isLinked={this.state.facebook} />
						{this.state.facebook ? <p className={classes.removeAccess} onClick={()=>this.showUnlink("facebook")}>remove access</p> : <p></p>}
					</GridListTile>
				</GridList>
				<br/>
				<div className={classes.Center}>
					<Button btnType="Success" disabled={!(this.state.twitter || this.state.reddit || this.state.facebook)} clicked={this.nextClickHandler}>NEXT</Button>
				</div>
				<br/>
				</div>
			</div>
			<Footer/>
			</Typography>
		);
	}
}

// cursor: not-allowed;

const mapStateToProps = state => {
	return {
		jwtToken: state.jwtToken
	}
}

export default connect(mapStateToProps, null)(LinkSocialMedia)

