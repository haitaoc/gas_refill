import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'slices/Root';

const refuelStateSelector = (state: RootState) => state.refuel;

const refuelHistorySelector = (state: RootState) => {
    return {
        fetchStatus: state.refuel.fetchStatus,
        refuels: state.refuel.refuels
    };
}

export {
    refuelStateSelector,
    refuelHistorySelector
};