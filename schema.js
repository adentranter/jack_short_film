module.exports = function (db, cb) {
  //SETUP EACH MODEL
  var email = db.define('email', {
    email : String,
    hash : String,
    created : {type :'date', time:true},
    viewing_start : {type : 'date', time :true},
    viewing_end : {type : 'date', time :true}
  });

  return cb();
};

