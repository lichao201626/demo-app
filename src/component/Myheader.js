import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import logo from "../../public/img/logo.svg";
import sexg from "../../public/img/sexy.jpg";
import huaxianzi from "../../public/img/lig.jpg";
import "../App.scss";
import Fetch from "isomorphic-fetch";
import Header from "../../node_modules/grommet/components/Header";
import Footer from "../../node_modules/grommet/components/Footer";
import Title from "../../node_modules/grommet/components/Title";
import Box from "../../node_modules/grommet/components/Box";
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

import Columns from "grommet/components/Columns";

class Myheader extends Component {
  // all props should be read-only
  // All React components must act like pure functions with respect to their props.
  constructor(props) {
    super(props);
    console.log(this.props);
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
    console.log("did mount");
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
    // this.context.router.history.push('/one');
    // console.log(History);
    // console.log(this.props.history);
    this.props.history.push('/one');
    // this.props.history.go();
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
      <Box full={true} justify="between" colorIndex="accent-1">
        <Box
          flex={true}
          justify="start"
          direction="row"
          responsive={false}
          colorIndex="neutral-1"
        >
          <Image src={sexg} size="small" />
          <Box flex={true} justify="center" direction="row">
            <Title>Welcome my world</Title>
          </Box>
        </Box>
        <Box
          basis="xlarge"
          direction="row"
          responsive={false}
          colorIndex="accent-2"
        >
          <Box colorIndex="accent-1" align="start" >
            <Image src={huaxianzi} size="xxlarge" />
          </Box>
          <Box
            basis="xlarge"
            justify="center"
            direction="row"
            align="center"
            responsive={false}
          >
            <App>
              <LoginForm
                onSubmit={this.submit}
                onChange={function () { }}
                usernameType="text"
                forgotPassword={<Anchor href="#" label="Forgot password?" />}
                rememberMe={false}
              />
            </App>
          </Box>
        </Box>

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

Myheader.contextTypes = {
  router: PropTypes.object
};

const select = state => (() => {
  console.log(state);
  return {
    status: state.dashboard.status,
    message: state.dashboard.message
  }
});
export default connect(select)(Myheader);
