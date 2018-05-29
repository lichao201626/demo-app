import { createStore, compose, applyMiddleware } from "redux";
import root from "./root";
import thunk from "redux-thunk";
import { routerMiddleware } from "react-router-redux";
import { browserHistory } from "react-redux";
const middleware = routerMiddleware(browserHistory);

export default compose(applyMiddleware(middleware, thunk))(createStore)(root);
