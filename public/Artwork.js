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