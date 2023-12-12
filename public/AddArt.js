let xhttp = new XMLHttpRequest();

function addArt(user){
    let title = document.getElementById('title').value;
    let artist = user.userName;
    let year = document.getElementById('year').value;
    let category = document.getElementById('category').value;
    let medium = document.getElementById('medium').value;
    let description = document.getElementById('description').value;
    let posterLink = document.getElementById('poster').value;

    if(!title || !artist || !year || !category || !medium || !description || !posterLink){
        alert("Please fill out all fields");
        return;
    }
    else{
        let art = {
            Title: title,
            Artist: artist,
            Year: year,
            Category: category,
            Medium: medium,
            Description: description,
            Poster: posterLink
        };
        xhttp.open("POST", "/addArt", false);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 201) {
                    console.log("Added art.");
                    alert("Added art.");
                    window.location.href = `/art/${title}`;
                } 
                else {
                    alert("Error adding art.");
                    console.log("Error adding art.");
                    console.log(xhttp.status);
                }
            }
        };
        xhttp.send(JSON.stringify(art));
    }
}