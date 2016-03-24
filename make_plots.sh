#!/bin/bash

# rrdtool graph temp_24h.png --start end-24h --end N DEF:x1=sensehat_data.rrd:temp:AVERAGE LINE2:x1#FF0000:x1 -u 24 -l 17 -r
# rrdtool graph temp_12h.png --start end-12h --end N DEF:x1=sensehat_data.rrd:temp:AVERAGE LINE2:x1#FF0000:x1 -u 24 -l 17 -r
# rrdtool graph hum_24h.png --start end-24h --end N DEF:x1=sensehat_data.rrd:hum:AVERAGE LINE2:x1#FF0000:x1 -u 53 -l 44 -r
# rrdtool graph hum_12h.png --start end-12h --end N DEF:x1=sensehat_data.rrd:hum:AVERAGE LINE2:x1#FF0000:x1 -u 53 -l 44 -r
# rrdtool graph sensehat_pres.png --start end-24h --end N DEF:x1=sensehat_data.rrd:pres:AVERAGE LINE2:x1#FF0000:x1 -l 1009 -u 1013 -r

./python_highcharts.py 1h ./plots
./python_highcharts.py 6h ./plots
./python_highcharts.py 12h ./plots
./python_highcharts.py 1d ./plots
./python_highcharts.py 2d ./plots
./python_highcharts.py 1w ./plots
./python_highcharts.py 1m ./plots
./python_highcharts.py 2m ./plots
./python_highcharts.py 6m ./plots
./python_highcharts.py 1y ./plots
