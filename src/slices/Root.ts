import refuelSlice from 'slices/RefuelSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    refuel: refuelSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;