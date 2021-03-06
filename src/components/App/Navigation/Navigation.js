import React from 'react'
import { Link } from 'react-router-dom'
import Hidden from '@material-ui/core/Hidden'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MessageIcon from '@material-ui/icons/Message'
import EventIcon from '@material-ui/icons/Event'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const drawerWidth = 320

const styles = theme => ({
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    toolbar: theme.mixins.toolbar,
    link: {
        textDecoration: 'none',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
    }
})

class Navigation extends React.Component {
    render() {
        const { classes, theme } = this.props
        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <List>
                    <Link className={classes.link} to="/" onClick={this.props.handleCloseDrawer}>
                        <ListItem button>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </Link>
                    <Link className={classes.link} to="/events" onClick={this.props.handleCloseDrawer}>
                        <ListItem button>
                            <ListItemIcon>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItem>
                    </Link>
                    <Link className={classes.link} to="/conversations" onClick={this.props.handleCloseDrawer}>
                        <ListItem button>
                            <ListItemIcon>
                                <MessageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Conversations" />
                        </ListItem>
                    </Link>
                    <Link className={classes.link} to="/profile" onClick={this.props.handleCloseDrawer}>
                        <ListItem button>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItem>
                    </Link>
                </List>
            </div>
        )
        return (
            <div>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.props.openMobile}
                        onClose={this.props.handleCloseDrawer}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <IconButton className={classes.closeButton} onClick={this.props.handleCloseDrawer}>
                            <ArrowBackIcon />
                        </IconButton>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Navigation)
