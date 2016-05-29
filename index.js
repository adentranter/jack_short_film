//Include files
//require('v8-profiler');
var express = require('express');
var path = require("path");
var app = express();
var orm = require('orm');
var jwt = require('express-jwt');
global.rekuire = require('rekuire');
var Logger = rekuire('Logging');
var email = rekuire('Email');
var config = rekuire('config.js');
var _ = require("underscore");
var fs = require("fs");
var request = require('request-json');
//process.env.TZ = 'Africa/Abidjan';

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

app.post('/', function(req,res) {
  var email = req.body.email;
  var myself = this;
  var newItem = {};
  newItem.last_updated = new Date();

  //add in created
  newItem["created"]= new Date();
  newItem["email"]= email;
  newItem["hash"]=String(newItem["email"]).hashCode();

  // get the last dude and work out datetime for start and end.
  req.models["email"].find(null,null,null,"-created", function (err,items) {  
    Logger.log("items array");

    if (items.length > 0) {
      Logger.log("next in line");
      var end = new Date(items[0]["viewing_end"].getTime() + 3*60000);
      newItem["viewing_start"] = items[0]["viewing_end"];
      newItem["viewing_end"] = end;
    }else {
      Logger.log("current date");
      newItem["viewing_start"]= new Date();
      newItem["viewing_end"]= new Date(newItem["viewing_start"].getTime() + 5*60000);

    }

    //check if old date
    if (new Date() > newItem["viewing_start"] ) {
      Logger.log("old Date");
      newItem["viewing_start"] = new Date().getTime() + 5*60000;
      if (newItem["viewing_start"]) {
        var newDateTime = new Date(newItem["viewing_start"]).setMinutes(new Date(newItem["viewing_start"]).getMinutes() + 3);
        newItem["viewing_end"]= newDateTime;
      }
    }




    req.models["email"].create(newItem, function (err, item) {
      // err - description of the error or null
      // items - array of inserted items
      Logger.log("Added Email");

      //res.send(200);
    }); 
  });
});

app.get('/cron',function(req,res) {
  Logger.log("Cron motherfucker");
  var startRange,endRange;
  startRange = new Date();
  endRange = new Date().getTime() -5*60000; 

  //pull all items that are within 2 mins of being 5 mins away frmo start time.
  req.models["email"].find(null,null,null,"-created", function (err,items) {  
    if (!err) {
      items.forEach(function(item,index) {
        console.log(items);
        console.log(new Date(item["viewing_start"]));
        console.log(startRange);

        if (new Date(item["viewing_start"]) < endRange && new Date(item["viewing_start"] > startRange)) {
          console.log('asdf');
          Logger.log("email" + item['email']);

          //EMAIL
          email.sendFiveWarning(req,res,item["email"]);
          Logger.log("Calling Email Code");
        }

        if (index == items.length-1) {
          res.send(200);
        }

      });
    }else {
      res.send(501);
    }
  });

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


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
