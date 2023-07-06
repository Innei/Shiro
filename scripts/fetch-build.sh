#!/bin/bash

# constants
owner='innei'
repo='shiro'
tmpName=$(openssl rand -hex 5) # Create a random tmp name

cd $HOME/mx/kami

# get latest release data from Github
downloadUrl=$(curl --silent "https://api.github.com/repos/$owner/$repo/releases/latest" |
  jq -r '.assets[] | select(.name == "release-ubuntu.zip" or .name == "release.zip") | .browser_download_url')

if [ -z "$downloadUrl" ]; then
  echo "No download url"
  exit 1
fi

# download the file
curl -L "https://ghproxy.com/$downloadUrl" --output "/tmp/$tmpName.zip"

# execute some file operations
git pull
rm -rf ./.next
rm -rf ./dist
unzip "/tmp/$tmpName.zip" -d ./dist
rm "/tmp/$tmpName.zip"

cd dist/standalone && pm2 reload ecosystem.config.js --update-env

# wait 15 seconds
echo "等待 15 秒"
sleep 15

# check if server is running
if ! lsof -i:2323 -P -n | grep LISTEN >/dev/null; then
  pm2 stop ecosystem.config.js
  echo "server is not running"
  exit 1
fi
