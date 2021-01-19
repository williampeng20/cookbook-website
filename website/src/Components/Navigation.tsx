import React from 'react';
 
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../util/routeUtils';
import { logUserOut, getUserCookie } from '../util/authUtils';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuBook from '@material-ui/icons/MenuBook';

export default function Navigation() {
    let history = useHistory();
    const [state, setState] = React.useState({
        drawerOpen: false,
    });
    const toggleDrawer = (open: boolean) => {
        setState({ drawerOpen: open });
    };
    const logOut = () => {
        logUserOut();
        history.push(ROUTES.signin);
    }
    const goToPage = (page: string) => {
        history.push(page);
    }

    const list = (
        <div
            onClick={() => toggleDrawer(false)}
        >
            <List>
                <ListItem button key={"Home"} onClick={() => goToPage(ROUTES.home)}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Home"} />
                </ListItem>
                <ListItem button key={"Recipes"} onClick={() => goToPage(ROUTES.recipeList)}>
                    <ListItemIcon>
                        <MenuBook />
                    </ListItemIcon>
                    <ListItemText primary={"Recipes"} />
                </ListItem>
                <ListItem button key={"Log out"} onClick={() => logOut()}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log out"} />
                </ListItem>
            </List>
        </div>
    );
    const hidden = history.location.pathname === ROUTES.signin || (history.location.pathname === ROUTES.home && !getUserCookie());
    return (
        <div>
            {!hidden ? (
                <IconButton
                    aria-label="open"
                    onClick={() => toggleDrawer(true)}
                >
                    <ExpandMoreIcon color="primary"/>
                </IconButton>
            ) : undefined}
            <Drawer anchor= "top" open={state.drawerOpen} onClose={() => toggleDrawer(false)}>
                {list}
            </Drawer>
        </div>
    );
}