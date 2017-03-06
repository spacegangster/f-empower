#!/usr/bin/env sh
npm install

./node_modules/.bin/uglifyjs f-empower.js f-empower.min.js
