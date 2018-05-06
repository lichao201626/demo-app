var express = require('express');
// var session = require('express-session');
var logger = require('morgan');
var bodyParse = require('body-parser');
// var errorHandler = require('errorHandler');

var router = require("./router.js");
var app = express();
app.use(logger('dev'));
app.use('', router);
app.listen('5000', ()=>{
    console.log('express server listening on port 5000');
});