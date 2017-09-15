#!/bin/bash
git pull
cp ./dist/css/* css
cp ./dist/js/* js
cp ./dist/index.html index.html
git add .
git commit -m "Update demo"
git push origin gh-pages