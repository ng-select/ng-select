#!/bin/bash
BASE_DIR=./integration/node_modules
yarn clean
yarn build
mkdir -p $BASE_DIR
mkdir -p ${BASE_DIR}/@ng-select
mkdir -p ${BASE_DIR}/@ng-select/ng-select
cp -R ./dist/* ${BASE_DIR}/@ng-select/ng-select
cd ./integration
yarn install
yarn build
yarn e2e
yarn e2e:server
