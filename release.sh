#!/bin/bash
git pull
yarn run version
yarn run build

read -p "Check changelog and press enter to push tags" tags
git push --follow-tags origin master

read -p "One more thing. Press enter to release to npm" npm
cd ./dist
npm publish --access=public