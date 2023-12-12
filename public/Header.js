function search(){
    let searchBar = document.getElementById("searchBar");
    let search = searchBar.value;
    console.log(search);
    window.location.href = `/search/${search}`;
}