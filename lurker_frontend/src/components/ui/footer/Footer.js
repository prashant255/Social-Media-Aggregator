import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
		text: {
			padding: theme.spacing(2, 2, 0),
		},
		paper: {
			paddingBottom: 50,
		},
		list: {
			marginBottom: theme.spacing(2),
		},
		subheader: {
			backgroundColor: theme.palette.background.paper,
		},
		appBar: {
			top: 'auto',
			bottom: 0,
		},
		grow: {
			flexGrow: 1,
		},
		fabButton: {
			position: 'absolute',
			zIndex: 1,
			top: -30,
			left: 0,
			right: 0,
			margin: '0 auto',
		},
	}));

const Footer = () =>{
		const classes = useStyles();
		const now = new Date().getFullYear();

		return (
				<div>
					<AppBar color="white" className={classes.appBar} >
						<Toolbar align = "center" justify = "center" alignItems = "center">
							Copyright © {now}
						</Toolbar>
					</AppBar>
				</div>
		)
}

export default Footer

