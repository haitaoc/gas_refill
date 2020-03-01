import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, ExpansionPanel, ExpansionPanelDetails, Paper, Button, Box, ExpansionPanelActions, TextField, FormControl, InputLabel, Select, MenuItem, Input, OutlinedInput, InputAdornment, Snackbar, FormHelperText, CircularProgress, Collapse, Grid, makeStyles, Theme, createStyles } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { refuelStateSelector } from 'selectors/RefuelSelector';
import { actions, RequestStatus } from 'slices/RefuelSlice';
import Refuel from 'models/Refuel';
import RefuelContainer from 'containers/RefuelContainer';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        button: {
            float: 'right',
            margin: theme.spacing(1),
        },
        buttonProgress: {
            color: theme.palette.primary.main,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        grid: {
            position: 'relative'
        }
    })
);

const {
    requestAdd,
    recieveAdd
} = actions;

interface InputFeedback {
    error: boolean;
    msg: string;
}

const mapState = refuelStateSelector;
const mapDispatch = {
    requestAdd,
    recieveAdd
};

const connector = connect(
    mapState,
    mapDispatch
);

type ReduxProps = ConnectedProps<typeof connector>;

interface LocalProps {
    defaultDate: string;
    onComplete: (success: boolean) => void;
    onCancel: () => void;
}

type Props = LocalProps & ReduxProps;

const defaultInputFeedback: InputFeedback = {
    error: false,
    msg: ''
};

const defaultRefuelInputState = {
    vehicle: '',
    date: '',
    gasPrice: 100.9,
    amountPaid: 0.00,
    curMileage: 0.0
};

const RefuelCreator = (props: Props) => {
    const classes = useStyles();

    const [vehicle, setVehicle] = useState<string>(defaultRefuelInputState.vehicle);
    const [date, setDate] = useState<string>(defaultRefuelInputState.date);
    const [gasPrice, setGasPrice] = useState<number>(defaultRefuelInputState.gasPrice);
    const [amountPaid, setAmountPaid] = useState<number>(defaultRefuelInputState.amountPaid);
    const [curMileage, setCurMileage] = useState<number>(defaultRefuelInputState.curMileage);

    const [vehicleFeedback, setVehicleFeedback] = useState<InputFeedback>(defaultInputFeedback);

    const handleRefuelCreate = () => {
        if (vehicle === '') {
            setVehicleFeedback({
                error: true,
                msg: 'Required field'
            });
            return;
        }

        const curDate = (date === '') ? props.defaultDate : date;
        const refuel: Refuel = new Refuel('', vehicle, curDate, gasPrice, amountPaid, curMileage);
        props.requestAdd(refuel);

        RefuelContainer.putOne(refuel)
        .then(
            (res) => {
                props.recieveAdd(res);
                props.onComplete(true);
            },
            (error) => {
                props.recieveAdd(null);
                props.onComplete(false);
            }
        );
    }

    return (
        <React.Fragment>
            <FormControl
                variant='outlined'
                className={classes.formControl} 
                error={vehicleFeedback.error}
            >
                <InputLabel id='vehicle_nickname_select_label'>Vehicle</InputLabel>
                <Select
                    labelId='vehicle_nickname_select_label'
                    id='vehicle_nickname_select'
                    labelWidth={55}
                    value={vehicle}
                    onChange={(event) => {
                        const value = event.target.value;

                        if (value === '') {
                            setVehicleFeedback({
                                error: true,
                                msg: 'Required field'
                            });
                        } else {
                            setVehicleFeedback(defaultInputFeedback);
                        }
                        setVehicle(String(value));
                    }}
                >
                    <MenuItem value='Q5'>Q5</MenuItem>
                    <MenuItem value='A5'>A5</MenuItem>
                </Select>
                <FormHelperText>{vehicleFeedback.msg}</FormHelperText>
            </FormControl>
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel htmlFor='date_picker'>Refueled at</InputLabel>
                <OutlinedInput
                    id='date_picker'
                    type='datetime-local'
                    labelWidth={85}
                    value={(date === '') ? props.defaultDate : date}
                    onChange={(event) => setDate(String(event.target.value))}
                />
            </FormControl>
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel htmlFor='gas_price_input'>Gas price</InputLabel>
                <OutlinedInput
                    type='number'
                    startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                    labelWidth={70}
                    inputProps={{
                        min: 0,
                        step: 0.1
                    }}
                    value={gasPrice}
                    onChange={(event) => setGasPrice(Number(event.target.value))}
                />
            </FormControl>
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel htmlFor='amount_paid_input'>Amount paid</InputLabel>
                <OutlinedInput
                    type='number'
                    startAdornment={<InputAdornment position='start'>$</InputAdornment>}
                    labelWidth={95}
                    value={amountPaid}
                    inputProps={{
                        min: 0,
                        step: 0.01
                    }}
                    onChange={(event) => setAmountPaid(Number(event.target.value))}
                />
            </FormControl>
            <FormControl variant='outlined' className={classes.formControl}>
                <InputLabel htmlFor='current_mileage_input'>Current mileage</InputLabel>
                <OutlinedInput
                    type='number'
                    endAdornment={<InputAdornment position='end'>km</InputAdornment>}
                    labelWidth={120}
                    value={curMileage}
                    inputProps={{
                        min: 0,
                        step: 0.1
                    }}
                    onChange={(event) => setCurMileage(Number(event.target.value))}
                />
            </FormControl>
            <Grid container direction='row-reverse'>
                <Button
                    size='small'
                    className={classes.button}
                    onClick={() => props.onCancel()}
                >
                    Cancel
                </Button>
                <Grid item className={classes.grid}>
                    <Button
                        size='small'
                        color='primary'
                        variant='contained'
                        className={classes.button}
                        disabled={props.addStatus === RequestStatus.InProgress}
                        onClick={handleRefuelCreate}
                    >
                        Add
                    </Button>
                    {(props.addStatus === RequestStatus.InProgress)
                        && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default connector(RefuelCreator);