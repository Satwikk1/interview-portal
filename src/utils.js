function getAdminDetails(id){
    let data = JSON.parse(localStorage.getItem('admin'));
    let admin;
    data.forEach(itm=>{
        if(itm.id==id){
            admin = itm;
            return;
        }
    })
    return admin;
}

// binary search -> bool
function binarySearch(arr, x){
    let start=0, end=arr.length-1;
    while (start<=end){
        let mid=Math.floor((start + end)/2);
        if (arr[mid]===x) return true;
        else if (arr[mid] < x)
             start = mid + 1;
        else
             end = mid - 1;
    }
    return false;
}

// binary search for finding matched interviews
function getScheduledInterviews(id){
    let data = getAdminDetails(id);
    let interviews = data.interviewID;
    interviews.sort();
    
    let interviewObjs = JSON.parse(localStorage.getItem('interview'));
    interviewObjs.filter(itm=>binarySearch(interviews, itm.id));
    return interviewObjs;
}

export {
    getScheduledInterviews,
    binarySearch,
    getAdminDetails
}