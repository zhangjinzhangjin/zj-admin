@echo off
title ��������
netsh interface ipv4 set address "��̫��" static 128.127.10.63 255.255.255.0 128.127.10.1
netsh interface ipv4 del dnsservers "��̫��" 114.114.114.114 validate=no
netsh interface ipv4 del dnsservers "��̫��" 115.115.115.115 validate=no
exit