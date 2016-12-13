// print article info into html
$.getJSON("/articles", function(data){
	for (var n = 0; n < data.length; n++){
		$("#articles").append("<li class='collection-item avatar' id='"+ data[n]._id +"''> <span class='title'>"+data[n].title+"</span> <p>"+ data[n].source +" <br><a href= "+data[n].link+">Read More</a></p></li>")
	}
})

