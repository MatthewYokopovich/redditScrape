var newID;
$(document).on("click", "#commentSubmit", event =>{
    var body = $("#commentForm").val();
    var newComment = {
        body,
        articleID: newID
    }
    console.log(newComment);
    $.post("/submit", newComment, data =>{
        console.log("post successful");
    })
});
$('.modal').on('show.bs.modal', function (e) {
    $(".modal-body").empty();
    newID = $(e.relatedTarget).data("id");
    $.get("/"+newID, artToGet =>{
        if(artToGet[0].comments){
            artToGet[0].comments.forEach(comtoadd =>{
                var newComment = $(`<div>`);
                var newP = $(`<p>`).text(comtoadd.body);
                var newB = $(`<button class="btn btn-danger" data-id="${comtoadd._id}">`).text("Delete");
                newComment.append(newP);
                newComment.append(newB);
                $(".modal-body").append(newComment);
            })
        }
    })
});
$(document).on("click", ".btn-danger",function(event){
    var idtodel = $(this).data("id");
    $.ajax({
        url: "/delete/"+idtodel,
        type: "DELETE",
        success: result =>{
            console.log("delete success");
        }
    })
})