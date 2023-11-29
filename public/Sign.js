let xhttp = new XMLHttpRequest();

function init() {
    let userNameBox = document.getElementById("username");
    let passwordBox = document.getElementById("password");
    let signupButton = document.getElementById("signupButton");

    signupButton.addEventListener('click', function() {
        let userName = userNameBox.value;
        let password = passwordBox.value;

        // Make a POST request to the server
        xhttp.open("POST", "/users", true);
        xhttp.setRequestHeader("Content-Type", "application/json");

        // Set up the callback function to handle the server's response
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 201) {
                    // User successfully registered
                    alert("Registration successful! You can now log in.");
                    // Optionally, you can redirect the user to the login page
                    // window.location.href = "/";
                } else if (xhttp.status === 409) {
                    // User already exists
                    alert("Username already exists. Please choose a different username.");
                } else {
                    // Handle other response statuses as needed
                    alert("An error occurred during registration.");
                }
            }
        };

        // Send the user data to the server
        xhttp.send(JSON.stringify({ userName, password }));
    });
}
