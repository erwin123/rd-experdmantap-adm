import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import { logout } from '../Service/AuthService';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'react-router-dom';

import { connect } from "react-redux";
import { delUser } from "../../js/actions/index";

const styles = {
    root: {
        flexGrow: 1,
    },
    bgNavBar:{
        backgroundColor:"#2196f3"
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250
    },
    myLink: {
        textDecoration: "none"
    }
};

const mapDispatchToProps = dispatch => {
    return {
        delUser: username => dispatch(delUser(username))
    };
};

let menu = [{ text: "Beranda", icon: "home", link: "/home", ic: true },
{ text: "Cabang", icon: "domain", link: "/branch", ic: false },
{ text: "Role", icon: "accessibility_new", link: "/roleplay", ic: false },
{ text: "Project", icon: "description", link: "/project", ic: false },
{ text: "Acc & Employee", icon: "assignment_ind", link: "/employee", ic: false },
{ text: "Standar Service", icon: "assignment_ind", link: "/stdservice", ic: false },
{ text: "Aspek Fisik", icon: "assignment_ind", link: "/aspek", ic: false },
{ text: "Feedback", icon: "hearing", link: "/feedback", ic: true },
{ text: "Do's n Dont's", icon: "ballot", link: "/s3", ic: true },
{ text: "Staytune", icon: "graphic_eq", link: "/staytune", ic: true }]



class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    renderMenu(classes) {
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        if (localData) {
            if (localData.ic === 0) {
                menu = menu.filter(i => i.ic === false)
            }
            return (
                menu.map((item) =>
                    <List key={item.text}>
                        <Link to={item.link} className={classes.myLink} onClick={() => this.props.menuClicked(item.text)}>
                            <ListItem button>
                                <ListItemIcon><Icon className={classes.icon}>{item.icon}</Icon></ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </Link>
                    </List>

                ));
        } else {
            return null
        }
    }

    logoutLink(classes) {
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        if (localData) {
        return (
            <List>
                <ListItem button onClick={(e) => this.logout()}>
                    <ListItemIcon><Icon className={classes.icon}>exit_to_app</Icon></ListItemIcon>
                    <ListItemText primary="Keluar" />
                </ListItem>
            </List>
        )}
        else{
            return null
        }
    }

    logout() {
        logout();
        this.props.history.push("/login");
    }

    toggleDrawer(showed, e) {
        this.setState({ show: showed });
    };

    render() {
        const { classes } = this.props;
        let localData = JSON.parse(localStorage.getItem('currentUser'));

        return (
            <div className={classes.root}>
                <AppBar position="static" style={{background:'rgb(245,245,245, 0.7)', color:"#084F8F"}}>
                    <Toolbar>
                        {localData ? <IconButton onClick={(e) => this.toggleDrawer(true, e)} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton> : null}
                        <img src={require('../../assets/logo.png')} height="33" width="100" alt=""/>
                        <Typography variant="title" color="inherit" style={{right:"0",marginRight:"25px", position:"absolute"}}>
                        &nbsp;{this.props.title}
                        </Typography>
                        <Drawer open={this.state.show} onClose={e => this.toggleDrawer(false)}>
                            <div tabIndex={0} role="button" style={{color:"#084F8F"}}
                                onClick={e => this.toggleDrawer(false)}
                                onKeyDown={e => this.toggleDrawer(false)}>
                                <img src={require('../../assets/logo.webp')} height="33" width="100" alt="" style={{marginLeft:"10px", marginTop:"10px"}}/>
                                &nbsp; Administrative
                                <div className={classes.list}>
                                    {this.renderMenu(classes)}
                                    <Divider />
                                    {this.logoutLink(classes)}
                                </div>

                            </div>
                        </Drawer>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }


}
Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

const HeaderConn = connect(null, mapDispatchToProps)(Header);

export default withRouter(withStyles(styles)(HeaderConn));