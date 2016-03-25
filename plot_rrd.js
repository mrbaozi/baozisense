$(document).ready(function() {
    fname = "sensehat_data.rrd";
    tSpan = document.getElementById("range").value;
    make_plot(fname);
});

$("#range").change(function() {
    tSpan = document.getElementById("range").value;
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
        getTimeSeries(rrd_data, tSpan, false);
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

    var temp = [];
    var hum = [];
    var pres = [];
    var temp_val = 0;
    var hum_val = 0;
    var pres_val = 0;
    for (var i = dbRows[idx] - nrRows; i < dbRows[idx]; i++) {
        temp_val = RRA.getElFast(i, 0) == undefined ? temp_val : RRA.getElFast(i, 0);
        hum_val = RRA.getElFast(i, 1) == undefined ? temp_val : RRA.getElFast(i, 1);
        pres_val = RRA.getElFast(i, 2) == undefined ? temp_val : RRA.getElFast(i, 2);
        temp.push(parseFloat(temp_val.toFixed(2)));
        hum.push(parseFloat(hum_val.toFixed(2)));
        pres.push(parseFloat(pres_val.toFixed(2)));
    }

    plot([temp, hum, pres], dbSteps[idx], db.getLastUpdate() - deltaT);
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

function plot(data, steps, tEnd) {
    var today = new Date();
    dst = today.dst() ? 7200 : 3600;
    var temp = data[0];
    var hum = data[1];
    var pres = data[2];

    var options = {
        chart: {
            renderTo: 'container',
            zoomType: 'xy'
        },
        title: {
            text: 'baozisense - ' + tSpan + ' hours'
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
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: false

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
            },
            opposite: true

        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Pressure',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            labels: {
                format: '{value} mbar',
                style: {
                    color: Highcharts.getOptions().colors[2]
                }
            },
            opposite: true
        }],
            tooltip: {
                shared: true
            },
            credits: {
                enabled: false
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                x: 0,
                verticalAlign: 'top',
                y: 30,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            series: [{
                name: 'Humidity',
                type: 'line',
                yAxis: 1,
                pointInterval: steps * 1000,
                pointStart: (tEnd + dst) * 1000,
                data: hum,
                tooltip: {
                    valueSuffix: ' %'
                }

            }, {
                name: 'Temperature',
                type: 'line',
                yAxis: 0,
                pointInterval: steps * 1000,
                pointStart: (tEnd + dst) * 1000,
                data: temp,
                tooltip: {
                    valueSuffix: ' °C'
                }

            }, {
                name: 'Pressure',
                type: 'line',
                yAxis: 2,
                pointInterval: steps * 1000,
                pointStart: (tEnd + dst) * 1000,
                data: pres,
                tooltip: {
                    valueSuffix: ' mbar'
                }
            }]
    };

    var chart = new Highcharts.Chart(options);
}
