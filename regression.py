#!/usr/local/bin/python3

from sys import argv
from time import localtime
import rrdtool
import numpy as np
import matplotlib.pyplot as plt

data = rrdtool.fetch('/Users/yannick/Desktop/baozisense/sensehat_data.rrd',
                     "AVERAGE",
                     "--resolution",
                     "60",
                     "--start",
                     "-48h",
                     "--end",
                     "-24h",
                     "-a")

temp, hum, pres = [], [], []
temp_val, hum_val, pres_val = 0, 0, 0
for x in data[2]:
    temp_val = round(float(x[0] or temp_val), 2)
    hum_val = round(float(x[1] or hum_val), 2)
    pres_val = round(float(x[2] or pres_val), 2)
    temp.append(temp_val)
    hum.append(hum_val)
    pres.append(pres_val)

# x = np.array([i for i in range(len(temp))])
# y = np.array(temp)
# z = np.poly1d(np.polyfit(x, y, 30))

# xp = np.linspace(0, 1140, 2000)
# _ = plt.plot(x, y, '--', xp, z(xp), '-')
# plt.show()

fft = np.fft.fft(temp)

# print(fft)
print(type(fft))
print("FFT len: %s" %(len(fft))
print("DAT len: %s" %(len(temp))
