#!/bin/bash
bash -v build.sh
browserify build/index.js --debug -o public/index.js
rm -rf ~/Devs/run/app/droprun
mkdir ~/Devs/run/app/droprun
cd public
cp -r * ~/Devs/run/app/droprun
cd ..
