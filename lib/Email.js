var Emailer, emailer, exports, fs, _;

emailer = require("nodemailer");

fs = require("fs");

_ = require("underscore");
rekuire = require("rekuire");
Logger = rekuire("Logging");

Emailer = (function() {
  Emailer.prototype.options = {};

  Emailer.prototype.data = {};
  
function Emailer(options, data) {
    this.options = options;
    this.data = data;
  }

  Emailer.prototype.send = function(callback) {
    var attachments, html, messageData, transport;

 	html = this.getHtml(this.options.to.template, this.data);

    messageData = {
      to: "'" + this.options.to.name + " " + this.options.to.surname + "' <" + this.options.to.email + ">",
	  from: "Every Body Needs Healing <reception@everybodyneedshealing.org>",
      subject: "Moew",
      html: html,
      generateTextFromHTML: true,
      attachments: attachments
    };
    transport = this.getTransport();
    return transport.sendMail(messageData, callback);
  };

  Emailer.prototype.getTransport = function() {
    return emailer.createTransport("SMTP", {
		host:'smtp.zoho.com',
		port:465,
		secure:true,
    secureConnection: true,
	//	service:"zoho",
      auth: {
        user: "reception@everybodyneedshealing.org",
        pass: "B9np875s0"
      }
    });
   /* 
      return emailer.createTransport("direct", {
		debug:false,
	  });
	  */
  };

  Emailer.prototype.getHtml = function(templateName, data) {
  //  var encoding, templateContent, templatePath;
    templatePath = "/opt/production/views/emails/" + templateName + ".html";
    templateContent = fs.readFileSync(templatePath, encoding = "utf8");
    var tplFinal =  _.template(templateContent, {
      interpolate: /\{\{(.+?)\}\}/g
    });

    return tplFinal(data);
  };

  return Emailer;

})();

exports = module.exports = Emailer;




exports.sendFiveWarning = function(req,res,email) {
    Logger.log("Sending Email");
	//GET VARS FROM QUERY INTO REAL ONES

		var Emailer, emailer, options,link;

    
		options = {
			from:{
				email:email
			},
			to: {
				email: email,
				name:  "Me",
				subject: "5 mins warning",
				template: "email"
			}
    };

    //get model to find link
    console.log(email);
    req.models["email"].find({email:email}, function (err,items) {  
      console.log(items);
      console.log(err);
      console.log("Checkin Items");
      if (!err) {
        data = {
          link:items[0]["hash"]
        }

        Emailer = rekuire("Email");


        emailer = new Emailer(options, data);

        emailer.send(function(err, result) {
          if (err) {
             Logger.log(err);
          }
        });


      }
    });



	//res.send(200);
}

