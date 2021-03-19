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
		facebook: false,
	}

	getSocialMediaStatus = () => {
		console.log(this.props.jwtToken)
		axios.get("/auth/status", {
			headers: {
				'Authorization': `Bearer ${this.props.jwtToken}`
			}
		}).then(status => {
			console.log("status : ", status.data)
			this.setState({
				reddit: status.data.reddit,
				facebook: status.data.facebook,
				twitter: status.data.twitter
			})
			console.log(this.state)
		});
	}

	componentDidMount() {
		this.getSocialMediaStatus();
	}

	nextClickHandler = () =>{
		this.props.history.push('/category');
	}

	render() {
		return (
			<div className={classes.container}>
				<GridList cellHeight={'auto'} cols={3} alignItems='center' justifyContent='center'>
					<GridListTile cols={3}>
						<Typist avgTypingSpeed={40} cursor={{ show: false }}>
							<h1 className={classes.title}>Welcome to Lurker!</h1>
						</Typist>
						<Typist.Delay ms={900} />
						<h3 className={classes.subtitle}>Pick your poison</h3>
					</GridListTile>

					{/* <GridListTile cols={3}>
						<Typist avgTypingSpeed={40} cursor={{ show: false }}>
							
						</Typist>
					</GridListTile> */}

					<GridListTile cols={1}>
						<SocialLogin socialName="Reddit" loginURL="http://localhost:8080/api/reddit/connect" isLinked={this.state.reddit} />
					</GridListTile>

					<GridListTile cols={1} className="twitterLogo">
						<SocialLogin socialName="Twitter" loginURL="http://localhost:8080/api/twitter/connect" isLinked={this.state.twitter} />
					</GridListTile>

					<GridListTile cols={1}>
						<SocialLogin socialName="Facebook" loginURL="http://localhost:8080/api/facebook/connect" isLinked={this.state.facebook} />
					</GridListTile>
				</GridList>
				{/* <br/> <br/> */}
				<div className={classes.Center}>
					<Button btnType="Success" disabled={!(this.state.twitter || this.state.reddit || this.state.facebook)} clicked={this.nextClickHandler}>NEXT</Button>
					{console.log("status", this.state.twitter || this.state.reddit || this.state.facebook)}
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

