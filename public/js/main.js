
const search = ()=>{
    event.preventDefault();
    let value =  document.getElementById('Search').value?.toLowerCase().split("\n");
    
    if(value){
        fetch('http://localhost:3000/search/' + value);
    }
}