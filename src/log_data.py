#!/usr/bin/python3

from sense_hat import SenseHat

sense = SenseHat()

sense.get_temperature()
sense.get_humidity()
sense.get_pressure()
