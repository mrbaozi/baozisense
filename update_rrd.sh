#!/bin/bash

ssh root@planetbaozi.ddns.net 'rrdtool dump sensehat_data.rrd > sensehat_data.xml'
# scp root@planetbaozi.ddns.net:/root/sensehat_data.xml /home/yannick/baozisense_dev
# rrdtool restore /home/yannick/baozisense_dev/sensehat_data.xml /home/yannick/baozisense_dev/sensehat_data.rrd -f
scp root@planetbaozi.ddns.net:/root/sensehat_data.xml /Users/yannick/Desktop/baozisense_dev
rrdtool restore /Users/yannick/Desktop/baozisense_dev/sensehat_data.xml /Users/yannick/Desktop/baozisense_dev/sensehat_data.rrd -f
