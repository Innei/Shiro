#!env bash
set -e
CWD=$(pwd)
npm run build
cd .next
pwd
rm -rf cache
cp ../next.config.mjs ./standalone/next.config.mjs
cp -r ../public ./standalone/public

cd ./standalone
echo ';process.title = "Shiro (NextJS)"' >>server.js
mv ../static/ ./.next/static

# move workbox
# cp ../sw.js ./public/sw.js
# cp ../workbox-*.js ./public

cp $CWD/ecosystem.config.js ./ecosystem.config.js

cd ..

zip --symlinks -r $CWD/release.zip ./*
