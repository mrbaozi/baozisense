#!/usr/bin/python3

from sys import argv
from time import localtime
import rrdtool
from highcharts import Highchart

timespan = str(argv[1]) if len(argv) > 1 else "1d"

ranges = {"1h": 1,"6h": 6, "12h": 12, "1d": 24, "2d": 48, "1w": 168, "1m": 720, "2m": 1440, "6m": 4320, "1y": 8760}
resolutions = {"1h": 60,"6h": 60, "12h": 60, "1d": 60, "2d": 420, "1w": 420, "1m": 1800, "2m": 21900, "6m": 21900, "1y": 21900}
names = {"1h": "1 hour","6h": "6 hours", "12h": "12 hours", "1d": "1 day", "2d": "2 days", "1w": "1 week", "1m": "1 month", "2m": "2 months", "6m": "6 months", "1y": "1 year"}

step = resolutions[timespan]
span = ranges[timespan]
name = names[timespan]

dst = 7200 if localtime()[-1] else 3600

data = rrdtool.fetch('/var/www/html/baozisense_dev/sensehat_data.rrd',
                     "AVERAGE",
                     "--resolution",
                     "%s" %(step),
                     "--start",
                     "-%sh" %(span))

temp, hum, pres = [], [], []
temp_val, hum_val, pres_val = 0, 0, 0
for x in data[2]:
    temp_val = round(float(x[0] or temp_val), 2)
    hum_val = round(float(x[1] or hum_val), 2)
    pres_val = round(float(x[2] or pres_val), 2)
    temp.append(temp_val)
    hum.append(hum_val)
    pres.append(pres_val)

chart = Highchart(width=850, height=400)

options = {
        'chart': {
            'zoomType': 'xy'
            },
        'title': {
            'text': 'baozisense - past ' + name
            },
        'xAxis': [{
            'type': 'datetime',
            'minRange': span * 3600000,
            'crosshair': True
            }],
        'yAxis': [{
            'labels': {
                'format': '{value} °C',
                'style': {
                    'color': 'Highcharts.getOptions().colors[1]'
                    }
                },
            'title': {
                'text': 'Temperature',
                'style': {
                    'color': 'Highcharts.getOptions().colors[1]'
                    }
                },
            'opposite': False
            }, {
                'gridLineWidth': 0,
                'title': {
                    'text': 'Humidity',
                    'style': {
                        'color': 'Highcharts.getOptions().colors[0]'
                        }
                    },
                'labels': {
                    'format': '{value} %',
                    'style': {
                        'color': 'Highcharts.getOptions().colors[0]'
                        }
                    },
                'opposite': True
                }, {
                'gridLineWidth': 0,
                'title': {
                    'text': 'Pressure',
                    'style': {
                        'color': 'Highcharts.getOptions().colors[2]'
                        }
                    },
                'labels': {
                    'format': '{value} mbar',
                    'style': {
                        'color': 'Highcharts.getOptions().colors[2]'
                        }
                    },
                'opposite': True
                }],
                'tooltip': {
                        'shared': True,
                        },
                'legend': {
                        'layout': 'horizontal',
                        'align': 'center',
                        'x': 0,
                        'verticalAlign': 'top',
                        'y': 40,
                        'floating': False,
                        'backgroundColor': "(Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'"
                        },
                }

chart.set_dict_options(options)

chart.add_data_set(hum,
        'line',
        'Humidity',
        yAxis=1,
        pointInterval=step * 1000,
        pointStart=(int(data[0][0]) + dst) * 1000,
        tooltip={'valueSuffix': ' %'})
chart.add_data_set(temp,
        'line',
        'Temperature',
        yAxis=0,
        pointInterval=step * 1000,
        pointStart=(int(data[0][0]) + dst) * 1000,
        tooltip={'valueSuffix': ' °C'})
chart.add_data_set(pres,
        'line',
        'Pressure',
        yAxis=2,
        pointInterval=step * 1000,
        pointStart=(int(data[0][0]) + dst) * 1000,
        tooltip={'valueSuffix': ' mbar'})

chart.save_file(argv[2] + "/plot_" + timespan)
