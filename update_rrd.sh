#!/bin/bash

ssh root@planetbaozi.ddns.net 'rrdtool dump sensehat_data.rrd > sensehat_data.xml'
scp root@planetbaozi.ddns.net:/root/sensehat_data.xml /var/www/html/baozisense_dev
rrdtool restore /var/www/html/baozisense_dev/sensehat_data.xml /var/www/html/baozisense_dev/sensehat_data.rrd -f
