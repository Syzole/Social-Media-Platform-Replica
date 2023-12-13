let xhttp = new XMLHttpRequest();

function editReview(art, user) {
    let review = document.getElementById("review").value;
    console.log(review);

    xhttp.open("POST", "/updateReview", false);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                alert("Review successfully updated!");
                //refresh page to make things easier
                window.location.reload();
            } 
            else {
                alert("Error updating review.");
            }
        }
    }
    let data = {
        "reviews": review,
        "Title": art.Title,
        "user": user
    }
    console.log(data);

    xhttp.send(JSON.stringify(data));
}

function toggleLikedArt(art,user){
    
    if(art.isLikedBy.includes(user.userName)){
        art.isLikedBy.pop(user.userName);
    }
    else{
        art.isLikedBy.push(user.userName);
    }
    xhttp.open("POST", "/updateLike", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log("Updated like.");

                if(art.isLikedBy.includes(user.userName)){
                    alert("Liked art.");
                }
                else{
                    alert("Unliked art.");
                }
                window.location.reload();
            } 
            else {
                alert("Error updating like.");
            }
        }
    };
    //TODO: update user liked art in database
    xhttp.send(JSON.stringify(art));
}