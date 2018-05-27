var zmq = require('zmq');
var socket = zmq.socket('rep');

function logToConsole(message){
    console.log(new Date().toString(), message);
}

socket.on('message', function(message){
    logToConsole('Received message'+message.toString('utf8'));
    socket.send(message);
});

socket.connect('tcp://127.0.0.2:9998');