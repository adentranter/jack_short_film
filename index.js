//Include files
//require('v8-profiler');
var express = require('express');
var path = require("path");
var app = express();
global.rekuire = require('rekuire');
var Logger = rekuire('Logging');
process.env.TZ = 'Africa/Abidjan';

//SETUP THE EXPRESS ENGINE TO HANDLE CROSS ORIGIN REQUEST
app.use(express.static(__dirname + '/public'));
app.use('/',express.static(__dirname + '/public'));
app.use('*',express.static(__dirname + '/public'));

app.use(express.bodyParser({limit:'50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(function(req, res, next) {
  var oneof = false;

  if(req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if(req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if(req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if(oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});


//SETUP THE APPLICATION ITSELF
Logger.log("Starting Platforms Server Side Rendering Engine");

//CONFIG THE MYSQL DB
var config = require('./config.js');

//INCLUDE THE ROUTES
var server = require('./routes/SiteEngine.js');


//VIEWING AREA
app.get('/sitemap.xml',server.sitemap);
app.get('/robots.txt',function(req,res) {
  res.send("User-Agent: *")
});
app.get('/getmesomestyles.css',server.getStyles);

app.get('/*',server.viewSite);


app.listen(config.port);

