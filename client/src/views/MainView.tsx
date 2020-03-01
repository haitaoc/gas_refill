import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import RefuelContainer from 'containers/RefuelContainer';
import Refuel from 'models/Refuel';
import { TableSortLabel } from '@material-ui/core';
import RefuelToolbar from 'components/RefuelToolbar';

interface State {
    loaded: boolean;
    refuels: (Refuel | null)[];
    orderBy: keyof Refuel | null;
    order: 'asc' | 'desc';
}

interface HeadCell {
    id: keyof Refuel;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

const defaultState: State = {
    loaded: false,
    refuels: [],
    orderBy: null,
    order: 'asc',
}

const headCells: HeadCell[] = [
    {id: 'date', label: 'Date', numeric: false, sortable: false},
    {id: 'gasPrice', label: 'Gas Price (/100L)', numeric: true, sortable: true},
    {id: 'amountPaid', label: 'Amount Paid', numeric: true, sortable: true},
    {id: 'amountFueled', label: 'Amount Fueled (L)', numeric: true, sortable: true},
    {id: 'curMileage', label: 'Mileage', numeric: true, sortable: true},
]

class MainView extends React.Component<{}, State> {
    constructor() {
        super({});

        this.state = defaultState;
    }

    componentDidMount() {
        RefuelContainer.getAll().then(
            (refuels) => {
                this.setState({refuels: refuels});
            },
            (error) => {
                this.setState({refuels: []});
                console.log(error);
            }
        );
    }

    render() {
        return (
            <React.Fragment>
                <RefuelToolbar />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        {headCells.map((headCell) => 
                            <TableCell
                                key={headCell.id}
                                align={headCell.numeric ? 'right' : 'left'}
                                sortDirection={headCell.sortable && this.state.orderBy == headCell.id? this.state.order : false}
                            >
                                <TableSortLabel
                                    active={this.state.orderBy === headCell.id}
                                    direction={(this.state.orderBy === headCell.id) ? this.state.order : 'asc'}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            </TableCell>
                        )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.refuels.map((refuel) => {
                        if (refuel === null) return null;
                        return (
                            <TableRow key={refuel.id}>
                                <TableCell align="left">{refuel.date}</TableCell>
                                <TableCell align="right">{refuel.gasPrice.toFixed(1)}</TableCell>
                                <TableCell align="right">${refuel.amountPaid.toFixed(2)}</TableCell>
                                <TableCell align="right">{refuel.amountFueled.toFixed(2)}</TableCell>
                                <TableCell align="right">{refuel.curMileage.toFixed(1)}</TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
            </React.Fragment>
        );
    }
}

export default MainView;