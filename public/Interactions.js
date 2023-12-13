let xhttp = new XMLHttpRequest();

function unlikeArt(art, user){
    art.isLikedBy.pop(user.userName);
    xhttp.open("POST", "/updateLike", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log("Updated like.");

                alert("Unliked art.");

                window.location.reload();
            } 
            else {
                alert("Error updating like.");
            }
        }
    };
    xhttp.send(JSON.stringify(art));
}

function editReview(art, user) {
    let id = `${art.Title} review`;
    let review = document.getElementById(id).value;
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

function deleteReview(art, user) {
    xhttp.open("POST", "/deleteReview", false);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                alert("Review successfully deleted!");
                //refresh page to make things easier
                window.location.reload();
            } 
            else {
                alert("Error deleting review.");
            }
        }
    }
    let data = {
        "Title": art.Title,
        "user": user
    }
    console.log(data);

    xhttp.send(JSON.stringify(data));
}