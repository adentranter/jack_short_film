//Include files
//require('v8-profiler');
var express = require('express');
var path = require("path");
var app = express();
var orm = require('orm');
var jwt = require('express-jwt');
global.rekuire = require('rekuire');
var Logger = rekuire('Logging');
var config = rekuire('config.js');
var Logger = rekuire('Logging');
var _ = require("underscore");
var fs = require("fs");
var request = require('request-json');
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


//template convertor
function compileTpl(file,data) {
  var fileContents = fs.readFileSync(file, encoding = "utf8");

  try {
    var tplFinal =  _.template(fileContents);
    var html = tplFinal(data);
  }catch(e) {
    Logger.log(e);
  }


  return html;
}


//SETUP THE APPLICATION ITSELF
Logger.log("AV 1.0 A GO");

app.use(orm.express("mysql://"+config.username+":"+config.password+"@localhost/"+config.database, {

  define:function(db,models){ 
    db.settings.set('instance.cache', false);

    db.load("./schema", function (err) {
      models.email = db.models.email;
    });

    //RUN UPDATES FOR NEW COLUMNS
    //this is the way we handle databse updates; any updates to the stucture to the db needs to be outlined here after 1st of oct
    //EXAMPLE BELOW
    //db.driver.execQuery("ALTER TABLE app ADD nav_view_logo_shown BIT(1) AFTER notes_add_button_color;",function(err,data){});
    db.sync();
  }
}));

app.get('/',function(req,res) {
    /*
       var returnObjects = [];
       news();
       Logger.log("Permalink - "+req.url);

    //test for perma in each area.
    function news() {
    req.models["news"].find({"app_id":req.params.id,"permalink":req.params.permalink}, function (err,items) {
    returnObjects['news'] = items;
    page();
    });*/
  Logger.log("Index Served");
 
  var page = compileTpl("views/tpl/docheader.html")+compileTpl("views/index.html")+ compileTpl("views/tpl/docfooter.html");
  res.send(page);

});

app.get('/cron',function(req,res) {
    /*
       var returnObjects = [];
       news();
       Logger.log("Permalink - "+req.url);

    //test for perma in each area.
    function news() {
    req.models["news"].find({"app_id":req.params.id,"permalink":req.params.permalink}, function (err,items) {
    returnObjects['news'] = items;
    page();
    });*/
  Logger.log("Cron motherfucker");
  var page = compileTpl("views/tpl/docheader.html")+compileTpl("views/index.html")+ compileTpl("views/tpl/docfooter.html");
  res.send(page);
});

app.get('/view/:code',function(req,res) {
    /*
       var returnObjects = [];
       news();
       Logger.log("Permalink - "+req.url);

    //test for perma in each area.
    function news() {
    req.models["news"].find({"app_id":req.params.id,"permalink":req.params.permalink}, function (err,items) {
    returnObjects['news'] = items;
    page();
    });*/
  var page = compileTpl("views/tpl/docheader.html")+compileTpl("views/index.html")+ compileTpl("views/tpl/docfooter.html");
  res.send(page);
});




app.listen(config.port);

