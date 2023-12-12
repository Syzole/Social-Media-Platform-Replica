let xhttp = new XMLHttpRequest();

function searchForStuff() {
    //Search for art by title, artist name and category
    let search = document.getElementById("searchBar").value;

    console.log(search);

    // let searchButton = document.getElementById("searchButton");
    // if(search==null || search==""){
    //     alert("Please enter a search term.");
    //     return;
    // }
    // else{
    //     xhttp.open("POST", `/search/${search}`, false);
    //     xhttp.onreadystatechange = function() {
    //         if (xhttp.readyState === 4) {
    //             if (xhttp.status === 200) {
    //                 console.log("Found art.");
    //                 alert("Now displaying art that contains the search criteria.");
    //             } 
    //             else {
    //                 alert("Error searching for art.");
    //             }
    //         }
    //     };
    //     xhttp.send();
    // }
}