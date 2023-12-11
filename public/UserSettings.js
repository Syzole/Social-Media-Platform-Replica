let xhttp = new XMLHttpRequest();

function init() {
    
}

function changeAccountType(user) {
    // console.log("1:" + user.isArtist);
    xhttp.open("POST", "/changeAccountType", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    //first change the type of the user

    if (user.isArtist) {
        user.isArtist = false;
    } 
    else {
        user.isArtist = true;
    }

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                // User successfully registered
                alert("Account type changed!");
                //refresh the page
                window.location.href = "/userSettings";
            } 
            else {
                //should never happen
                alert("Error changing account type.");
            }
        }
    };

    // console.log("2:" + user.isArtist);
    // console.log(user);
    //then send the request
    xhttp.send(JSON.stringify(user));
}