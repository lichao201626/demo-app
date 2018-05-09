var express = require('express');
// var session = require('express-session');
var logger = require('morgan');
var bodyParse = require('body-parser');
// var errorHandler = require('errorHandler');
// var wss = require('./ws/websocket');

const Websocket = require('ws');

const websocketServer = Websocket.Server;

var shelljs = require('shelljs');
var heapdump = require('heapdump');

// 实例化
const wss = new websocketServer({
    port: 3001
});

wss.on('connection', (ws)=>{
    console.log('ws server connection');
    ws.on('message', (message)=>{
        console.log('ws server receive message', message);
        ws.send('server send message', (error)=>{
            if(error){
                console.log('error happend sending message');
            }
        });
    });
});

var router = require("./router.js");
var app = express();
app.use(logger('dev'));
app.use('', router);

app.listen('5000', ()=>{
    console.log('express server listening on port 5000');
    console.log('Listening on http://127.0.0.1:5000/');
    console.log('PID %d', process.pid);

    var heapSnapshotFile = '/home/jack/workspace/demo-app/server/heapdump-' + Date.now() + '.heapsnapshot';
    shelljs.rm('-f', heapSnapshotFile);

    function waitForHeapdump(err, filename) {
        var files = shelljs.ls(heapSnapshotFile);
        // app.disable();
    }
    heapdump.writeSnapshot(heapSnapshotFile, waitForHeapdump);
});