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