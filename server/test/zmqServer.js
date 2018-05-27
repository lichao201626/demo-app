var zmq = require('zmq');
var socket = zmq.socket('req');
var counter = 0;

function logToConsole(message){
    console.log(new Date().toString, message);
}

function sendMessage (message) {
    logToConsole('Sending' + message);
    socket.send(message);
}

socket.on('message', function(message){
    logToConsole("Response+"+message.toString('utf8'));
});

socket.bind('tcp://127.0.0.2:9998', function(error){
    if(error){
        logToConsole("Failed to bind"+error.message);
        process.exit(0);
    } else {
        logToConsole('Server listening on port 9998');
        setInterval(function() {
            sendMessage(counter++);
        }, 1000);
    }
});