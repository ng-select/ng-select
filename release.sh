#!/bin/bash
git pull

echo Update changelog
cd ./src/ng-select/
node ../../node_modules/standard-version/bin/cli.js --infile ../../CHANGELOG.md
cd ../..

echo Build lib
npm run build

echo Copy styles
mkdir -p dist/ng-select/scss
cp src/ng-select/**/*.scss dist/ng-select/scss

echo Copy documentation
cp README.md CHANGELOG.md ./dist/ng-select/

echo Publish to npm
cd ./dist/ng-select/
npm publish
