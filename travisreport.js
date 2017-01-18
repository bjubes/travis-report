$(document).ready(function(){

	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	// for now just hardcode it in
	travisBuildNumber = travisUrl.replace(/\D+/g, "");
	travisAPIUrl = "https://api.travis-ci.org/builds/" + travisBuildNumber;
	travisJobsBaseUrl = "https://travis-ci.org/TeamPorcupine/ProjectPorcupine/jobs/";
	travisData = [];

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
			for (var i = 0; i < jsonResponse['jobs'].length; i++) {
				console.log(data['jobs'][i]['config']['env'] + "  |  " + data['jobs'][i]['state']);
				travisData[i] = {job: data['jobs'][i]['config']['env'], state: data['jobs'][i]['state'], job_id: data["build"]["job_ids"][i]}
			}
			console.log(travisData);

			$(".discussion-timeline-actions").last().prepend(
				`<div class="timeline-comment-wrapper">
					<img alt="TravisReport" class="timeline-comment-avatar" height="44" src="https://i.imgur.com/4AygYtP.png" width="44"> 
					<div class="branch-action-body simple-box">
						<h1>INSERT TRAVIS HERE</h1>
						<table id="travis-report" class="table table-hover">
						</table>
					</div>
				</div>`
			);

			$("#travis-report").append(
				`<tr>
				    <th>Job</th>
				    <th>Status</th>
				    <th>Country</th>
				</tr>`
			);

			for (var i = 0; i < travisData.length; i++) {
				console.log("test");
				tdata = travisData[i];
				$("#travis-report").append(
					'<a href="' + travisJobsBaseUrl + data["job_id"] + '"><tr><th>' + tdata["job"] + '</th> <th>' + tdata["state"] + '</th> <th>Country</th> </tr></a>'
				)
			}

	    }
	    //anything beyond this has no access to ajax response.
    });
	
});