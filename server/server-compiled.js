"use strict";

var easyMonitor = require("easy-monitor");
easyMonitor("demo-app");

var express = require("express");
// var session = require('express-session');
var logger = require("morgan");
var bodyParse = require("body-parser");
// var errorHandler = require('errorHandler');
// var wss = require('./ws/websocket');
var path = require("path");

var Websocket = require("ws");

var websocketServer = Websocket.Server;

var shelljs = require("shelljs");
var heapdump = require("heapdump");

// 实例化
var wss = new websocketServer({
  port: 3001
});

wss.on("connection", function (ws) {
  console.log("ws server connection");
  ws.on("message", function (message) {
    console.log("ws server receive message", message);
    ws.send("server send message", function (error) {
      if (error) {
        console.log("error happend sending message");
      }
    });
  });
});

var router = require("./router.js");
var app = express();
app.use(logger("dev"));
app.use("/", express.static(path.join(__dirname, "/../dist")));
app.use("", router);

var leakF = require("./leakClass");

app.listen("5000", function () {
  for (var i = 0; i < 100000; i++) {
    leakF();
  }

  console.log("express server listening on port 5000");
  console.log("Listening on http://127.0.0.1:5000/");
  console.log("PID %d", process.pid);

  /*     var heapSnapshotFile = '/home/jack/workspace/demo-app/server/heapdump-' + Date.now() + '.heapsnapshot';
        shelljs.rm('-f', heapSnapshotFile);
         function waitForHeapdump(err, filename) {
            var files = shelljs.ls(heapSnapshotFile);
            // app.disable();
        }
        heapdump.writeSnapshot(heapSnapshotFile, waitForHeapdump); */
});
