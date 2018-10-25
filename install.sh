#!/bin/bash
if [ "$EUID" -ne 0 ];then
    echo "Please run as root"
    exit
fi

bold=$(tput bold)
red=`tput setaf 1`
green=`tput setaf 2`
normal=$(tput sgr0)
output () {
    echo "${green}"$1"${normal}"
}
error () {
    echo "${red}"$1"${normal}"
}
if command -v node &>/dev/null; then
    output "Found node.."
    node --version
else
	error "You don't have NODE on your machine. Are you in 18th century! Install NODE, you **** Bye..."
	exit
fi

PWD=`pwd`
PROG="/usr/bin/open-ww-door-lock"
touch $PROG
chmod 755 $PROG
NODE_BIN="/usr/bin/node"
if [ ! -e $NODE_BIN ]; then
	NODE_BIN=/usr/local/bin/node
fi
echo "#!/bin/sh
$NODE_BIN $PWD/doorController-client-host.js open_door > /tmp/doorlock.log &" > $PROG
output "Door controller client successfully installed!"
npm install
output "Creating custom key binding..."
/bin/bash ./create-key-binding.sh
if [ $? -ne 0 ]; then
	error "Failed to bind the key. Please correct the error and try again!"
else
	output "Fire away. Open door with <Shift><Ctrl><Alt>W"
fi