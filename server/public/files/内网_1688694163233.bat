@echo off
title 设置内网
netsh interface ipv4 set address "以太网" static 128.127.10.63 255.255.255.0 128.127.10.1
netsh interface ipv4 del dnsservers "以太网" 114.114.114.114 validate=no
netsh interface ipv4 del dnsservers "以太网" 115.115.115.115 validate=no
exit