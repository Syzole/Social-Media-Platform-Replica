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

    container.innerHTML = `
        <h2>${art.Title}</h2>
        <a href="/art/${art.Title}" type="text/html">
          <img src="${art.Poster}" alt="Oops, the art poster is acting a bit odd, but You can right click to see it still!"/>
        </a>
        <p>
          Artist: 
          <a href="/artist/${art.Artist}" type="text/html">${art.Artist}</a>
        </p>
    `;
    let buttonString;
    console.log('Art:', art);
    console.log('User:', user);

    if (art.isLikedBy.includes(user.userName)) {
        buttonString = `
            <button class="likedButton" onclick='toggleLikedArt(${JSON.stringify(art)}, ${JSON.stringify(user)})'>Unlike</button>
        `;
    } else {
        buttonString = `
            <button class="unlikedButton" onclick='toggleLikedArt(${JSON.stringify(art)}, ${JSON.stringify(user)})'>Like</button>
        `;
    }
    container.innerHTML += buttonString;
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