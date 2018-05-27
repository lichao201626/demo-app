process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const stompit = require('stompit');
// const settings = require("./settings");

const host = 'localhost';
const QUEUE = 'test';
const TOPIC = 'testTopic';
let client = null;

stompit.connect({ host: host, port: 61613 }, (err, _client) => {
    if(err) {
        console.error("err: ", err);
    } else {
        client = _client;
        let timer = null;
        let i = 0;
        var intervalObj = setInterval(() => {
            i++;
            const event1 = client.send({ destination: QUEUE });
            event1.write(JSON.stringify({ RequestKey: 'qasdfasdfasdfasdfasdfasdueueasodfaisfueoasdoasdfasdjfasdfaksdfajhsdfausdhfaoishdfiasdhfiasdgfoiaushdfoiausdgfia' + i }));
            event1.end();
            if(i > 20500) {
                clearInterval(intervalObj);
            }
        }, 1);
    }
});

process.on("SIGINT", () => {
    console.log("exit");
    client && client.disconnect();
});
