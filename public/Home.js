let xhttp = new XMLHttpRequest();
let allArt;
function init(allArtJSON) {
    allArt = allArtJSON;
    console.log(allArt);
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
    xhttp.send(JSON.stringify(art));
}