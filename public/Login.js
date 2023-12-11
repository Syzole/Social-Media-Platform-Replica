let xhttp = new XMLHttpRequest();

function init() {
    let userNameBox = document.getElementById("username");
    let passwordBox = document.getElementById("password");
    let loginButton = document.getElementById("login");

    loginButton.addEventListener('click', function() {
        let userName = userNameBox.value;
        let password = passwordBox.value;

        if(!userName||!password){
            alert("Please enter a username or password.");
        }

        else{
            xhttp.open("POST", "/login", false);
            xhttp.setRequestHeader("Content-Type", "application/json");

            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        alert("Login successful! Moving to home page.");
                        
                        window.location.href = "/home";
                    } 
                    else {
                        alert("Username or password is incorrect. Please try again.");
                    }
                }
            };

            let data = {
                "userName":userName,
                "password":password
            }
            xhttp.send(JSON.stringify(data));
        }
    });
}