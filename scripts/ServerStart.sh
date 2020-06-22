#!/bin/sh
echo "starting ./minecraft/$1/server.jar"
chmod +x ../minecraft/$1/ServerStart.sh
cd ./minecraft/$1/ 
./ServerStart.sh 2048 4096
