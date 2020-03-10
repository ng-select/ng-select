#!/bin/bash
echo build lib
npm run build

echo push to npm
cp README.md CHANGELOG.md ./dist/ng-select/
cd ./dist/ng-select/
npm publish --access=public
