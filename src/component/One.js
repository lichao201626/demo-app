import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import logo from "../../public/img/logo.svg";
import sexg from "../../public/img/sexy.jpg";
import huaxianzi from "../../public/img/huaxianzi.jpg";
import beauti from "../../public/img/beauti.jpg";
import "../App.scss";
import Fetch from "isomorphic-fetch";
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

class One extends Component {
  // all props should be read-only
  // All React components must act like pure functions with respect to their props.
  constructor(props) {
    super(props);
    console.log("one cons");
    // state and Lifecycle
    this.state = {
      date: new Date(),
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
  }
  componentDidMount() {
    console.log("one did mount");
  }
  componentWillReceiveProps(props) {
    console.log("will receive", props);
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
    this.setState(preState => ({
      isToggleOn: !preState.isToggleOn
    }));
  }
  render() {
    return (
      <Box full={true} justify="between">
        <Header fixed={false}
          float={false}
          splash={false}>
          <Title>
            <Image src={beauti} size="small" />
          </Title>
          <Box flex={true}
            justify="center"
            align="center"
            direction='row'
            responsive={false}>
            <Search inline={true}
              fill={true}
              size='medium'
              placeHolder='Search'
              dropAlign={{ "right": "right" }} />
          </Box>
        </Header>
        <Sidebar colorIndex='accent-1' fixed={true}>
          <Menu primary={true}
            fill={true}>
            <Anchor path='/' icon={<Actions />} >
              First
              </Anchor>
            <Anchor path='/' icon={<Actions />}>
              First
              </Anchor>
            <Anchor path='/' icon={<Actions />}>
              First
              </Anchor>
          </Menu>
        </Sidebar>
        <Footer justify="between" size="small">
          <Box flex={true} justify="end" direction="row" colorIndex="light-2">
            <Box direction="row" justify="end" pad={{ between: "medium" }}>
              <Paragraph margin="none">© 2018 Lichao Happy</Paragraph>
              <Menu direction="row" size="small" dropAlign={{ right: "right" }}>
                <Anchor href="#">Support</Anchor>
                <Anchor href="#">Contact</Anchor>
                <Anchor href="#">About</Anchor>
              </Menu>
            </Box>
          </Box>
        </Footer>
      </Box >

    );
  }
}

const select = state => ({
  status: '15',
  message: state.dashboard.message
});
export default withRouter(connect(select)(One));
