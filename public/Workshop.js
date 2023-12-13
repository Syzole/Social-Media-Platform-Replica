let xhttp = new XMLHttpRequest();

function init(workshop){
    console.log(workshop);
}

function enroll(user, workshop){
    workshop.Enrolled.push(user.userName);
    console.log(workshop);
    xhttp.open("POST", "/updateEnrolled", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                console.log("Updated enrolled.");
                alert("Enrolled in workshop.");
                window.location.reload();
            } 
            else {
                alert("Error updating enrolled.");
            }
        }
    };
    xhttp.send(JSON.stringify(workshop));
}
