
var url = window.location.href;
console.log(url);

$(document).ready(function(){

	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	// for now just hardcode it in
	travisBuildNumber = 191984244;
	travisAPIUrl = "https://api.travis-ci.org/builds/" + travisBuildNumber;
	travisData = null

	console.log(travisUrl);

	//$("head").append("<meta>Access-Control-Allow-Origin: *</meta>")
	
	$(".discussion-timeline-actions").last().prepend('<iframe src="' + travisUrl + '" width="100%" height="4000" frameborder="0" scrolling="no"></iframe>');
	console.log("working");

	var jsonResponse = null;


	$.ajax({
         url: travisAPIUrl,
         type: "GET",
         beforeSend: function(xhr){
	        xhr.setRequestHeader('Accept', 'application/vnd.travis-ci.2+json');
	     	//xhr.setRequestHeader('User-Agent', 'MyClient/1.0.0');
	 		//xhr.setRequestHeader('Host', 'api.travis-ci.org');
	 	},
  		processData: false,
	    success: function(data) {
			jsonResponse = data //JSON.parse(data);
			console.log(data);
			console.log(data['jobs'][0]['config']['env']);

			for (var i = 0; i < jsonResponse['jobs'].length; i++) {
				console.log(data['jobs'][i]['config']['env'] + "  |  " + data['jobs'][i]['state']);
			}
	     }
      });



	// $.get(travisAPIUrl, requestData ,function(data, status) {
	// 	console.log(data);
	// 	for (var build in jsonResponse['jobs']) {
	// 		console.log(build['env'] + "  |  " + build['state']);
	// 	}

	// })
	console.log('test');



});