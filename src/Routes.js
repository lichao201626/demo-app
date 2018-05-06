
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Header from './component/Header';
import One from './component/One';
import Two from './component/Two';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Header}/>
        <Route path='/one' component={One}/>
        <Route path='/two' component={Two}/>
      </Switch>
    )
  }
};

export default Routes;