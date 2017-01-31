$(document).ready(function(){

	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	var travisBuildNumber = travisUrl.match(/\d+/g);
	var travisAPIUrl = "https://api.travis-ci.org/builds/" + travisBuildNumber;
	var travisJobsBaseUrl = "https://travis-ci.org/TeamPorcupine/ProjectPorcupine/jobs/";
	var travisData = [];

	var jsonResponse = null;
	var skipIfPassing = true;
	//request settings from chrome
	chrome.storage.sync.get({
	  failedOnly: true
	}, function(settings) {
		skipIfPassing = settings.failedOnly;
	});

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
		
			var failedBuild = false;
			for (var i = 0; i < jsonResponse['jobs'].length; i++) {
				console.log(data['jobs'][i]['config']['env'] + "  |  " + data['jobs'][i]['state']);
				travisData[i] = {job: data['jobs'][i]['config']['env'], state: data['jobs'][i]['state'], job_id: data["build"]["job_ids"][i]}
				
				if (data['jobs'][i]['state'] != "passed") {
					failedBuild = true;
				}
				

			}
			console.log(travisData);

			//end script if there is no failed builds and failed only is selected as an option
			if (!failedBuild && skipIfPassing) {
					return;
			}
			var message =  failedBuild ? "One or more tests have failed:" : "Everythings looking good!"

			$(".discussion-timeline-actions").last().prepend(
				`<div class="timeline-comment-wrapper">
					<img alt="TravisReport" class="timeline-comment-avatar" height="44" src="https://i.imgur.com/4AygYtP.png" width="44"> 
					<div class="branch-action-body simple-box">
						<p>` + message + `<p>
						<table id="travis-report" class="table table-hover">
						</table>
					</div>
				</div>`
			);

			$("#travis-report").append(
				`<tr>
				    <th>Job</th>
				    <th>Status</th>
				</tr>`
			);

			for (var i = 0; i < travisData.length; i++) {
				console.log("test");
				tdata = travisData[i];
				$("#travis-report").append(
					'<tr href="' + travisJobsBaseUrl + data["job_id"] + '" class="' + tdata["state"]+ '"><th><a href="' + travisJobsBaseUrl + tdata["job_id"] +'">' + tdata["job"] + '</th> <th>' + tdata["state"] + '</tr>'
				)
			}

	    }
	    //anything beyond this has no access to ajax response.
    });
	
   $('.tr-link').click(function() {
        var href = $(this).attr("href");
        if(href) {
            window.location = href;
        }
    });
});