import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
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
class TableCellBranch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected
        };
    }

    componentWillMount(){
        this.setState(state => (state.selected= this.props.selected));
    }
    componentDidMount(){
        
        console.log(this.state.selected);
    }

    getSorting(order, orderBy) {
        return order === 'desc'
            ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
            : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
    }

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

    isSelected = id => {
        
        this.state.selected.indexOf(id) !== -1;
    }

    render() {
        if (this.props.dataTable.length === 0) {
            return null
        }
        const { order, orderBy, rowsPerPage, page } = this.props;
        return (
            <TableBody>
                {this.props.dataTable
                    .sort(this.getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                        const isSelected = this.isSelected(n.id);
                        
                        return (
                            <TableRow
                                hover
                                onClick={event => this.handleClick(event, n.id)}
                                role="checkbox"
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={n.id}
                                selected={isSelected}>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isSelected} />
                                </TableCell>
                                <TableCell component="th" scope="row" padding="none">
                                    {n.BranchCode}
                                </TableCell>
                                <TableCell>{n.BranchName}</TableCell>
                                <TableCell>{n.BranchCity}</TableCell>
                            </TableRow>
                        );
                    })}
                {this.props.emptyRows > 0 && (
                    <TableRow style={{ height: 49 * this.props.emptyRows }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                )}
            </TableBody>
        );
    }
}

TableCellBranch.propTypes = {
    classes: PropTypes.object.isRequired,
    dataTable: PropTypes.array.isRequired
};

export default withStyles(styles)(TableCellBranch);