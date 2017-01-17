
var url = window.location.href;
console.log(url);

$(document).ready(function(){

	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	console.log(travisUrl);

	//$("head").append("<meta>Access-Control-Allow-Origin: *</meta>")
	
	$(".discussion-timeline-actions").last().prepend('<iframe src="' + travisUrl + '" width="100%" height="4000" frameborder="0" scrolling="no"></iframe>');
	console.log("working");

	$.get(travisUrl, function(data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
	})
	console.log('test');
});