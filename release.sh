#!/bin/bash
git pull
cd ./src
node ../node_modules/standard-version/bin/cli.js --infile ../CHANGELOG.md
cd ..
yarn run build

read -p "Check changelog and press enter to push tags" tags
git push --follow-tags origin master

read -p "One more thing. Press enter to release to npm" npm
cp README.md ./dist
cd ./dist
yarn publish --access=public
