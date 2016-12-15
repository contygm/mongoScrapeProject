// print article info into html
$.getJSON("/articles", function(data){
	for (var n = 0; n < data.length; n++){
		$("#articles").append("<p class='collection-item avatar' id='"+ data[n]._id +"''> <span class='title'>"+data[n].title+"</span> <br><a href= "+data[n].link+">Read More</a></p>")
	}
})

//grab note on click
$(document).on("click", "p", function(){
	
	//empty note space, get id, call for article
	$("#notes").empty();
	var disID = $(this).attr("id");
	$.ajax({
		method: "GET",
		url: "/articles/" + disID
	})
		.done(function(data){
			console.log(data);
			$("#notes").append("<h2>" + data.title + "</h2>");
			// inputs
			$("#notes").append("<input id='titleinput' name='title' >");
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

			// check for exisitig note
			if (data.note) {
				$("#titleinput").val(data.note.title);
				$("#bodyinput").val(data.note.body);
      		}
		})
})

//save note button
$(document).on("click", "#savenote", function() {
// Grab the id associated with the article
	var disId = $(this).attr("id");
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
		  // Value taken from title input
		  title: $("#titleinput").val(),
		  // Value taken from note textarea
		  body: $("#bodyinput").val()
		}
	})
		.done(function(data) {
		  console.log(data);
		  $("#notes").empty();
		});

	//remove the values entered in the inputs
	$("#titleinput").val("");
	$("#bodyinput").val("");
});
