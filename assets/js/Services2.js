var result = []

$(document).ready(function() {
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
        var area = new Morris.Area({
            element   : 'vendas-hora',
            resize    : true,
            data      : parseVendasHora(),
            xkey      : 'y',
            ykeys     : ['item1', 'item2', 'item3'],
            labels    : ['Total', 'Fidelizados', 'Não fidelizados'],
            lineColors: ['#888', '#765ea8', '#495057'],
            hideHover : 'auto',
            behaveLikeLine: 'true',
            parseTime : false
        })            
        $('.loading-gif').remove();
    }, 3000);
});

function parseVendasHora() {
    horas = []
    horasFNF = []
    result.forEach(query => {
        query.forEach(element => {
            if (element.date.dia >= 20) {
                // quantas vendas foram realizadas na hora x
                if(typeof horas[element.date.hora] === 'undefined'){
                    horas[element.date.hora] = 1
                }else{
                    horas[element.date.hora]++
                }
                // quantas vendas da hora x  sao de clientes fidelizados
                if(typeof horasFNF[element.date.hora] === 'undefined'){
                    horasFNF[element.date.hora] = 1
                }else if(element.points != 0){
                    horasFNF[element.date.hora]++
                }
            }
        });        
    });
    var data = [];
    for(var i=0;i<24;i++) {
        if(typeof horas[i]==='undefined') {
            data.push({y:`${i}`+"h", item1: 0, item2: 0, item3: 0});
        } else {
            data.push({y:`${i}`+"h", item1: horas[i]/5, item2: horasFNF[i]/5, item3: (horas[i]-horasFNF[i])/5});
        }
    }
    console.log(data);
    return data;
}