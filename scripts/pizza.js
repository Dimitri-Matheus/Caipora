// scripts/pizza.js

function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function addSlice(id, sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+ sliceID + "'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;

  $(id + " ." + sliceID).css({
    "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
  });

  $(id + " ." + sliceID + " span").css({
    "transform"       : "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function iterateSlices(id, sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var
    maxSize = 179,
    sliceID = "s" + dataCount + "-" + sliceCount;

  if( sliceSize <= maxSize ) {
    addSlice(id, sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(id, maxSize, pieElement, offset, sliceID, color);
    iterateSlices(id, sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}

// NOVA FUNÇÃO: Agora recebe os alertas reais do backend
function atualizarGraficoPizza(alertas) {
  var id = '.c-graphic__delivery';
  var pieElement  = id + " .c-graphic__circle--donut__inner__pie";
  var dataElement = id + " .c-graphic__circle--donut__inner__legend";

  // 1. LIMPEZA CRUCIAL: Remove as fatias antigas para o polling não encavalar elementos HTML
  $(pieElement).empty();

  // 2. AGRUPAMENTO: Conta quantos alertas existem de cada tipo de som
  var contagemSons = {};
  alertas.forEach(function(alerta) {
    var tipo = alerta.tipo_som || "RUÍDO";
    contagemSons[tipo] = (contagemSons[tipo] || 0) + 1;
  });

  var listLabels = Object.keys(contagemSons);
  var listData   = Object.values(contagemSons);
  var listTotal  = 0;
  var offset     = 0;

  var color = [
    "#6a1b9a", // Roxo principal
    "#00b0ff", // Ciano
    "#00e676", // Verde
    "#ff3d00", // Crimson / Laranja
    "#ff007f", // Rosa
    "turquoise",
    "forestgreen",
    "navy"
  ];

  // Calcular o total geral de incidentes
  for(var i = 0; i < listData.length; i++) {
    listTotal += listData[i];
  }

  // 3. ATUALIZAR LEGENDA: Recria a lista HTML com os nomes e valores reais
  var legendContainer = $(dataElement);
  legendContainer.empty(); // Limpa a legenda antiga estática

  listLabels.forEach(function(label, index) {
    var corAtual = color[index % color.length];
    legendContainer.append(
      "<li style='border-color: " + corAtual + "'>" + label + ": <span>" + contagemSons[label] + "</span></li>"
    );
  });

  // 4. RENDERIZAR FATIAS: Desenha o gráfico com os ângulos corretos
  for(var i=0; i < listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(id, size, pieElement, offset, i, 0, color[i % color.length]);
    offset += size;
  }
}

// Expõe a função globalmente para que o dashboard.js consiga chamá-la
window.atualizarGraficoPizza = atualizarGraficoPizza;