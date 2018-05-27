//

1.  dev mode

cd demo-app
npm install
npm uninstall -g webpack
npm add webpack --save-dev

./node_modules/webpack-dev-server/bin/wpack-dev-server.js --progress

cd server
node server/server.js

2.  product mode

cd demo-app
webpack

cd server
node server/server.js
