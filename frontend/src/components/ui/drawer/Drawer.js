import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Feed from '../../../containers/feed/Feed'

import axios from '../../../axios/lurkerBackend'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Aux from '../../../hoc/Aux/Aux';
import styled from "styled-components";
import SplitPane from "react-split-pane";

const drawerWidth = "20%";

const Wrapper = styled.div`
  .Resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Pane1 {
    overflow: scroll 
  }
  .Pane2 {
    overflow: scroll
  }
`;

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
		zIndex: 0,
		height: '85vh'
	},
	drawerContentHeader: {
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 0,
		fontSize: 18,
		color: '#999',
	},
	content: {
		minHeight: '86vh',
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
	splitView: {
		marginLeft: '20%',
		height: '85vh !important'
	}
}));

const LeftDrawer = (props) => {

	const classes = useStyles();
	const jwtToken = useSelector(state => state.jwtToken)
	const [categories, setCategories] = useState(null)
	const [categoriesToDisplay, setCategoriesToDisplay] = useState('all')
	const [displayDrawer, setDisplayDrawer] = useState(false)
	const [duplicatePosts, setDuplicatePosts] = useState(null)
	const allCategoriesList = ['all', 'celebrity', 'entertainment', 'gaming','travel', 'health', 'motivation', 'promotions', 'sport', 'tech', 'business', 'miscellaneous', 'finance','news', 'politics'];

	const onClickDuplicateHandler = (groups) => {
		setDuplicatePosts(groups)
	} 

	const getCategoryIcon = (category) => {
		switch(category) {
			case 'all':
				return 'category'
			case 'celebrity': 
				return 'theater_comedy'
			case 'entertainment':
				return 'movie'
			case 'gaming':
				return 'sports_esports'
			case 'travel':
				return 'flight_takeoff'
			case 'health':
				return 'health_and_safety'
			case 'motivation':
				return 'self_improvement'
			case 'promotions':
				return 'ads_click'
			case 'sport':
				return 'sports_soccer'
			case 'tech':
				return 'devices'
			case 'business':
				return 'business'
			case 'miscellaneous':
				return 'summarize'
			case 'finance':
				return 'account_balance'
			case 'news':
				return 'article'
			case 'politics':
				return 'headphones'
		}
	}

	let feed = <Feed selectedCategory={categoriesToDisplay} type={props.type} duplicateHandler = {(groups) => onClickDuplicateHandler(groups)} isDuplicate = {false}/>
	//Add duplicate part here.

	let duplicate = null;
	if(duplicatePosts !== null)
		duplicate = <Feed selectedCategory={categoriesToDisplay} isDuplicate = {true} duplicatePosts = {duplicatePosts}/>
	else 
		duplicate = <div style={{textAlign: 'center', padding: '2%'}}><h3>Duplicates if found, will be displayed here. Look for a ((+) icon!</h3></div>
		
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
			else{
				let categoryToSet = res.data.selectedCategory
				categoryToSet.unshift("all")
				setCategories(categoryToSet)
			}
		} catch(e) {
			console.log(e)
		}
		setDisplayDrawer(true)
	}, [])

	const categoryClickHandler = (category) => {
		feed = null
		setDuplicatePosts(null)
		setCategoriesToDisplay(category)
	}

	const getAutoFocusValue = (category) => {
		if(category === categoriesToDisplay)
			return true;
		return false;
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
					<h2 className={classes.drawerContentHeader}> Selected Categories </h2>
					<List>
						
						{categories != null ? categories.map((text, index) => (
							<ListItem button key={text} selected = {getAutoFocusValue(text)}
								onClick={() => categoryClickHandler(text)}>
								<ListItemIcon>
									<span className="material-icons">
										{getCategoryIcon(text)}
									</span>
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						)) : null}
					</List>
					<Divider />
					<h2 className={classes.drawerContentHeader}> Others </h2>
					<List>
						{/* Get the list of all non-selected categories. */}
						{(categories !== null && categories.length !== 15) ? allCategoriesList.filter( ( el ) => !categories.includes( el ) ).map((text, index) => (
							<ListItem button key={text} selected = {getAutoFocusValue(text)}
							onClick={() => categoryClickHandler(text)}>
								<ListItemIcon>
									<span className ="material-icons">
										{getCategoryIcon(text)}
									</span>
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						)): null}
					</List>
				</Drawer>
				<main className={classes.content}>
				<Wrapper>
					<SplitPane
					className = {classes.splitView}
					split="vertical"
					defaultSize="50%"   
					>
					<div>
						{feed}
					</div>
					<div>
						{duplicate}
					</div>
					</SplitPane>
					</Wrapper>
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