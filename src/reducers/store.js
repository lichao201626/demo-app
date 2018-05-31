import { createStore, compose, applyMiddleware } from "redux";
// import root from "./root";
// import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
// import { browserHistory } from "react-redux";
// import { createBrowserHistory } from 'history';
import createHistory from 'history/createBrowserHistory';
const middleware = routerMiddleware(createHistory());
import { combineReducers } from "redux";

import dashboard from "./dashboard";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// export default compose(applyMiddleware(middleware, thunk))(createStore)(root);
const store = createStore(
    combineReducers({
        dashboard,
        router: routerReducer
    }),
    applyMiddleware(middleware)
);
export default store;
