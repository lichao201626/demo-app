import React, { Component } from "react";
// import logo from './logo.svg';
import Routes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./reducers/store";
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';

// let history = syncHistoryWithStore(createBrowserHistory(), store);
// history.listen(location => analyticsService.track(location.pathname));

class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store} >
          <Router history={createBrowserHistory()}>
            <Routes />
          </Router>
        </Provider>
      </div>
    );
  }
}

export default App;

