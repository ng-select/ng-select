#!/bin/bash
git pull

# echo update changelog
# cd ./src/ng-select/
# node ../../node_modules/standard-version/bin/cli.js --infile ../../CHANGELOG.md
# cd ../..

echo build lib
npm run build

# echo push tags
# git push --follow-tags origin master

echo push to npm
cp README.md ./dist/ng-select/
cd ./dist/ng-select/
npm publish --access=public
