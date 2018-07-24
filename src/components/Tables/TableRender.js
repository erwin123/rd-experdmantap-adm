import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';

import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHeader from './TableHeader';
import TableToolbar from './TableToolbar';
import TableSel from './TableCellBranch';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});



class TableRender extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: this.props.dataTable,
            columnData: this.props.columnData,
            page: 0,
            rowsPerPage: 5,
        };
    }

    getSorting(order, orderBy) {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy });
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { classes } = this.props;
        const { data, order, orderBy, selected, rowsPerPage, page, columnData } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        
        return (
            <Paper className={classes.root}>
                <TableToolbar numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <TableHeader numSelected={selected.length} order={order} orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick} onRequestSort={this.handleRequestSort}
                            rowCount={data.length} columnData={columnData} />
                        <TableBody>
                            <TableSel dataTable={data} columnData={columnData}/>
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination component="div" count={data.length} rowsPerPage={rowsPerPage} page={page}
                    backIconButtonProps={{ 'aria-label': 'Previous Page', }} nextIconButtonProps={{ 'aria-label': 'Next Page', }}
                    onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage} />
            </Paper>
        );
    }
}

TableRender.propTypes = {
    classes: PropTypes.object.isRequired,
    dataTable: PropTypes.array.isRequired,
    columnData: PropTypes.array.isRequired,
};

export default withStyles(styles)(TableRender);
