import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
		root: {
			overflow: 'auto'
		},
		text: {
			padding: theme.spacing(2, 2, 0),
		},
		paper: {
			paddingBottom: 50,
		},
		appBar: {
			bottom: 0,
			color: 'black',
			backgroundColor: 'white',
			position: 'sticky',
		},
		grow: {
			flexGrow: 1,
		}
	}));

const Footer = () =>{
		const classes = useStyles();
		const now = new Date().getFullYear();

		return (
				<div className = {classes.root}>
					<AppBar className={classes.appBar}>
						<Toolbar align = "center" justify = "center" >
							<span> Copyright © {now} </span>
                            <span style={{flex: 1}}></span>
                            <span><a href='https://www.freepik.com/vectors/people'>All images created by pch vector</a></span>
						</Toolbar>
					</AppBar>
				</div>
		)
}

export default Footer

