#!/usr/bin/python3

from time import sleep
import rrdtool
from sense_hat import SenseHat


# Initialize db

db = "sensehat_data.rrd"
steps = 60

try:
    with open(db):
        pass
    print("Using db: %s" %(db))
except IOError:
    print("No db found, creating %s ..." %(db))
    rrdtool.create(
        "%s" %(db),
        "--step", "%s" %(steps),
        "--start", 'N',
        "DS:temp:GAUGE:120:U:U",
        "DS:hum:GAUGE:120:U:U",
        "DS:pres:GAUGE:120:U:U",
        "RRA:AVERAGE:0.5:1:1440",    # daily
        "RRA:AVERAGE:0.5:7:1440",    # weekly
        "RRA:AVERAGE:0.5:30:1440",   # monthly
        "RRA:AVERAGE:0.5:365:1440")  # yearly


# Acquire data

sense = SenseHat()

temp = sense.get_temperature()
while not temp:
    temp = sense.get_temperature()
    sleep(0.1)

hum = sense.get_humidity()
while not hum:
    hum = sense.get_humidity()
    sleep(0.1)

pres = sense.get_pressure()
while not pres:
    pres = sense.get_pressure()
    sleep(0.1)


# Write to db

rrdtool.update("%s" %(db), "N:%s:%s:%s" %(temp, hum, pres))
