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
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 200,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    tableRow: {
        cursor: 'pointer'
    }
});

const columnData = [
    { id: 'BranchName', numeric: false, disablePadding: false, label: 'KCP' },
    { id: 'EmployeeName', numeric: false, disablePadding: false, label: 'Nama' },
    { id: 'Internship', numeric: false, disablePadding: false, label: 'Internship' },
    { id: 'WakeUpCall', numeric: false, disablePadding: false, label: 'WakeUpCall' },
    { id: 'GetHeard', numeric: false, disablePadding: false, label: 'GetHeard' },
    { id: 'TalkTheWalk', numeric: false, disablePadding: false, label: 'TalkTheWalk' },
    { id: 'WalkTheTalk', numeric: false, disablePadding: false, label: 'WalkTheTalk' },
    { id: 'TeamReward', numeric: false, disablePadding: false, label: 'TeamReward' },
];

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class TableActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            order: 'asc',
            orderBy: 'BranchCode',
            keyWord: ""
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleRequestSort = (e, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state[name] = value));
    }

    render() {
        const { classes, data, handleClickRow } = this.props;
        const { page, rowsPerPage, orderBy, order, keyWord } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
            <Paper className={classes.root}>
                <TextField label="Cari Nama/Cabang" onChange={(e) => this.handleChange(e)} style={{ marginLeft: '20px' }}
                    margin="normal" className={classes.textField} name="keyWord" value={keyWord} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHeader order={order} orderBy={orderBy} columnData={columnData} onRequestSort={(e) => this.handleRequestSort(e, orderBy)} />
                        <TableBody>
                            {data
                                .filter(c => { return c.EmployeeName.toLowerCase().indexOf(keyWord) > -1 || c.BranchName.toLowerCase().indexOf(keyWord) > -1 })
                                .sort(getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((n, index) => {
                                    return (
                                        <TableRow className={classes.tableRow} hover key={index} onClick={(e) => handleClickRow(e, n.Username)}>
                                            <TableCell component="th" scope="row">
                                                {n.BranchName}
                                            </TableCell>

                                            <TableCell>{n.EmployeeName}</TableCell>

                                            <TableCell>{(n.Internship === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
                                            <TableCell>{(n.WakeUpCall === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
                                            <TableCell>{(n.GetHeard === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
                                            <TableCell>{(n.TalkTheWalk === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
                                            <TableCell>{(n.WalkTheTalk === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
                                            <TableCell>{(n.TeamReward === '0') ? (<Icon style={{ color: "#c63f3f", fontWeight: "bold" }}>highlight_off</Icon>) : (<Icon style={{ color: "#3fc671", fontWeight: "bold" }}>done</Icon>)}</TableCell>
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

TableActivity.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableActivity);