import { combineReducers } from "redux";

import dashboard from "./dashboard";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

export default combineReducers({
  dashboard,
  router: routerReducer
});
