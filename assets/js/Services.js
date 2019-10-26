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
        var line = new Morris.Line({
            element          : 'vendas-dia',
            resize           : true,
            data             : parseVendas(result),
            xkey             : 'y',
            ykeys            : ['item1'],
            labels           : ['Item 1'],
            lineColors       : ['#495057'],
            lineWidth        : 2,
            hideHover        : 'auto',
            gridTextColor    : '#444',
            gridStrokeWidth  : 0.4,
            pointSize        : 4,
            pointStrokeColors: ['#495057'],
            gridLineColor    : '#495057',
            gridTextFamily   : 'Open Sans',
            gridTextSize     : 10
        })
    }, 3000);
});


function parseVendas(result) {
    var mediaDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    console.log(result[0]);
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13;
            mediaDias[dia]++;
        });        
    });
    var data = [];
    for(var i=0;i<12;i++) {
        data.push({y:`2019-09-${i+13}`, item1: mediaDias[i]})
    }
    return data;
}

function parseMediaVendas(result) {
    var mediaDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    var qntDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    console.log(result[0]);
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13;
            qntDias[dia]++;
            mediaDias[dia]+=parseInt(element.price);
        });        
    });
    console.log(mediaDias[0]);
    for(i=0;i<12;i++) {
        mediaDias[i] /= qntDias[i];
    }
    console.log(mediaDias);
}