exports.log = function(lg,level) {
	var finlevel = "INFO";
	if (level != null ) {
		finlevel = level
	}
        if ( process.env.NODE_ENV === "production" && finlevel != "DEBUG" )
        {
            console.log(new Date() + " - " +finlevel + " - " + lg); 
        }else {
            console.log(new Date() + " - " +finlevel + " - " + lg); 

        }
}
