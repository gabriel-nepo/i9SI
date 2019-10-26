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
        testesdef();
        var line = new Morris.Line({
            element          : 'vendas-dia',
            resize           : true,
            data             : parseVendas(),
            xkey             : 'y',
            ykeys            : ['item1'],
            labels           : ['Quantidade de vendas'],
            lineColors       : ['#111'],
            hideHover        : 'auto',
            gridStrokeWidth  : 0.4,
            events           : ['2019-09-19'],
            eventStrokeWidth   : 3,
            eventLineColors  : ['#A59DB7'],
            pointSize        : 4,
            goalLineColors   : '#333',
            gridTextColor    : '#333'
        })
        var line = new Morris.Line({
            element          : 'lucro-dia',
            resize           : true,
            data             : parseLucro(),
            xkey             : 'y',
            ykeys            : ['item1'],
            labels           : ['Quantidade de Receita'],
            lineColors       : ['#495057'],
            hideHover        : 'auto',
            gridStrokeWidth  : 0.4,
            events           : ['2019-09-19'],
            eventStrokeWidth   : 3,
            eventLineColors  : ['#A59DB7'],
            pointSize        : 4,
            gridTextColor    : '#333',
            yLabelFormat     :  function (y, data) { return 'R$' + y } 
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
            events           : ['2019-09-19'],
            eventStrokeWidth   : 3,
            eventLineColors  : ['#A59DB7'],
            behaveLikeLine: 'true',
            gridTextColor    : '#333'
        })            
        // Donut Chart
        var donut = new Morris.Donut({
            element  : 'porc-fidel',
            resize   : true,
            colors   : ['#765ea8', '#333'],
            data     : parsePorcVendasFidel(),
            hideHover: 'auto',
            gridTextColor    : '#333',
            formatter : function (y, data) { return y+'%' } 
        })
        var chartL = new Morris.Bar({
            element  : 'media-a-d',
            resize   : true,
            barColors   : ['#A59DB7', '#765ea8'],
            data     : parseAntesDepoisVendas(),
            xkey     : 'y',
            ykeys    : ['item1', 'item2'],
            labels   : ['Antes', 'Depois'],
            hideHover: 'auto',
            gridTextColor    : '#333'
        })
        var chartV = new Morris.Bar({
            element  : 'media-a-d-v',
            resize   : true,
            barColors   : ['#A59DB7', '#765ea8'],
            data     : parseAntesDepoisLucro(),
            xkey     : 'y',
            ykeys    : ['item1', 'item2'],
            labels   : ['Antes', 'Depois'],
            hideHover: 'auto',
            gridTextColor    : '#333'
        })
        var vendashora = new Morris.Area({
            element   : 'vendas-hora',
            resize    : true,
            data      : parseVendasHora(),
            xkey      : 'y',
            ykeys     : ['item1', 'item2', 'item3'],
            labels    : ['Total', 'Fidelizados', 'Não fidelizados'],
            lineColors: ['#888', '#765ea8', '#495057'],
            hideHover : 'auto',
            behaveLikeLine: 'true',
            parseTime : false,
            gridTextColor    : '#333'
        })
        document.getElementById("conteudoDicas").innerHTML = parseVendasHorasDica();
        $('.loading-gif').remove();
        document.getElementById("clientes-fidelizados").innerHTML = parseClientesFidelizados();
        document.getElementById("pontuacao-distribuida").innerHTML = parsePontDist();
        document.getElementById("clientes-nao-fid").innerHTML = 100 - parseClientesFidelizados();
        // Fix for charts under tabs
        $('.box ul.nav a').on('shown.bs.tab', function () {
            area.redraw()
            donut.redraw()
            chartL.redraw()
            chartV.redraw()
        })
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
    return data;
}

function parseVendasHorasDica() {
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
        if(typeof horas[i]!=='undefined') {
            data.push(horas[i]/5);
        }
    }
    var soma = data.reduce((a, b) => a + b, 0);
    soma/=data.length;
    var menores = [];
    var maiores = []
    for(i=0;i<data.length;i++) {
        if(data[i] <= soma) {
            menores.push(i+1);
        } else {
            maiores.push(i+1);
        }
    }
    var a = "";
    menores.forEach(element => {
        a += element+"h, "
    });

    return "Horários de menor venda: <br>"+ a.substring(0, a.length - 2) +"<br> É recomendável que reduza a alocação de funcionários nesses horários.";
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
    data.push({y: "Média de Receita por dia", item1: lucroAntes.toFixed(2), item2: lucroDepois.toFixed(2)})
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
    data.push({y: "Média de Vendas por dia", item1: parseInt(qntAntes), item2: parseInt(qntDepois)})
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

function testesdef() {
    var vendasDias = [0,0,0,0,0,0,0,0,0,0,0,0];
    var vendasDiasInfidel = [0,0,0,0,0,0,0,0,0,0,0,0];
    result.forEach(query => {
        query.forEach(element => {
            if (element.date.dia == 24 && element.pontos == 0) {
                console.log(element.cliente.id);
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
    var data = [{label:`Fidelizados`, value: fidelPorc},
                {label:`Não Fidelizados`, value: 100-fidelPorc}]
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
            if (element.date.day >= 20 && element.points == 0 && !clientes.includes(element.cliente.id)) {
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