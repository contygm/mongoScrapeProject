// print article info into html
$.getJSON("/articles", function(data){
	for (var n = 0; n < data.length; n++){
		$("#articles").append("<p class='collection-item avatar' id='"+ data[n]._id +"''> <span class='title'>"+data[n].title+"</span> <br><a href= "+data[n].link+">Read More</a></p>")
	}
})

//grab note on click

//display note info

//save button on note
