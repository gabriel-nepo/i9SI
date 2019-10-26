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
        dadosParaGrafico();
        dadosParaGraficoCliente();

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

function dadosParaGrafico(){
    var lucroDias = [0,0,0,0,0,0,0,0,0,0,0,0]
    var quantidadeVendasDias= [0,0,0,0,0,0,0,0,0,0,0,0]
    var lucroFidelizadoDia = [0,0,0,0,0]
    var mediaLucroAD = []
    var mediaQuantidadeVendasAD = []
    var mediaLucroFNF = []


    for(var i = 0; i < result.length; i++){
        for(var j = 0; j < result[i].length; j++){
            elemento = result[i][j]
            dia = elemento.date.dia - 13
            lucroDias[dia] +=  elemento.quantity * elemento.products[0].data.pricePerUnit
            quantidadeVendasDias[dia] ++
            
            if (dia > 6 && elemento.points != 0){
                diaAux = dia - 6
                lucroFidelizadoDia[diaAux] += elemento.quantity * elemento.products[0].data.pricePerUnit
            }
        }
    }

    mediaLucroAD[0] = (lucroDias[0] + lucroDias[1] + lucroDias[2] + lucroDias[3] + lucroDias[4] + lucroDias[5] + lucroDias[6])/7
    mediaLucroAD[1] = (lucroDias[7] + lucroDias[8] + lucroDias[9] + lucroDias[10] + lucroDias[11])/5

    mediaQuantidadeVendasAD[0] = (quantidadeVendasDias[0] + quantidadeVendasDias[1] + quantidadeVendasDias[2] + quantidadeVendasDias[3] + quantidadeVendasDias[4] + quantidadeVendasDias[5] + quantidadeVendasDias[6])/7
    mediaQuantidadeVendasAD[1] = (quantidadeVendasDias[7] + quantidadeVendasDias[8] + quantidadeVendasDias[9] + quantidadeVendasDias[10] + quantidadeVendasDias[11])/5
    
    mediaLucroFNF[0] = (
        (lucroFidelizadoDia[0]/lucroDias[7]*100) + 
        (lucroFidelizadoDia[1]/lucroDias[8]*100) +
        (lucroFidelizadoDia[2]/lucroDias[9]*100) +
        (lucroFidelizadoDia[3]/lucroDias[10]*100) +
        (lucroFidelizadoDia[4]/lucroDias[11]*100))/5
}

// function dadosParaGraficoProduto(){
//     arrayProdutos = []
//     arrayQtdProdutos = []

//     for(var i = 0; i < result.length; i++){
//         for(var j = 0; j < result[i].length; j++){
//             elemento = result[i][j]
//             if(arrayProdutos.includes(elemento.products.data.name)){
//                 arrayQtdProdutos[arrayProdutos.indexOf(elemento.products.data.name)] += elemento.quantity
//             }else{
//                 arrayProdutos.push(elemento.products.data.name)
//                 arrayQtdProdutos[arrayProdutos.indexOf(elemento.products.data.name)] = 0
//             }
//         }
//     }

//     console.log(arrayQtdProdutos)
//     console.log(arrayProdutos)
// }

function dadosParaGraficoCliente(){
    // hora
    horas = []
    horasFNF = []

    for(var i = 0; i < result.length; i++){
        for(var j = 0; j < result[i].length; j++){
            elemento = result[i][j]
            // quantas vendas foram realizadas na hora x
            if(typeof horas[elemento.date.hora] === 'undefined'){
                horas[elemento.date.hora] = 0
            }else{
                horas[elemento.date.hora]++
            }
            // quantas vendas da hora x  sao de clientes fidelizados
            if(typeof horasFNF[elemento.date.hora] === 'undefined'){
                horasFNF[elemento.date.hora] = 0
            }else if(elemento.points != 0){
                horasFNF[elemento.date.hora]++
            }
        }
    }
}

function parseVendas() {
    var mediaDias = [0,0,0,0,0,0,0,0,0,0,0,0];
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
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13;
            qntDias[dia]++;
            mediaDias[dia]+=parseInt(element.price);
        });        
    });
    for(i=0;i<12;i++) {
        mediaDias[i] /= qntDias[i];
    }
}