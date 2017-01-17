
var url = window.location.href;
console.log(url);

$(document).ready(function(){

	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	// for now just hardcode it in
	travisBuildNumber = 191984244;
	travisAPIUrl = "https://api.travis-ci.org/builds/" + travisBuildNumber;
	travisData = null

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

		$(".discussion-timeline-actions").last().prepend(
			`<div class="timeline-comment-wrapper">
				<img alt="TravisReport" class="timeline-comment-avatar" height="44" src="http://i.imgur.com/4AygYtP.png" width="44"> 
				<div class="branch-action-body simple-box">
					<h1>INSERT TRAVIS HERE</h1>
				</div>
			</div>`
			);
});