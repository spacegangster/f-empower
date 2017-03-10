f_empower = require '../f-empower.umd'
fs        = require 'fs'
assert    = require 'assert'
tooling   = require './tooling'

{ equal
  equal_deep
  log
  newline
  print_json
  testing } = tooling

{ range } = f_empower

test_range = ->
  testing "range"
  (equal_deep (range 5)
            , [0, 1, 2, 3, 4])
  (equal_deep (range 1, 5)
            , [1, 2, 3, 4])
  (equal_deep (range 1, 5, 2)
            , [1, 3])
  log "ok"


tests =
  [ test_range ]
for test in tests
  test()
  newline()
