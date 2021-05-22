import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Feed from '../../../containers/feed/Feed'

import axios from '../../../axios/lurkerBackend'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Aux from '../../../hoc/Aux/Aux';

const drawerWidth = "18%";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		textTransform: 'capitalize',
	},
	drawerPaper: {
		width: drawerWidth,
		marginTop: '5%',
		height: '100%',
		zIndex: 0,
	},
	drawerContentHeader: {
		marginLeft: 'auto',
		marginRight: 'auto',
		color: '#999',
	},
	content: {
		minHeight: '90vh',
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
}));

const LeftDrawer = () => {
	const classes = useStyles();
	const jwtToken = useSelector(state => state.jwtToken)
	const [categories, setCategories] = useState(null)
	const [categoriesToDisplay, setCategoriesToDisplay] = useState('all')
	const [displayDrawer, setDisplayDrawer] = useState(false)
	let feed = <Feed selectedCategory={categoriesToDisplay} type={'layout'} />
	const history = useHistory();
	let drawer = null;

	const headers = {
		'Authorization': `Bearer ${jwtToken}`
	}

	useEffect(async () => {
		try{
			const status = await axios.get('/auth/status', {
				headers
			})
			if (!status.data.twitter && !status.data.facebook && !status.data.reddit){
				await history.push('/linksocialmedia')
				return
			}
			const res = await axios.get('/settings/categories', {
					headers
			})	
			if (res.data.length === 0){
				await history.push('/category')
				return
			}
			else
				setCategories(res.data.selectedCategory)
		} catch(e) {
			console.log(e)
		}
		setDisplayDrawer(true)
	}, [])

	const categoryClickHandler = (category) => {
		feed = null
		setCategoriesToDisplay(category)
	}

	if (displayDrawer) {
		drawer = (
			<Aux>
				<CssBaseline />
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}
					anchor="left"
				>
					<div className={classes.toolbar} />
					<h2 className={classes.drawerContentHeader}> Selected Categories </h2>
					<List>
						{/* TODO: 
            1. Change the icons or remove them if we don't wanna include it
            2. Add All(All selected categories post to be diaplayed) in the categories list*/}

						{categories != null ? categories.map((text, index) => (
							<ListItem button key={text}
								onClick={() => categoryClickHandler(text)}>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						)) : null}
					</List>
					<Divider />
					<h2 className={classes.drawerContentHeader}> Others </h2>
					<List>
						{/* Get the list of all non-selected categories. */}
						{['Celebrity', 'Politics', 'Sports'].map((text, index) => (
							<ListItem button key={text}>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
					</List>
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{feed}
				</main>
			</Aux>
		)
	}

	return (
		<div className={classes.root}>
			{drawer}
		</div>
	);
}

export default LeftDrawer