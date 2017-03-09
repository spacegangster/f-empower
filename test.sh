#!/usr/bin/env bash

./build.sh

./node_modules/.bin/coffee test/suite.coffee
