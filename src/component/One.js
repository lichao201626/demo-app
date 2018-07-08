import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import logo from "../../public/img/logo.svg";
import sexg from "../../public/img/sexy.jpg";
import huaxianzi from "../../public/img/huaxianzi.jpg";
import beauti from "../../public/img/beauti.jpg";
import "../App.scss";
import Fetch from "isomorphic-fetch";
import FetchJsonp from "fetch-jsonp";
import Header from "grommet/components/Header";
import Footer from "grommet/components/Footer";
import Actions from "grommet/components/icons/base/Actions";
import Title from "grommet/components/Title";
import Box from "grommet/components/Box";
import Paragraph from "../../node_modules/grommet/components/Paragraph";
import Menu from "../../node_modules/grommet/components/Menu";
import Anchor from "../../node_modules/grommet/components/Anchor";
import Section from "../../node_modules/grommet/components/Section";
import Image from "grommet/components/Image";
import App from "grommet/components/App";
import Article from "grommet/components/Article";
import Split from "grommet/components/Split";
import Sidebar from "grommet/components/Sidebar";
import LoginForm from "grommet/components/LoginForm";
import { withRouter } from 'react-router-dom';
import Columns from "grommet/components/Columns";
import Search from 'grommet/components/Search';
import Heading from 'grommet/components/Heading';
var download = require('downloadjs');

class One extends Component {
  // all props should be read-only
  // All React components must act like pure functions with respect to their props.
  constructor(props) {
    super(props);
    console.log("one cons");
    // state and Lifecycle
    this.state = {
      date: new Date(),
      value: 'addddd',
      sug: [],
      isToggleOn: true
    };
    // 打开一个WebSocket:
    var ws = new WebSocket("ws://127.0.0.1:3001");
    // 响应onmessage事件:
    ws.onmessage = function (msg) {
      console.log(msg);
    };
    this.ws = ws;
    // bind this, otherwise it would be undefined
    this.handleClick = this.handleClick.bind(this);
    this.submit = this.submit.bind(this);
    this.onDOMChange = this.onDOMChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.query = this.query.bind(this);
  }
  componentDidMount() {
    console.log("one did mount");
  }
  componentWillReceiveProps(props) {
    console.log("will receive", props);
  }
  onDOMChange(e) {
    console.log("on dom change", e);
    console.log("on dom change value", e.target.value);
    this.query(e.target.value);
  }
  query(q) {
    // test download
    var url = "http://localhost:5000/file/test";
    var formData = {};
    Fetch(url, {
      method: "GET"
    }).then(data => {
      let blb = data.blob();
      console.log('##############', blb);
      return blb;
      // download(data.body);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data);
    }).then(blob => {
      download(blob, 'out2.xlsx');
    });
    // fetch-jsonp request
    var url2 = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=callback&wd=' + q;
    FetchJsonp(url2, {
      timeout: 3000,
      jsonpCallbackFunction: 'callback'
    }).then(function (response) {
      console.log('cccc1', response);
      return response.json();
    }).then(data => {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data.s);
      this.setState({
        sug: data.s
      });
    });
  }
  onSelect(e) {
    console.log("on select", e);
  }
  onKeyDown(e) {
    console.log("on key down", e);
  }
  submit(e) {
    console.log("this", this);
    console.log("props", this.props);
    console.log("submit", e);
    // 同步
    this.props.dispatch({ type: "login" });
    console.log(this.context);
    // this.context.router.history.push('one');
    // 异步 createThunkMiddleware
    /*     this.props.dispatch(dispatch => {
      return dispatch({ type: "login" });
    }); */
  }
  handleClick() {
    // 给服务器发送一个字符串:
    this.ws.send("Hello!");
    // isomorphic-fetch request
    var url = "http://localhost:5000/rest/header";
    var formData = {};
    Fetch(url, {
      method: "POST",
      body: formData,
      dataType: "text"
    }).then(data => {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", data);
    });

  }
  render() {
    return (
      <App centered={false}>
        <Split colorIndex='accent-1' flex="right" priority="right">
          <Sidebar colorIndex='neutral-3' fixed={true}>
            <Menu fill={true} primary={true}>
              <Anchor path='/' icon={<Actions />}>
                One
              </Anchor>
              <Anchor path='/two' icon={<Actions />}>
                Two
              </Anchor>
              <Anchor href='http://www.baidu.com' icon={<Actions />} >
                Three
            </Anchor>
              <Anchor path='/' icon={<Actions />} >
                Four
              </Anchor>
              <Anchor path='/file/test' icon={<Actions />} >
                Five
              </Anchor>
              <Anchor path='/' icon={<Actions />} >
                Six
            </Anchor>
              <Anchor path='/' icon={<Actions />} >
                Seven
            </Anchor>
            </Menu>
          </Sidebar>
          <Article>
            <Header>
              <Title>
                Search
              </Title>
              <Box flex={true}
                justify='end'
                direction='row'
                responsive={false}>
                <Search inline={true}
                  fill={true}
                  size='medium'
                  placeHolder='Search'
                  defaultValue=""
                  onDOMChange={this.onDOMChange}
                  onSelect={this.onSelect}
                  suggestions={this.state.sug}
                  onKeyDown={this.onKeyDown}
                  dropAlign={{ "top": "bottom" }} />
                <Menu icon={<Actions />}
                  dropAlign={{ "right": "right" }}>
                  <Anchor href='#'
                    className='active'>
                    First
                    </Anchor>
                  <Anchor href='#'>
                    Second
                  </Anchor>
                  <Anchor href='#'>
                    Third
              </Anchor>
                </Menu>
              </Box>
            </Header>
            <Box fixed={true} >
              <Paragraph size='large'>
                <Anchor path='/tasks'
                  label={this.state.sug[0]} />
              </Paragraph>
            </Box>
          </Article>
        </Split>
      </App>
    );
  }
}

const select = state => ({
  status: '15',
  message: state.dashboard.message
});
export default withRouter(connect(select)(One));
