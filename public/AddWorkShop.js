let xhttp = new XMLHttpRequest();

function addWorkShop(user){
    let title = document.getElementById('title').value;
    let description = document.getElementById('description').value;

    if(!title || !description){
        alert("Please fill in all fields");
        return;
    }

    xhttp.open("POST", "/addWorkShop", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 201) {
                console.log("Added workshop.");
                alert("Added workshop.");
                window.location.href = `/workshop/${title}`;
            } 
            else {
                alert("Error adding workshop.");
            }
        }
    };

    let data = {
        Title: title,
        Artist: user.userName,
        Description: description
    }

    xhttp.send(JSON.stringify(data));

}