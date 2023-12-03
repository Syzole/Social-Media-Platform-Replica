let xhttp = new XMLHttpRequest();

function init() {
    let userNameBox = document.getElementById("username");
    let passwordBox = document.getElementById("password");
    let signupButton = document.getElementById("signupButton");

    signupButton.addEventListener('click', function() {
        let userName = userNameBox.value;
        let password = passwordBox.value;

        if(!userName||!password){
            alert("Please enter a username or password.");
        }

        else{
            // Make a POST request to the server
            xhttp.open("POST", "/users", false);
            xhttp.setRequestHeader("Content-Type", "application/json");

            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 201) {
                        // User successfully registered
                        alert("Registration successful! Moving to login page.");
                        //move to login
                        window.location.href = "/";
                    } 
                    else {
                        alert("Username already exists. Please choose a different username.");
                    }
                }
            };

            // Send the user data to the server
            let data = {
                "userName":userName,
                "password":password
            }
            xhttp.send(JSON.stringify(data));
        }
    });
    
}
