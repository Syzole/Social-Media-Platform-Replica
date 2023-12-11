let xhttp = new XMLHttpRequest();
let allArt;
function init(allArtJSON) {
    allArt = allArtJSON;
    console.log(allArtJSON);
}

function toggleLikedArt(JSONart,JSONuser){
    let art = JSON.parse(JSONart);
    let user = JSON.parse(JSONuser);
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
                let updatedArt = JSON.parse(xhttp.responseText);

                if(art.isLikedBy.includes(user.userName)){
                    alert("Liked art.");
                }
                else{
                    alert("Unliked art.");
                }
                updateUI(updatedArt, user);
            } 
            else {
                alert("Error updating like.");
            }
        }
    };
    //TODO: update user liked art in database
    xhttp.send(JSON.stringify(art));
}

function updateUI(art, user){
    let containerID = `${art.Title} artInfo`;
    let container = document.getElementById(containerID);

    let buttonID = `${art.Title} button`;
    let button = document.getElementById(buttonID);

    if(art.isLikedBy.includes(user.userName)){
        button.classList.remove('unlikedButton');
        button.classList.add('likedButton');
        button.textContent = 'Unlike';
    }
    else{
        button.classList.remove('likedButton');
        button.classList.add('unlikedButton');
        button.textContent = 'Like';
    }
}