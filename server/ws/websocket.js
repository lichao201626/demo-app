const Websocket = require('ws');

const websocketServer = Websocket.Server;

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

module.exports = wss;
