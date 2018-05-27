import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Myheader from "./component/Myheader";
import One from "./component/One";
import Two from "./component/Two";
import { connect } from "react-redux";

class Routes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Myheader} />
          <Route path="/one" component={One} />
          <Route path="/two" component={Two} />
        </Switch>
      </div>
    );
  }
}

const select = state => ({});
export default connect(select)(Routes);
