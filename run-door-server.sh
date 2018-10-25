#!/bin/bash

NODEBIN="/usr/bin/node"
PROG="/home/pi/RPi-electronic-lock/doorController-server-rasp.js"
LOGS="/tmp/doorlock.log"

function run_doorlock_server() {
	while true; do
		$NODEBIN $PROG >> $LOGS 2>&1
		sleep 1
	done
}

run_doorlock_server