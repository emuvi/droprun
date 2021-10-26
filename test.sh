bash -v build.sh
browserify src/index.js --debug -o public/index.js
rm -rf ../qinpel-dsk/run/app/droprun
mkdir ../qinpel-dsk/run/app/droprun
cd public
cp -r * ../../qinpel-dsk/run/app/droprun/
cd ..