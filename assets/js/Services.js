var result = []

// async function getInfo() {
//     result = []
//     for(let i=0;i<7;i++) {
//         let xmlhttp = new XMLHttpRequest();
//         xmlhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             result.push(JSON.parse(this.responseText));
//         }
//         };
//         xmlhttp.open("GET", `https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=${i*200}`, true);
//         xmlhttp.send();
//     }
//     setTimeout(function(){
//         console.log(result);
//     }, 2000);
// }

const index = [0,1,2,3,4,5,6];
var req = [
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=0'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=200'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=400'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=600'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=800'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=1000'),
    $.get('https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=1200')]

async function getInfo(){
    Promise.all(req).then(resp => {
        console.log(req);
    });
    
}


