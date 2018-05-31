import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Myheader from "./component/Myheader";
import One from "./component/One";
import Two from "./component/Two";
import { connect } from "react-redux";

const routes = () => {
  return (
    <div>
      <Route exact path="/" component={Myheader} />
      <Route path="/one" component={One} />
      <Route path="/two" component={Two} />
    </div>
  )
};
export default routes;