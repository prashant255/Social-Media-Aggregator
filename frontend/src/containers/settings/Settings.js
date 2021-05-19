import React, { Component } from 'react'

import Header from '../../components/ui/header/Header'

import classes from './Settings.module.css'

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

class Settings extends Component {

    render() {
        return (
            <div>
                <Header />
                <Drawer
                    className={classes.drawer}
                    variant="permanent" >
                    <div className={classes.drawerContainer}>
                        <List>
                            {['Lurker Account', 'Linked Social Media', 'Edit Categories'].map((text) => (
                                <ListItem button key={text}>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default Settings
