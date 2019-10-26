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
        var line = new Morris.Line({
            element          : 'lucro-dia',
            resize           : true,
            data             : parseLucro(),
            xkey             : 'y',
            ykeys            : ['item1'],
            labels           : ['Quantidade de lucro'],
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
            ykeys     : ['item1', 'item2', 'item3'],
            labels    : ['Total', 'Fidelizados', 'Não fidelizados'],
            lineColors: ['#888', '#765ea8', '#495057'],
            hideHover : 'auto',
            behaveLikeLine: 'true'
        })            
        // Donut Chart
        var donut = new Morris.Donut({
            element  : 'porc-fidel',
            resize   : true,
            colors   : ['#765ea8', '#333'],
            data     : parsePorcVendasFidel(),
            hideHover: 'auto'
        })
        var chartL = new Morris.Bar({
            element  : 'media-a-d',
            resize   : true,
            colors   : ['#765ea8', '#333'],
            data     : parseAntesDepoisVendas(),
            xkey     : 'y',
            ykeys    : ['item1', 'item2'],
            labels   : ['Antes', 'Depois'],
            hideHover: 'auto'
        })
        var chartV = new Morris.Bar({
            element  : 'media-a-d-v',
            resize   : true,
            colors   : ['#765ea8', '#333'],
            data     : parseAntesDepoisLucro(),
            xkey     : 'y',
            ykeys    : ['item1', 'item2'],
            labels   : ['Antes', 'Depois'],
            hideHover: 'auto'
        })
        $('.loading-gif').remove();
        document.getElementById("clientes-fidelizados").innerHTML = parseClientesFidelizados();
        document.getElementById("pontuacao-distribuida").innerHTML = parsePontDist();
        document.getElementById("clientes-nao-fid").innerHTML = parseClientesNaoFidelizados();
        // Fix for charts under tabs
        $('.box ul.nav a').on('shown.bs.tab', function () {
            area.redraw()
            donut.redraw()
            chartL.redraw()
            chartV.redraw()
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
            console.log(elemento.products[0].data.pricePerUnit)
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
        
    console.log(lucroDias)
    console.log(mediaLucroAD)
    
    console.log(quantidadeVendasDias)
    console.log(mediaQuantidadeVendasAD)

    console.log(mediaLucroFNF)
}

function switchTab(oldid, newid) {
    $("#"+oldid).css("display", "none");
    $("#"+newid).css("display", "block");
}

function parseLucro() {
    var lucroDias = [0,0,0,0,0,0,0,0,0,0,0,0]
    var quantidadeVendasDias = [0,0,0,0,0,0,0,0,0,0,0,0]
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13
            lucroDias[dia] +=  element.quantity * element.products[0].data.pricePerUnit;
            quantidadeVendasDias[dia]++;
        });        
    });
    var data = [];
    for(var i=0;i<12;i++) {
        data.push({y:`2019-09-${i+13}`, item1: lucroDias[i].toFixed(2)})
    }
    return data;
}

function parseAntesDepoisLucro() {
    var lucroDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    var quantidadeVendasDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13
            lucroDias[dia] +=  element.quantity * element.products[0].data.pricePerUnit;
            quantidadeVendasDias[dia]++;
        });        
    });
    var data = [];
    var lucroAntes = 0;
    var lucroDepois = 0;
    for(var i=0;i<7;i++) {
        lucroAntes+=lucroDias[i];
    }
    lucroAntes/=7;
    for(var i=7;i<12;i++) {
        lucroDepois+=lucroDias[i];
    }
    lucroDepois/=5;
    data.push({y: "Média de lucro", item1: lucroAntes.toFixed(2), item2: lucroDepois.toFixed(2)})
    return data;
}
function parseAntesDepoisVendas() {
    var quantidadeVendasDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    result.forEach(query => {
        query.forEach(element => {
            let dia = element.date.dia - 13
            quantidadeVendasDias[dia]++;
        });        
    });
    var data = [];
    var qntAntes = 0;
    var qntDepois = 0;
    for(var i=0;i<7;i++) {
        qntAntes+=quantidadeVendasDias[i];
    }
    qntAntes/=7;
    for(var i=7;i<12;i++) {
        qntDepois+=quantidadeVendasDias[i];
    }
    qntDepois/=5;
    data.push({y: "Média de Vendas", item1: parseInt(qntAntes), item2: parseInt(qntDepois)})
    return data;
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
        data.push({y:`2019-09-${i+13}`, item1: vendasDiasInfidel[i]+vendasDias[i], item2: vendasDias[i], item3: vendasDiasInfidel[i]})
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

function parseClientesFidelizados() {
    var vendasFidel = 0;
    var clientes = [];
    result.forEach(query => {
        query.forEach(element => {
            if (element.date.dia>=20) {
                if (element.points != 0 && !clientes.includes(element.cliente.id)) {
                    vendasFidel++;
                    clientes.push(element.cliente.id);
                }
            }
        });        
    });
    return vendasFidel;
}

function parseClientesNaoFidelizados() {
    var vendasInfidel = 0;
    var clientes = [];
    result.forEach(query => {
        query.forEach(element => {
            if (element.points == 0 && !clientes.includes(element.cliente.id)) {
                vendasInfidel++;
                clientes.push(element.cliente.id);
            }
        });        
    });
    return vendasInfidel;
}

function parsePontDist() {
    var pontosDistribuidos = 0;
    result.forEach(query => {
        query.forEach(element => {
            if (element.date.dia>=20) {
                if (element.points != 0) {
                    pontosDistribuidos+= element.points;
                }
            }
        });        
    });
    return pontosDistribuidos;
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
    console.log(mediaDias[0]);
    for(i=0;i<12;i++) {
        mediaDias[i] /= qntDias[i];
    }
    console.log(mediaDias);
}