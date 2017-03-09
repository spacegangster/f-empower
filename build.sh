#!/usr/bin/env bash

./node_modules/.bin/babel f-empower.js --out-file f-empower.umd.js

#./node_modules/.bin/uglifyjs --compress --mangle -o f-empower.umd.min.js -- f-empower.umd.js

echo "All done"
exit 0
