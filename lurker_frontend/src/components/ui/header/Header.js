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

import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

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
	offset: theme.mixins.toolbar
}));

const Header = (props) => {
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

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

	return (
		<div className={classes.root}>
			<AppBar position="fixed">
				<Toolbar className={classes.headerColor}>
					<Typography className={classes.title}>
						Lurker
                    </Typography>

					<Typography>
						{props.name}
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
									<SettingsIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="Settings" />
							</StyledMenuItem>
							<StyledMenuItem>
								<ListItemIcon>
									<InfoIcon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary="About" />
							</StyledMenuItem>
							<StyledMenuItem>
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
