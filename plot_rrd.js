$(document).ready(function() {
    fname = "sensehat_data.rrd";
    tSpan = 12;

    make_plot(fname);
});

function make_plot(fname) {
    try {
        FetchBinaryURLAsync(fname, setData);
    } catch (err) {
        alert("Failed loading " + fname + "\n" + err);
    }
}

function setData(bf) {
    var rrd_data = undefined;
    try {
        var rrd_data = new RRDFile(bf);
    } catch (err) {
        alert("File " + fname + " is not a valid RRD archive!\n" + err);
    }
    if (rrd_data != undefined) {
        getTimeSeries(rrd_data, tSpan);
    }
}
function getTimeSeries(db, tSpan, dbg=false) {
    var nrRRAs = db.getNrRRAs();
    var nrDSs = db.getNrDSs();
    var dbSteps = new Array(nrRRAs);
    var dbRows = new Array(nrRRAs);
    for (var i = 0; i < nrRRAs; i++) {
        dbSteps[i] = db.getRRAInfo(i).getStep();
        dbRows[i] = db.getRRAInfo(i).getNrRows();
    }
    var deltaT = tSpan * 60 * 60;
    var idx = 0;

    while ((dbSteps[idx] * dbRows[idx] < deltaT) && (idx < nrRRAs - 1)) {
        idx += 1;
    }
    var RRA = db.getRRA(idx);
    var nrRows = ~~(deltaT / RRA.getStep());

    if (dbg) {
        console.log("idx = " + idx);
        console.log("dbSteps[idx] = " + dbSteps[idx]);
        console.log("dbRows[idx] = " + dbRows[idx]);
        console.log("deltaT = " + deltaT);
        console.log("nrRows = " + nrRows);
    }

    var timeSeries = [];
    for (var i = 0; i < nrRows; i++) {
        var tmpArray = new Array(nrDSs);
        for (var j = 0; j < nrDSs; j++) {
            tmpArray[j] = RRA.getElFast(i, j).toFixed(2);
        }
        timeSeries.push(tmpArray);
    }

    plot(timeSeries, dbSteps[idx], db.getLastUpdate());
}

function plot(data, steps, tStart) {
    console.log(Date());
    console.log("steps = " + steps);
    console.log("tStart = " + tStart);

    var temp = [];
    var hum = [];
    var pres = [];
    for (var i =0; i < data.length; i++) {
        temp.push(data[i][0]);
        hum.push(data[i][1]);
        pres.push(data[i][2]);
    }

    var options = {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'baozisense'
        },
        xAxis: [{
            type: 'datetime',
            minRange: tSpan * 3600000,
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} °C',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Humidity',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }

        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Pressure',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            labels: {
                format: '{value} mbar',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 55,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Humidity',
                type: 'line',
                yAxis: 1,
                pointInterval: steps * 1000,
                pointStart: tStart * 1000,
                data: hum,
                tooltip: {
                    valueSuffix: ' %'
                }

            }, {
                name: 'Pressure',
                type: 'line',
                yAxis: 2,
                pointInterval: steps * 1000,
                pointStart: tStart * 1000,
                data: pres,
                marker: {
                    enabled: false
                },
                dashStyle: 'shortdot',
                tooltip: {
                    valueSuffix: ' mbar'
                }

            }, {
                name: 'Temperature',
                type: 'line',
                pointInterval: steps * 1000,
                pointStart: tStart * 1000,
                data: temp,
                tooltip: {
                    valueSuffix: ' °C'
                }
            }]
    };

    var chart = new Highcharts.Chart(options);
}

