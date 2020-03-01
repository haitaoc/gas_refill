import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'slices/Root';

const refuelStateSelector = (state: RootState) => state.refuel;

export {
    refuelStateSelector,
};