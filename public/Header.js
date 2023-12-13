function search(){
    let searchBar = document.getElementById("searchBar");
    let search = searchBar.value;
    console.log(search);
    if(!search){
        alert("Please enter a search term.");
        return;
    }
    window.location.href = `/search/${search}/0`;
}

function logout(){
    window.location.href = "/logout";
}