import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { useSelector } from 'react-redux'

import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import LinkIcon from '@material-ui/icons/Link';
import CategoryIcon from '@material-ui/icons/Category';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Logout from '../../logout/Logout'
import DeleteProfileModal from '../modal/deleteProfile/DeleteProfile'

import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	headerColor: {
		backgroundColor: '#152b50'
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	logo: {
		width: '10%',
	},
	offset: theme.mixins.toolbar,
}));

const Header = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [showLogoutComponent, setShowLogoutComponent] = React.useState(false);
	const [deleteProfileOpen, setDeleteProfileOpen] = React.useState(false);
	const history = useHistory();
	const userName = useSelector(state => state.name)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	// Custom style from Material-UI documentation
	const StyledMenu = withStyles({
		paper: {
			border: '1px solid #d3d4d5',
		},
	})((props) => (
		<Menu
			elevation={0}
			getContentAnchorEl={null}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			{...props}
		/>
	));

	const StyledMenuItem = withStyles((theme) => ({
		root: {
			'&:focus': {
				backgroundColor: '#152b50',
				'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
					color: theme.palette.common.white,
				},
			},
		},
	}))(MenuItem);

	const handleOpenModal = (state) => {
		setDeleteProfileOpen(state);
	};
	const logoutClickHandler = () => {
		setShowLogoutComponent(true)
	}

	const deleteAccountHanlder = () => {
		handleClose()
		setDeleteProfileOpen(true)
	}

	const bookmarkClickHandler = () => {
		handleClose()
		history.push('/bookmark')
	}

	const linkSocialMediaHandler = () => {
		handleClose()
		history.push('/linksocialmedia')
	}

	const changeCategoryHandler = () => {
		handleClose()
		history.push('/category')
	}

	return (
		<div className={classes.root}>
			{showLogoutComponent ? <Logout /> : null}
			<DeleteProfileModal open={deleteProfileOpen} handleModal={handleOpenModal} />
			<AppBar position="fixed">
				<Toolbar className={classes.headerColor}>
					<div className={classes.title}>
						<img src="./lurker-logo-small.png" className={classes.logo} alt={'Lurker'} />
					</div>

					<Typography>
						{userName}
					</Typography>
					<IconButton color="inherit" onClick={handleClick}>
						<AccountCircle />
					</IconButton>

					<div className={classes.menuButton}>
						<StyledMenu
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>


							<StyledMenuItem>
								<ListItemIcon>
									<InfoIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="About" />
							</StyledMenuItem>

							<StyledMenuItem onClick={bookmarkClickHandler}>
								<ListItemIcon>
									<BookmarksIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Bookmarks" />
							</StyledMenuItem>

							<StyledMenuItem onClick={linkSocialMediaHandler}>
								<ListItemIcon>
									<LinkIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Link Handles" />
							</StyledMenuItem>

							<StyledMenuItem onClick={changeCategoryHandler}>
								<ListItemIcon>
									<CategoryIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Change Categories" />
							</StyledMenuItem>

							<StyledMenuItem onClick={deleteAccountHanlder}>
								<ListItemIcon>
									<DeleteForeverIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Delete Account" />
							</StyledMenuItem>

							<StyledMenuItem onClick={logoutClickHandler}>
								<ListItemIcon>
									<ExitToAppIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</StyledMenuItem>
						</StyledMenu>
					</div>
				</Toolbar>
			</AppBar>

			{/* To make it sticky */}
			<div className={classes.offset} />
		</div>
	)
}

export default Header

