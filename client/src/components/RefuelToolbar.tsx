import React, {useState} from 'react';
import Datetime from 'util/Datetime';
import RefuelContainer from 'containers/RefuelContainer';
import { AppBar, Toolbar, Typography, IconButton, ExpansionPanel, ExpansionPanelDetails, Paper, Button, Box, ExpansionPanelActions, TextField, FormControl, InputLabel, Select, MenuItem, Input, OutlinedInput, InputAdornment, Snackbar, FormHelperText, CircularProgress, Collapse, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Refuel from 'models/Refuel';
import RefuelCreator from 'components/RefuelCreator';

interface InputFeedback {
    error: boolean;
    msg: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        button: {
            float: 'right',
            margin: theme.spacing(1),
        },
        buttonProgress: {
            color: '#FFFFFF',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        expansionPanel: {
            backgroundColor: '#FFFFFF'
        }
    })
);

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

const RefuelToolbar = () => {
    const classes = useStyles();

    const [expanded, setExpanded] = useState<boolean>(false);
    const [defaultDate, setDefaultDate] = useState<string>('');
    
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'success' | 'info' | 'warning'>('info');
    const [alertMsg, setAlertMsg] = useState<String>('');

    const openRefuelCreator = () => {
        setDefaultDate(Datetime.now().toISOString().slice(0, 19));
        setExpanded(true);
    }

    const closeRefuelCreator = () => {
        setExpanded(false);
    }

    const handleAddClick = () => {
        if (expanded) {
            closeRefuelCreator();
        } else {
            openRefuelCreator();
        }
    }

    const handleRefuelCreationComplete = (success: boolean) => {
        if (success) {
            console.log("refuel added");
            closeRefuelCreator();
            setAlertSeverity('success');
            setAlertMsg('Successfully created refuel record');
        } else {
            setAlertOpen(true);
            setAlertSeverity('error');
            setAlertMsg('Failed to create refuel record');
        }
            
        setAlertOpen(true);
    }

    return (
        <React.Fragment>
            <AppBar position='fixed'>
                    <Toolbar>
                        <Typography variant='subtitle1' className={classes.title}>
                            Refuel History
                        </Typography>
                        <IconButton>
                            <AddIcon
                                onClick={handleAddClick}
                            />
                        </IconButton>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Toolbar>
                
                    <Collapse in={expanded} className={classes.expansionPanel}>
                        <RefuelCreator
                            defaultDate={defaultDate}
                            onComplete={handleRefuelCreationComplete}
                            onCancel={closeRefuelCreator}
                        />
                    </Collapse>
            </AppBar>
            <Snackbar
                open={alertOpen}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                autoHideDuration={5000}
            >
                <Alert
                    severity={alertSeverity}
                    onClose={() => setAlertOpen(false)}
                >
                    {alertMsg}
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}

export default RefuelToolbar;