import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import Refuel from 'models/Refuel';

const requestAdd: CaseReducer<RefuelState, PayloadAction<Refuel>> = (state, action) => {
    const newState = {
        ...state,
        refuelToAdd: action.payload,
        addStatus: RequestStatus.InProgress
    };
    return newState;
}

const recieveAdd: CaseReducer<RefuelState, PayloadAction<Refuel | null>> = (state, action) => {
    const status = (action.payload === null) ? RequestStatus.Error : RequestStatus.Success;

    const newState = {
        ...state,
        refuelToAdd: null,
        addStatus: status
    };
    return newState;
}

const requestGetAll: CaseReducer<RefuelState, PayloadAction<{}>> = (state, action) => {
    const newState = {
        ...state,
        fetchStatus: RequestStatus.InProgress
    };
    return newState;
}

const recieveGetAll: CaseReducer<RefuelState, PayloadAction<Refuel[] | null>> = (state, action) => {
    if (action.payload === null) {
        return {
            ...state,
            fetchStatus: RequestStatus.Error
        };
    }

    return {
        ...state,
        refuels: action.payload,
        fetchStatus: RequestStatus.Success
    };
}

export enum RequestStatus {
    InProgress,
    Success,
    Error,
    None
}

export interface RefuelState {
    refuelToAdd: Refuel | null;
    addStatus: RequestStatus;
    refuels: Refuel[];
    fetchStatus: RequestStatus;
}

const defaultRefuelState: RefuelState = {
    refuelToAdd: null,
    addStatus: RequestStatus.None,
    refuels: [],
    fetchStatus: RequestStatus.None,
}

const refuelSlice = createSlice({
    name: 'refuel',
    initialState: defaultRefuelState,
    reducers: {
        requestAdd,
        recieveAdd,
        requestGetAll,
        recieveGetAll
    }
});

const {
    actions,
    reducer
} = refuelSlice;

export {
    actions,
    reducer
}

export default refuelSlice;