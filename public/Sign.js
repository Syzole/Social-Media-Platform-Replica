let xhttp = new XMLHttpRequest();
function init() {
    let userNameBox = document.getElementById("username");
    let passwordBox = document.getElementById("password");
    let signupButton = document.getElementById("signupButton");

    signupButton.addEventListener('click', function() {
        let userName = userNameBox.value;
        let password = passwordBox.value;
    });
}