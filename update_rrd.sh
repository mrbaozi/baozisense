#!/bin/bash

ssh root@planetbaozi.ddns.net 'rrdtool dump sensehat_data.rrd > sensehat_data.xml'
scp root@planetbaozi.ddns.net:/root/sensehat_data.xml /Users/yannick/Desktop/baozisense
rrdtool restore /Users/yannick/Desktop/baozisense/sensehat_data.xml /Users/yannick/Desktop/baozisense/sensehat_data.rrd -f
