@echo off
title ��������
netsh interface show interface
netsh interface ipv4 set address "��̫��" static 192.168.50.174 255.255.255.0 192.168.50.1
netsh interface ipv4 set dnsservers "��̫��" static 114.114.114.114 primary no
netsh interface ipv4 add dnsservers "��̫��" 115.115.115.115 index=2 validate=no
exit