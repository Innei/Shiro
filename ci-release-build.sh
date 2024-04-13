#!env bash
set -e
CWD=$(pwd)

npm run build
cd .next
pwd
rm -rf cache
cp -r ../public ./standalone/public

cd ./standalone
echo ';process.title = "Shiro (NextJS)"' >>server.js
mv ../static/ ./.next/static

cp $CWD/ecosystem.standalone.config.cjs ./ecosystem.config.js
cp $CWD/.env.template .env

cd ..

mkdir -p $CWD/assets
rm -rf $CWD/assets/release.zip
zip --symlinks -r $CWD/assets/release.zip ./*
