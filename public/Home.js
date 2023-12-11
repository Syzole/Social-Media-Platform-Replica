let xhttp = new XMLHttpRequest();

function init() {
   
    
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
                if(art.isLikedBy.includes(user.userName)){
                    alert("Liked art.");
                }
                else{
                    alert("Unliked art.");
                }
            } 
            else {
                alert("Error updating like.");
            }
        }
    };
    //TODO: update user liked art in database
    xhttp.send(JSON.stringify(art));
}