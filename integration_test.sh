#!/bin/bash
yarn clean
yarn build
mkdir integration/node_modules/@ng-select
mkdir integration/node_modules/@ng-select/ng-select
cp -R dist/* integration/node_modules/@ng-select/ng-select
cd integration
yarn build
yarn e2e
