import { createStore, compose, applyMiddleware } from "redux";
import root from "./root";
import thunk from "redux-thunk";

export default compose(applyMiddleware(thunk))(createStore)(root);
