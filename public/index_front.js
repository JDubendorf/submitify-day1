/*
	This is the front-end javascript for our website. It handles displaying the
	projects to the user. You can think of this as the "view" of the site.
*/

/*
	This function takes in a project (object with name, author, description, and
	votes array), and returns a DOM element clone of the project template. (An
	HTML element that we can append to the page later).
*/

function createProjectHMTL(project) {
	// clone the template
	var projectDiv = $("#project_template").clone();
	// remove the id (only one thing with each id)
	projectDiv.removeAttr("id");
	// set name, author, and description
	projectDiv.find(".project_name").text(project.name);
	projectDiv.find(".project_author").text(project.author);
	projectDiv.find(".project_description").text(project.description);	
	projectDiv.find(".project_voteNum").text("Votes:" + project.votes.length);
	console.log(project.votes);

	projectDiv.find(".project_vote").click(function() {
		submitVote(project.name);
	});
	
	// show this clone of the template (template is hidden by default)
	projectDiv.show();
	// return a reference to the clone
	return projectDiv;
}

function getProjects() {
	$("#projects").text("");
	$.get('/api/projects', function(res) {
		// res here is what we ("res.send") on the backend
		if (res.length === 0) {
			$('#projects').text("No projects!");
		} else {
			for (var i in res) {
				// for-in, since for-of sometimes doesn't work on frontend
				$('#projects').append(createProjectHMTL(res[i]) );
			}
		}
	}, 'json'); //'json' = auto parse as json
}

function sendNewProject() {
		// gather our data
		var project = {
			name: $('#new_project_name').val(),
			description: $('#new_project_description').val()
		};
		// send our data to the server by POSTing it to /api/project.
		// note that the second argument here will become res.body on the server
		$.post('/api/project', project, function(res) {
			$('#projects').append(createProjectHMTL(res));
		}, 'json');
}

function submitVote(thisProject) {
	var projectData = {
		name: thisProject
	}; 
	console.log(projectData);
	$.post("/api/vote", projectData, function(res){
		if (res === "success") {
					getProjects();
		}
	});
}

/*
	On page load...
*/

$(document).ready(function() {
	/*
		Get all of the projects from the server via AJAX. Uses the
		"/api/projects" endpoint. If the response is an empty array, display
		"No projects!". Otherwise we build the projects into HTML and display
		them on the page.
	*/
	getProjects();

	$("#send_new_project").click(sendNewProject);
	/*
		When we click on the "send new project" button...
	*/

});
