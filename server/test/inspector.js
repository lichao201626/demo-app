const inspector = require('inspector');

inspector.open('5000', '127.0.0.1');
console.log(inspector.url());

var session = new inspector.Session();
session.on('inspectorNotification', (message) => console.log(message.method));
session.on('Debugger.paused', ({ params }) => {
    console.log(params.hitBreakpoints);
  });

session.connect();

session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));

session.disconnect();

inspector.close();