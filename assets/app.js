
$(document).ready(function() {

  $(".sendEmail").click(function(a) {
    //trigger to post the email;
    $.post( "/", { email: $("#email").val() }, function( data ) {

    }, "json");
  });
});
