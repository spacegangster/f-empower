#!/usr/bin/env bash

babel f-empower.js --out-file f-empower.cjs.js
#./node_modules/.bin/webpack
#./node_modules/.bin/uglifyjs --compress --mangle -o f-empower.umd.min.js -- f-empower.umd.js

echo "All done"
exit 0
