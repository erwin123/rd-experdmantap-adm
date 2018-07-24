import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHeader from '../Tables/TableHeader';
import TablePagination from '@material-ui/core/TablePagination';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import TableEmployee from '../Employee/TableEmployee';
import Icon from '@material-ui/core/Icon';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 100,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    tableRow: {
        cursor: 'pointer'
    }
});

const columnData = [
    { id: 'ProjectCode', numeric: false, disablePadding: false, label: 'ProjectCode' },
    { id: 'ProjectName', numeric: false, disablePadding: false, label: 'ProjectName' },
    { id: 'Start', numeric: false, disablePadding: false, label: 'Start' },
    { id: 'End', numeric: false, disablePadding: false, label: 'End' },
    { id: 'Week', numeric: false, disablePadding: false, label: 'Week' },
];

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class TableProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            order: 'asc',
            orderBy: 'ProjectCode',
            participant: [],
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleRequestSort = (e, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy });
    };

    
    handleClickAddEmp(e){
        this.props.history.push("/projectparticipant");
    }

    render() {
        const { classes, data, handleClickRow } = this.props;
        const { page, rowsPerPage, orderBy, order, participant } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHeader order={order} orderBy={orderBy} columnData={columnData} onRequestSort={(e) => this.handleRequestSort(e, orderBy)} />
                        <TableBody>
                            {data
                                .sort(getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    return (
                                        <TableRow className={classes.tableRow} hover key={n.id} onClick={(e) => handleClickRow(e, n.id)}>
                                            <TableCell component="th" scope="row">
                                                {n.ProjectCode}
                                                <BadgeParticipant handleClickAddEmp={(e) =>this.handleClickAddEmp(e)}
                                                projectcode={n.ProjectCode} />
                                            </TableCell>
                                            <TableCell padding="checkbox">{n.ProjectName}</TableCell>
                                            <TableCell padding="checkbox">{n.Start}</TableCell>
                                            <TableCell padding="checkbox">{n.End}</TableCell>
                                            <TableCell padding="checkbox">{n.Week}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


class BadgeParticipant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: "",
            empData: [],
            showDetail: false,
        }
    }

    createData(id, employee) {
        return {
            id,
            EmployeeCode: employee.EmployeeCode,
            EmployeeName: employee.EmployeeName,
            EmployeeNPK: employee.EmployeeNPK,
            BranchCode: employee.BranchCode,
            Username: employee.Username,
            RolePlay: employee.RolePlay,
        };
    }

    componentDidMount() {
        const url = "https://api-experdserve.experd.com/api/trx/project_employee/cr/";
        const localData = JSON.parse(localStorage.getItem('currentUser'));
        let result = "";
        let empColl = [];
        setTimeout(() => {
            axios.post(url, { Project_ProjectCode: this.props.projectcode }, { headers: { 'x-access-token': localData.token } })
                .then(response => {
                    if (response.status === 200) {
                        result = String(response.data.length);
                        if (result === "") {
                            return this.setState({ count: "" });
                        } else {
                            empColl = response.data;
                            return this.setState({ count: result });
                        }
                    }
                }).catch(error => {
                    console.log(error);
                }).then(() => {
                    const url_em = "https://api-experdserve.experd.com/api/trx/employee/cr/";
                    for (let i = 0; i < empColl.length; i++) {
                        axios.post(url_em, { EmployeeCode: empColl[i].Employee_EmployeeCode }, { headers: { 'x-access-token': localData.token } })
                            .then(response => {
                                if (response.status === 200) {
                                   
                                    this.setState({
                                        empData: [...this.state.empData, this.createData(i + 1, response.data[0])]
                                    });
                                }
                            }).catch(error => { })
                            .then(() => {
                                
                            })
                    }
                })
        }, 100);
    }

    handleClickParticipant(e) {
        e.stopPropagation();
        this.setState({ showDetail: true });
        console.log(this.props.projectcode);
    }

    closeModal(e) {
        e.stopPropagation();
        this.setState({ showDetail: false });
    }

    handleClickRow(e, id) {
        e.stopPropagation();
        console.log(id);
    }

    render() {
        if (this.state.count === "" && this.state.empData.length !== this.state.count) {
            return (
                <div style={{ fontSize: '10px' }}>
                    Unduh data <CircularProgress size={10} />
                </div>)
        }
        return (
            <div onClick={(e) => this.handleClickParticipant(e)} style={{ boxShadow: '1px 1px 1px 1px #ccc', fontSize: '10px', background: '#303f9f', color: '#fff', width: '70%', padding: "2px", borderRadius: '3px' }}>
                {this.state.count} participant
                <Dialog fullScreen open={this.state.showDetail} TransitionComponent={Transition} 
                    aria-labelledby="alert-dialog-slide-title" onClose={(e) => this.closeModal(e)}
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">
                        Detail Participant
                    </DialogTitle>
                    <DialogContent>
                        <TableEmployee data={this.state.empData} handleClickRow={(e, id) => this.handleClickRow(e, id)} />
                    </DialogContent>
                    <DialogActions style={{marginRight:'50px'}}>
                        <Button variant="outlined" onClick={(e) => this.closeModal(e)} color="primary">
                            Ok
                        </Button>
                        <Button variant="contained" onClick={(e) => this.props.handleClickAddEmp(e)} color="primary">
                            Tambah Participant&nbsp;
                                        <Icon>add</Icon>
                        </Button>

                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

TableProject.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(TableProject));