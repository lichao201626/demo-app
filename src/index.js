import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import "./scss/grommet.scss";

// import 'whatwg-fetch';
import { polyfill as promisePolyfill } from "es6-promise";
// promisePolyfill();

const element = document.getElementById("root");
ReactDOM.render(<App />, element);
// registerServiceWorker();
//reducer
