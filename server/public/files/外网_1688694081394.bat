@echo off
title 设置外网
netsh interface show interface
netsh interface ipv4 set address "以太网" static 192.168.50.174 255.255.255.0 192.168.50.1
netsh interface ipv4 set dnsservers "以太网" static 114.114.114.114 primary no
netsh interface ipv4 add dnsservers "以太网" 115.115.115.115 index=2 validate=no
exit