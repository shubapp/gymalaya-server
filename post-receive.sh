#!/bin/sh
forever stop gymalaya
GIT_WORK_TREE=/home/ec2-user/gymalaya-server
export GIT_WORK_TREE
git checkout -f
cd /home/ec2-user/gymalaya-server
npm install --production
forever start -a -o /home/ec2-user/logs/gymalayaout.log -e /home/ec2-user/logs/gymalayaerr.log -l /home/ec2-user/logs/gymalaya.log --uid "gymalaya" --sourceDir "/home/ec2-user/gymalaya-server" server/server.js