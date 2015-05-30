
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser());


require('./server/static')(app, __dirname);
