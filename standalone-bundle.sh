#!env bash
set -e
CWD=$(pwd)

cd .next
pwd
rm -rf cache
# cp ../next.config.mjs ./standalone/next.config.mjs
cp -r ../public ./standalone/public

cd ./standalone
echo ';process.title = "Shiro (NextJS)"' >>server.js
mv ../static/ ./.next/static

cp $CWD/ecosystem.standalone.config.js ./ecosystem.config.js

cd ..

mkdir -p $CWD/assets
rm -rf $CWD/assets/release.zip
zip --symlinks -r $CWD/assets/release.zip ./*
