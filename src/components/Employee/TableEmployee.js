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
    tableRow:{
        cursor:'pointer'
    }
});

const columnData = [
    { id: 'EmployeeCode', numeric: false, disablePadding: false, label: 'EmployeeCode' },
    { id: 'Username', numeric: false, disablePadding: false, label: 'Username' },
    { id: 'EmployeeName', numeric: false, disablePadding: false, label: 'EmployeeName' },
    { id: 'EmployeeNPK', numeric: false, disablePadding: false, label: 'EmployeeNPK' },
];

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class TableEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            order: 'asc',
            orderBy: 'EmployeeCode',
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

    render() {
        const { classes, data,handleClickRow } = this.props;
        const { page, rowsPerPage, orderBy, order } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHeader order={order} orderBy={orderBy} columnData={columnData} onRequestSort={(e) => this.handleRequestSort(e,orderBy)} />
                        <TableBody>
                            {data
                                .sort(getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    return (
                                        <TableRow  className={classes.tableRow} hover key={n.id} onClick={(e)=>handleClickRow(e, n.id)}>
                                            <TableCell component="th" scope="row">
                                                {n.EmployeeCode}
                                            </TableCell>
                                            <TableCell>{n.Username}</TableCell>
                                            <TableCell>{n.EmployeeName}</TableCell>
                                            <TableCell>{n.EmployeeNPK}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6}/>
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

TableEmployee.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableEmployee);