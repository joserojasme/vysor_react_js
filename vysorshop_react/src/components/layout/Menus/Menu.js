import React, { Component } from 'react';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FacturaIcon from '@material-ui/icons/FileCopy';

class Menu extends Component {
    render() {
        return (
            <List>
                <Link style={{ textDecoration: 'none' }} key={0} to={{
                    pathname: '/bodegas',
                }}>
                    <ListItem button key={0}>
                        <ListItemIcon><FacturaIcon /></ListItemIcon>
                        <ListItemText primary='Bodegas' />
                    </ListItem>
                </Link>
            </List>
        )
    }
}

export default Menu;