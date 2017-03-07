#!/usr/bin/env sh

./node_modules/.bin/webpack
./node_modules/.bin/uglifyjs --compress --mangle -o f-empower.min.js -- f-empower.js
./node_modules/.bin/uglifyjs --compress --mangle -o f-empower.umd..min.js -- f-empower.umd.js

#./node_modules/.bin/uglifyjs --compress --mangle -o bundle.min.js -- bundle.js

if [ "$(command -v gzip)" ]; then
    echo "Gzip found, doing it"
    gzip -k9f f-empower.min.js
fi

if [ "$(command -v bro)" ]; then
    echo "Brotli found, doing it"
    bro --input f-empower.min.js --output f-empower.min.js.bro --quality 11
fi

echo "All done"
exit 0
