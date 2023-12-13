let xhttp = new XMLHttpRequest();

function prevPage(pageNum, search){
    if(pageNum == 0){
        //dont change page
    }
    else{
        pageNum--;
    }
    window.location.href = "/search/"+search+"/"+pageNum;
}

function nextPage(pageNum, search){
    pageNum++;
    window.location.href = "/search/"+search+"/"+pageNum;
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