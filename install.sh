#!/bin/bash
PWD=`pwd`
PROG="/usr/bin/open-ww-door-lock"
touch $PROG
chmod 755 $PROG
echo "#!/bin/sh
/usr/local/bin/node $PWD/doorController-client-host.js open_door > /tmp/doorlock.log &" > $PROG

/bin/bash ./create-key-binding.sh