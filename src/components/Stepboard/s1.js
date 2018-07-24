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

class S1 extends Component {
    
    constructor(props) {
        
        super(props)
        let qs = new URLSearchParams(this.props.location.search);
        this.state = {
            EmployeeCode: qs.get('em'),
            ProjectCode: qs.get('pr'),
            feed: [],
            feedback: [],
            feeder: Object
        }
    }
    componentDidMount() {
        //this.fetchData();
        this.fetchDataAll();
    }

    async fetchDataAll() {
        this.setState({ data: [] });
        await axios.all([this.fetchDataFeed()])
            .then(response => {
                if (response[0].status === 200) {
                    this.setState({ feed: response[0].data });
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

    fetchDataFeed() {
        let qs = new URLSearchParams(this.props.location.search);
        let param = {
            BranchCode : qs.get('br'),
            ProjectCode : qs.get('pr'),
        }
        let urlFeed = "https://api-experdserve.experd.com/api/trx/feed/cr/";
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        if (!qs.has('br'))
            return axios.post(urlFeed, null, { headers: { 'x-access-token': localData.token } });
        return axios.post(urlFeed, param, { headers: { 'x-access-token': localData.token } });
    }

    handleClickBack() {
        this.props.history.goBack();
    }

    render() {
        const { classes } = this.props;
        const { feed } = this.state;
        let qs = new URLSearchParams(this.props.location.search);
        return (
            <div>
                {qs.has('br') ? <div className={classes.buttonBack}>
                    <Button size="large" style={{ color: "#fff" }} onClick={() => this.handleClickBack()}>
                        <Icon className={classes.rightIcon}>navigate_before</Icon> Kembali
                    </Button>
                </div>: null}
                

                <Grid container spacing={0} alignItems="center">

                    {feed.length > 0 ? feed.map(i => {
                        return (
                            <Grid key={i.KdDocument}  item xs={12} sm={12} md={3} lg={3}>
                                <Card className={classes.card}>
                                    {(() => {

                                        switch (i.DocType) {
                                            case 'TW':
                                                return <embed src={"https://experdserve.experd.com/assets/file/" + i.FileName}
                                                    width="100%" height="400" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html" />

                                            case 'IS':
                                                return <video width="100%" height="400" controls>
                                                    <source src={"https://experdserve.experd.com/assets/vid/is/" + i.FileName} type="video/mp4" />
                                                </video>
                                            case 'WK':
                                                return <video width="100%" height="400" controls>
                                                    <source src={"https://experdserve.experd.com/assets/vid/wk/" + i.FileName} type="video/mp4" />
                                                </video>
                                            default:
                                                return <div>TW</div>
                                        }
                                    })()}

                                    <CardContent>
                                        <Typography gutterBottom variant="title">
                                            {i.CreatedBy}
                                        </Typography>
                                        <Typography variant="caption" gutterBottom>
                                            Di unggah pada {dt(i.CreatedDate, "fullDate")}
                                        </Typography>
                                        <Typography component="p">
                                            {i.Descriptions}
                                        </Typography>
                                        <br />
                                        <div style={{ border: "1px solid #fff", borderRadius: "1%" }}>
                                            <Feedback ProjectCode={i.ProjectCode} KdDocument={i.KdDocument} BranchCode={i.BranchCode} />

                                        </div>

                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    }
                    ) : <div>Belum ada data</div>}
                </Grid>
            </div>
        );
    }
}


class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedback: [],
            newFeedback: ""
        }
    }

    fetchDataFeedback() {
        let urlFeedback = "https://api-experdserve.experd.com/api/trx/feedback/cr/";
        let localData = JSON.parse(localStorage.getItem('currentUser'));
        axios.post(urlFeedback, { BranchCode: this.props.BranchCode, ProjectCode: this.props.ProjectCode, KdDocument: this.props.KdDocument }, { headers: { 'x-access-token': localData.token } })
            .then(result => {
                this.setState({ feedback: result.data })
            })
    }

    componentDidMount() {
        this.fetchDataFeedback();
    }

    handleChangeComment(e) {
        const { name, value } = e.target;
        this.setState({
            newFeedback: value
        });
    }

    handleClickSubmitComment(e) {
        e.preventDefault();
        let localDatas = JSON.parse(localStorage.getItem('currentUser'));
        let fd = {
            BranchCode: this.props.BranchCode,
            Feedback: this.state.newFeedback,
            ProjectCode: this.props.ProjectCode,
            KdDocument: this.props.KdDocument,
            CreatedBy: localDatas.username
        }

        if (fd.Feedback) {
            let urlFd = "https://api-experdserve.experd.com/api/trx/feedback";
            axios.post(urlFd, fd, { headers: { 'x-access-token': localDatas.token } })
                .then(response => {
                    if (response.status === 200) {
                        this.fetchDataFeedback();
                        this.setState({
                            newFeedback: ""
                        });
                    }
                })
        }
    }

    render() {
        return (
            <div>
                {this.state.feedback
                    .sort((a, b) => a.CreatedDate > b.CreatedDate)
                    .map(j => {
                        return (<div key={j.KdFeedback} style={{ borderBottom: "#fff solid 1px", padding: "5px", backgroundColor: "#c8e4fb" }}>
                            <div style={{ fontSize: "10px", fontWeight: "bold" }}>{j.CreatedBy} <span style={{ fontSize: "10px", fontWeight: "normal", fontStyle: "italic", color: "#7f7f7f" }}> pada {dt(j.CreatedDate, "fullDate")}</span></div>
                            <div style={{ fontSize: "12px", paddingTop: "3px" }}>{j.Feedback}</div>
                        </div>)
                    })}
                    
                <textarea
                    onChange={e => this.handleChangeComment(e)}
                    value={this.state.newFeedback === null ? "" : this.state.newFeedback}
                    id={this.props.KdDocument} style={{ width: "98%", marginTop:"5px" }} name={this.props.KdDocument}
                />
                
                <Button onClick={(e) => this.handleClickSubmitComment(e)} variant="contained"
                    style={{ float: "right", marginTop: "5px", marginBottom: "25px" }} size="small" color="primary">
                    Kirim
                </Button>
            </div>
        )
    }
}
export default withRouter(withStyles(styles)(S1));