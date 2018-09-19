import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
    { id: 'ProjectName', numeric: false, disablePadding: false, label: 'Project' },
    { id: 'BranchName', numeric: false, disablePadding: false, label: 'Kantor Cabang' },
    { id: 'EmployeeName', numeric: false, disablePadding: false, label: 'Nama' },
    { id: 'EmployeeNPK', numeric: false, disablePadding: false, label: 'Nomor Induk' },
];

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class Tablestaytune extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            order: 'asc',
            orderBy: 'id',
            keyWord:''
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

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(state => (state[name] = value));
      }

    render() {
        const { classes, data,handleClickRow } = this.props;
        const { page, rowsPerPage, orderBy, order,keyWord} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
            <br/>
            <TextField label="Cari Nama/Nomor Induk/Cabang" onChange={(e) => this.handleChange(e)} style={{marginLeft:'20px', width:'300px'}}
            margin="normal" className={classes.textField} name="keyWord" value={keyWord} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHeader order={order} orderBy={orderBy} columnData={columnData} onRequestSort={(e) => this.handleRequestSort(e,orderBy)} />
                        <TableBody>
                            {data
                                .sort(getSorting(order, orderBy))
                                .filter(c => { return c.EmployeeName.toLowerCase().indexOf(keyWord) > -1 || c.EmployeeNPK.toLowerCase().indexOf(keyWord) > -1 ||
                                    c.EmployeeBranchName.toLowerCase().indexOf(keyWord) > -1})
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    return (
                                        <TableRow  className={classes.tableRow} hover key={n.id} onClick={(e)=>handleClickRow(e, n.id)}>
                                            <TableCell component="th" scope="row">
                                                {n.ProjectName}
                                            </TableCell>
                                            <TableCell>{n.EmployeeBranchName}</TableCell>
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

Tablestaytune.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tablestaytune);