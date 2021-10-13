browserify src/index.js --debug -o public/index.js
browserify src/login.js --debug -o public/login.js
browserify src/menu.js --debug -o public/menu.js
rm -rf ../qinpel-dsk/run/app/droprun
mkdir ../qinpel-dsk/run/app/droprun
cd public
cp -r * ../../qinpel-dsk/run/app/droprun/
cd ..