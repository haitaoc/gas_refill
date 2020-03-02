import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Refuel from 'models/Refuel';
import { connect, ConnectedProps } from 'react-redux';
import { actions, RequestStatus } from 'slices/RefuelSlice';
import RefuelContainer from 'containers/RefuelContainer';
import { refuelHistorySelector } from 'selectors/RefuelSelector';
import { CircularProgress } from '@material-ui/core';

interface HeadCell {
    id: keyof Refuel;
    label: string;
    numeric: boolean;
    sortable: boolean;
}

const headCells: HeadCell[] = [
    {id: 'date', label: 'Date', numeric: false, sortable: false},
    {id: 'gasPrice', label: 'Gas Price (/100L)', numeric: true, sortable: true},
    {id: 'amountPaid', label: 'Amount Paid', numeric: true, sortable: true},
    {id: 'amountFueled', label: 'Amount Fueled (L)', numeric: true, sortable: true},
    {id: 'curMileage', label: 'Mileage (km)', numeric: true, sortable: true},
]

const {
    requestGetAll,
    recieveGetAll
} = actions;

const mapState = refuelHistorySelector;
const mapDispatch = {
    requestGetAll,
    recieveGetAll
};

const connector = connect(
    mapState,
    mapDispatch
);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps;

const RefuelHistoryTable = (props: Props) => {
    const [orderBy, setOrderBy] = useState<keyof Refuel | null>(null);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        props.requestGetAll();
        RefuelContainer.getAll()
        .then(
            (res) => {
                props.recieveGetAll(res);
            },
            (error) => {
                props.recieveGetAll(null);
            }
        );
    }, []);

    const sortRefuels = (refuels: (Refuel | null)[]): (Refuel | null)[] => {
        let sortedRefuels = [...refuels];

        sortedRefuels.sort((first, second) => {
            if (first === null || second === null) return 0;

            const firstDate = Date.parse(first.date);
            const secDate = Date.parse(second.date);

            if (firstDate > secDate) {
                return -1;
            } else if (firstDate < secDate) {
                return 1;
            }
            return 0;
        });

        return sortedRefuels;
    }

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                    {headCells.map((headCell) => 
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            sortDirection={headCell.sortable && orderBy == headCell.id? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={(orderBy === headCell.id) ? order : 'asc'}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    )}
                    </TableRow>
                </TableHead>
                <TableBody>
                {sortRefuels(props.refuels).map((refuel) => {
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
                {props.fetchStatus === RequestStatus.InProgress && <CircularProgress size={50} />}
            </Table>
        </TableContainer>
    );
}

export default connector(RefuelHistoryTable);