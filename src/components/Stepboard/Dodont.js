import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import 'url-search-params-polyfill';
import * as dt from 'dateformat';
import * as join from '../LibJoin/index';

const styles = {
    card: {
        width: "90%",
        margin: "5%"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    buttonBack: {
        marginTop: "0px",
        width: "100%;",
        padding: "0",
        textAlign: "left",
        backgroundColor: "#2c387e",
        marginBottom: "10px;"
    }
};

class Dodont extends Component {

    constructor(props) {

        super(props)
        this.state = {
            result: [],
            roles: []
        }
    }
    componentDidMount() {
        //this.fetchData();
        this.fetchDataAll();
    }

    async fetchDataAll() {
        this.setState({ data: [] });
        await axios.all([this.fetchDataRole(), this.fetchDataGetHeard()])
            .then(response => {
                if (response[0].status === 200) {
                    const result =
                        join.join(
                            response[0].data,
                            response[1].data,
                            { key1: 'KdRoleplay', key2: 'Roleplay' }
                        );
                    this.setState({
                        result: result
                    });
                    this.setState({
                        roles: response[0].data
                    });
                    setTimeout(() => {
                        console.log(this.state.result);
                    }, 1000);
                }

            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401)
                    this.setState({ showAlert: true, alertMessage: "Gagal Mengambil Data! Sesi telah habis, lakukan login ulang" });
                return false;
            }).then(() => {

            });
    }

    fetchDataRole() {

        let urlrole = "https://api-experdserve.experd.com/api/trx/project_roleplay_active?prj=" + this.props.ProjectCode;
        let localData = JSON.parse(localStorage.getItem('currentUser'));

        return axios.get(urlrole, { headers: { 'x-access-token': localData.token } });
    }

    fetchDataGetHeard() {
        let param = {
            BranchCode: this.props.BranchCode,
            ProjectCode: this.props.ProjectCode,
        }
        let urlGh = "https://api-experdserve.experd.com/api/trx/getheard/cr/";
        let localData = JSON.parse(localStorage.getItem('currentUser'));

        return axios.post(urlGh, param, { headers: { 'x-access-token': localData.token } });
    }

    handleClickBack() {
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;
        const { result, roles } = this.state;
        return (
            <div>
                <Grid container className={classes.root}>
                    {roles.filter(i => { return i.KdRoleplay !== "RL001" }).map(i => {
                        return(
                        <Grid item xs={12}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="body2" gutterBottom>
                                        {i.RoleplayDesc}
                                    </Typography>
                                    <Grid container className={classes.root}>
                                    <Grid item xs={6} style={{background:"#a5ffb1", padding:"2px"}}>
                                    <Typography variant="body1" gutterBottom>Do's</Typography>
                                    {
                                        result.filter(j => {return j.KdRoleplay === i.KdRoleplay && j.Type ===1})
                                        .map(j => {
                                            return (
                                                <Typography variant="caption" gutterBottom>{j.DetailDesc}</Typography>
                                            )
                                        })
                                    }
                                    </Grid>
                                    <Grid item xs={6} style={{background:"#ffa4a4", padding:"2px"}}>
                                    <Typography variant="body1" gutterBottom>Dont's</Typography>
                                    {
                                        result.filter(j => {return j.KdRoleplay === i.KdRoleplay && j.Type ===0})
                                        .map(j => {
                                            return (
                                                <Typography variant="caption" gutterBottom>{j.DetailDesc}</Typography>
                                            )
                                        })
                                    }
                                    </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                        </Grid>
                        )
                    })}

                </Grid>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(Dodont));