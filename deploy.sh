#!/bin/bash
npm run build-demo
git checkout gh-pages
cp ./dist/css/* css
cp ./dist/js/* js
cp ./dist/index.html index.html