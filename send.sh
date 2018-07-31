#!/bin/sh
stty -F $1 115200
sz --ymodem $2 > $1 < $1
