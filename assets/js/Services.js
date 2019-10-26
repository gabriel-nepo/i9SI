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
            data             : parseVendas(),
            xkey             : 'y',
            ykeys            : ['item1'],
            labels           : ['Quantidade de vendas'],
            lineColors       : ['#495057'],
            hideHover        : 'auto',
            gridStrokeWidth  : 0.4,
            pointSize        : 4
        })
        var area = new Morris.Area({
            element   : 'num-fidel',
            resize    : true,
            data      : parseVendasFidel(),
            xkey      : 'y',
            ykeys     : ['item1', 'item2'],
            labels    : ['Fidelizado', 'Não fidelizado'],
            lineColors: ['#495057', '#765ea8'],
            hideHover : 'auto'
        })            
        // Donut Chart
        var donut = new Morris.Donut({
            element  : 'porc-fidel',
            resize   : true,
            colors   : ['#765ea8', '#333'],
            data     : parsePorcVendasFidel(),
            hideHover: 'auto'
        })

        // Fix for charts under tabs
        $('.box ul.nav a').on('shown.bs.tab', function () {
            area.redraw()
            donut.redraw()
        })
    }, 3000);
});


function parseVendas() {
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

function parseVendasFidel() {
    var vendasDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    var vendasDiasInfidel = [0,0,0,0,0,0,0,0,0,0,0,0];
    console.log(result[0]);
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13;
            if (element.points == 0) {
                vendasDiasInfidel[dia]++
            } else {
                vendasDias[dia]++;
            }
        });        
    });
    var data = [];
    for(var i=0;i<12;i++) {
        data.push({y:`2019-09-${i+13}`, item1: vendasDias[i], item2: vendasDiasInfidel[i]})
    }
    return data;
}

function parsePorcVendasFidel() {
    var vendasFidel = 0;
    var vendasInfidel = 0;
    console.log(result[0]);
    result.forEach(query => {
        query.forEach(element => {
            if (element.date.dia>=20) {
                if (element.points == 0) {
                    vendasInfidel++;
                } else {
                    vendasFidel++;
                }
            }
        });        
    });
    fidelPorc = parseInt(100*vendasFidel/(vendasFidel + vendasInfidel));
    var data = [{label:`Fidelizado`, value: fidelPorc},
                {label:`Não Fidelizado`, value: 100-fidelPorc}]
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