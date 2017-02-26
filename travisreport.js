$(document).ready(main());
setInterval(function(){
	if (document.getElementById("travis-report")== null) {
		main();
		console.log("reset");
	}
}, 1500);

function main() {
	var travisUrl = $("td").find(".commit-build-statuses").last().find("a").attr("href");
	if (travisUrl == null) {
		console.log("TravisReport: No build found.")
		return false;
	}
	var travisBuildNumber = travisUrl.match(/\d+/g);
	var travisAPIUrl = "https://api.travis-ci.org/builds/" + travisBuildNumber;
	var travisJobsBaseUrl = "https://travis-ci.org/TeamPorcupine/ProjectPorcupine/jobs/";
	var travisData = [];

	var jsonResponse = null;
	var skipIfPassing = true;
	var newTab = false;
	//request settings from chrome
	chrome.storage.sync.get({
	  failedOnly: true,
	  newTab: false
	}, function(settings) {
		skipIfPassing = settings.failedOnly;
		newTab = settings.newTab;
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
				travisData[i] = {job: data['jobs'][i]['config']['env'], state: data['jobs'][i]['state'], job_id: data["build"]["job_ids"][i], allow_failure: data["jobs"][i].allow_failure}

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
			$(".discussion-timeline-actions").last().prepend(outerHTML(message));
			$("#travis-report").append(
				`<tr>
				    <th>Environment</th>
				    <th>Status</th>
				    <th>Optional</th>
				</tr>`
			);

			for (var i = 0; i < travisData.length; i++) {
				tdata = travisData[i];
				$("#travis-report").append(
					'<tr href="' + travisJobsBaseUrl + data["job_id"] + '"><th><a href="' + travisJobsBaseUrl + tdata["job_id"] +'" ' + NewTabLink(newTab) +' >' + tdata["job"] + '</th> <th class="' + tdata["state"] + '">' + badge(tdata["state"]) + '</th> <th>' + YesorNo(tdata["allow_failure"]) + '</th></tr>'
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
	return true
}

function YesorNo (bool) {
	if (bool) {
		return "Yes";
	}
	else {
		return "No";
	}
}

function NewTabLink(newTab) {
	if (newTab) {
		return 'target="_blank" rel="noopener noreferrer"'
	} else {
		return "";
	}
}

/////HTML

function badge(status) {
	if (status == "passed") {
		return '<svg aria-hidden="true" class="octicon octicon-check" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"></path></svg>';
	}
	else if (status == "failed") {
		return '<svg aria-hidden="true" class="octicon octicon-x mx-auto d-block text-red" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"></path></svg>';
	} else {
		console.log("No badge for status: " + status);
	}
}

function outerHTML(message) {
	return `
<div class="timeline-comment-wrapper">
	<img alt="TravisReport" class="timeline-comment-avatar" height="44" src="https://raw.githubusercontent.com/bjubes/travis-report/master/images/icon.png" width="44">
	<div class="branch-action-body simple-box markdown-body comment timeline-comment timeline-new-comment">
		<div class="timeline-comment-header travis-report-header" style="margin-top: -15px !important;">
			<span class="timeline-comment-label tooltipped tooltipped-multiline tooltipped-s" aria-label="I am a robot. Bee Boop.">Travis Report</span>
    		<div class="timeline-comment-header-text">
			    <strong>
			    	Travis Report
			    </strong>
			</div>
		</div>
		<p id="travis-report-msg">` + message + `<p>
		<table id="travis-report" class="table table-hover">
		</table>
	</div>
</div>
`;
}
