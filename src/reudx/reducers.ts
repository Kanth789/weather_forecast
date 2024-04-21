import { combineReducers } from 'redux';
import selectedRowsReducer from './selectedRowsReducer';

const rootReducer = combineReducers({
  selectedRows: selectedRowsReducer,
});

export default rootReducer;
