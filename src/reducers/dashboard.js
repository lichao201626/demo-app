// import { DASHBOARD_LOAD, DASHBOARD_UNLOAD } from "../actions";
import { createReducer } from "./utils";

const initialState = {
  tasks: [],
  status: "1",
  message: "not login"
};

const handlers = {
  /*   [DASHBOARD_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [DASHBOARD_UNLOAD]: () => initialState */
  login: (state, action) => {
    return { status: 0, message: "login success" };
  }
};

export default createReducer(initialState, handlers);
