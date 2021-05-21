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
							Copyright © {now}
						</Toolbar>
					</AppBar>
				</div>
		)
}

export default Footer

