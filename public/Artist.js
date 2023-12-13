let xhttp = new XMLHttpRequest();

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
                let updatedArt = JSON.parse(xhttp.responseText);

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

function toggleFollow(artist, user){
    if(user.following.includes(artist.userName)){
        user.following.pop(artist.userName);
        artist.followers.pop(user.userName);
    }
    else{
        user.following.push(artist.userName);
        artist.followers.push(user.userName);
    }

    xhttp.open("POST", "/updateFollowing", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log("Updated following.");
                if(user.following.includes(artist.userName)){
                    alert("Followed artist.");
                }
                else{
                    alert("Unfollowed artist.");
                }
                let updatedData = JSON.parse(xhttp.responseText);
                updateUIFollow(updatedData.artist, updatedData.user);
            } 
            else {
                alert("Error updating following.");
            }
        }
    };
    let data = {
        user: user,
        artist: artist
    }
    xhttp.send(JSON.stringify(data));
}

function updateUIFollow(artist, user){
    let containerID = `buttonDiv`;
    let container = document.getElementById(containerID);

    
    let buttonString;

    if (user.following.includes(artist.userName)) {
        buttonString = `
            <button class="unfollow" onclick='toggleFollow(${JSON.stringify(artist)}, ${JSON.stringify(user)})'>Unfollow</button>
        `;
    } else {
        buttonString = `
            <button class="follow" onclick='toggleFollow(${JSON.stringify(artist)}, ${JSON.stringify(user)})'>Follow</button>
        `;
    }
    container.innerHTML = buttonString;
}