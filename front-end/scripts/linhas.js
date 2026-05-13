window.onload = function() {

var dataPoints = [];

var options =  {
	animationEnabled: true,
	theme: "light2",
	title: {
		text: "ALERTAS CAIPORA"
	},
	axisX: {
		valueFormatString: "DD MMM YYYY",
	},
	axisY: {
		title: "ALERTAS",
		titleFontSize: 24
	},
	data: [{
		type: "spline", 
		yValueFormatString: "$#",
		dataPoints: dataPoints
	}]
};

function addData(data) {
	for (var i = 0; i < data.length; i++) {
		dataPoints.push({
			x: new Date(data[i].date),
			y: data[i].units
		});
	}
	$("#chartContainer").CanvasJSChart(options);

}
$.getJSON("https://canvasjs.com/data/gallery/jquery/daily-sales-data.json", addData);

}