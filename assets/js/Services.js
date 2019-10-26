var result = []

async function getInfo() {
    result = []
    for(let i=0;i<7;i++) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            result.push(JSON.parse(this.responseText));
        }
        };
        xmlhttp.open("GET", `https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=${i*200}`, true);
        xmlhttp.send();
    }
    setTimeout(function(){
        console.log(result);
    }, 2000);
}



// const index = [0,1,2,3,4,5,6];
// var data=[]


// async function request(i) {
//     try {
//         value =await $.ajax({
//             url: `https://hackaengine-dot-red-equinox-253000.appspot.com/sales?per_page=200&offset=${i*200}`,
//             dataType: 'json',
//             type: 'get',
//             success: function(response){
//                 console.log({STRING: response})
//                 return response;
//             },
//             error: function(response){
//                 console.log('erro'+response);
//                 return "error";
//             }
//         });
//     } catch (error) {
//         console.error(error);
//     }
// }

// async function getInfo(){
//     // console.log({PONTO:ponto} )
//     data  = index.map( async elem=>{
//         return await request(elem);
//     })
// }
