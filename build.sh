#!/usr/bin/env sh
npm install

./node_modules/.bin/uglifyjs --compress --mangle -o f-empower.min.js -- f-empower.js
