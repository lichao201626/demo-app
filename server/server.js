/* const easyMonitor = require("easy-monitor");
easyMonitor("demo-app"); */

var express = require("express");
// var session = require('express-session');
var logger = require("morgan");
var bodyParse = require("body-parser");
// var errorHandler = require('errorHandler');
// var wss = require('./ws/websocket');
var path = require("path");

const Websocket = require("ws");

const websocketServer = Websocket.Server;

var shelljs = require("shelljs");
// var heapdump = require("heapdump");

// 实例化
const wss = new websocketServer({
  port: 3001
});

wss.on("connection", ws => {
  console.log("ws server connection");
  ws.on("message", message => {
    console.log("ws server receive message", message);
    ws.send("server send message", error => {
      if (error) {
        console.log("error happend sending message");
      }
    });
  });
});

var router = require("./router.js");
var app = express();
app.use(logger("dev"));
// 通常用于加载静态资源
app.use(express.static(__dirname + '/public'))

// 在你应用 JavaScript 文件中包含了一个 script 标签
// 的 index.html 中处理任何一个 route
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

/* app.use("/", express.static(path.join(__dirname, "/../dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, "/../dist/index.html")));
}); */
app.use("", router);

// var leakF = require("./leakClass");

app.listen("5000", () => {
  console.log("express server listening on port 5000");
  console.log("Listening on http://127.0.0.1:5000/");
  console.log("PID %d", process.pid);
  /*   for (var i = 0; i < 100000; i++) {
      leakF();
    }
   */

  /*     var heapSnapshotFile = '/home/jack/workspace/demo-app/server/heapdump-' + Date.now() + '.heapsnapshot';
        shelljs.rm('-f', heapSnapshotFile);

        function waitForHeapdump(err, filename) {
            var files = shelljs.ls(heapSnapshotFile);
            // app.disable();
        }
        heapdump.writeSnapshot(heapSnapshotFile, waitForHeapdump); */
});
