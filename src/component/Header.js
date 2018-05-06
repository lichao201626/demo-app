import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import Fetch from 'isomorphic-fetch';

class Header extends Component {
    // all props should be read-only
    // All React components must act like pure functions with respect to their props.
    constructor(props) {
        super(props);
        // state and Lifecycle
        this.state = {
            date: new Date(),
            isToggleOn: true
        };
        // 打开一个WebSocket:
        var ws = new WebSocket('ws://127.0.0.1:3001');
        // 响应onmessage事件:
        ws.onmessage = function(msg) { console.log(msg); };
        this.ws = ws;
        // bind this, otherwise it would be undefined
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){

        // 给服务器发送一个字符串:
        this.ws.send('Hello!');
        // isomorphic-fetch request
        var url = "http://localhost:3000/rest/header";
        var formData = {};
        Fetch(url,{
            method: 'POST',
            body:formData,
            dataType: "text",
        }).then(data => {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', data);
        });
        this.setState(preState => ({
            isToggleOn: !preState.isToggleOn
        }));
    }
    render() {
        return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">This is React Header</h1>
            </header>
            <p className="App-intro">
                JJJJJJJJJJJJJJJJJJJJJJJJJJJ
            </p>
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        </div>
        );
    }
}

export default Header;
