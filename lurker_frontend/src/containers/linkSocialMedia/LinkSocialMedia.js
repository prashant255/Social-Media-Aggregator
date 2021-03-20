import React, { Component } from "react";
import Typist from "react-typist";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Button from '../../components/ui/button/Button'
import SocialLogin from "../../components/socialLogin/SocialLogin";

import classes from "./LinkSocialMedia.module.css";

import axios from '../../axios/lurkerBackend';
import { connect } from 'react-redux'

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
		this.props.history.push('/category');
	}

	getUrl = (name) => {
		const backendUrl = "http://localhost:8080";
		const url = `${backendUrl}/api/${name}/connect`;
		return url;
	}

	render() {
		return (
			<div className={classes.container}>
				<GridList cellHeight={220} cols={3} alignItems='center' justifyContent='center'>
					<GridListTile cols={3}>
						<Typist avgTypingSpeed={40} cursor={{ show: false }}>
							<h1 className={classes.title}>Welcome to Lurker!</h1>
						</Typist>
					</GridListTile>

					<GridListTile cols={3}>
						<Typist avgTypingSpeed={40} cursor={{ show: false }}>
							<Typist.Delay ms={1200} />
								<h3 className={classes.subtitle}>Pick your poison</h3>
						</Typist>
					</GridListTile>

					<GridListTile cols={1}>
						<SocialLogin socialName="Reddit" loginURL={this.getUrl("reddit")} isLinked={this.state.reddit} />
					</GridListTile>

					<GridListTile cols={1} className="twitterLogo">
						<SocialLogin socialName="Twitter" loginURL={this.getUrl("twitter")} isLinked={this.state.twitter} />
					</GridListTile>

					<GridListTile cols={1}>
						<SocialLogin socialName="Facebook" loginURL={this.getUrl("facebook")} isLinked={this.state.facebook} />
					</GridListTile>
				</GridList>
				<br/> <br/>
				<div className={classes.Center}>
					<Button btnType="Success" disabled={!(this.state.twitter || this.state.reddit || this.state.facebook)} clicked={this.nextClickHandler}>NEXT</Button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		jwtToken: state.jwtToken
	}
}

export default connect(mapStateToProps, null)(LinkSocialMedia)

