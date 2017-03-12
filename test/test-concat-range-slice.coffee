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

{ assign, cat, slice, range, reverse } = f_empower

test_assign = ->
  testing 'assign'
  obj = {name: 'bar', foo: 'baz', key: 1, id: 2}
  (equal_deep (assign {}, {name: 'bar'}, {foo: 'baz'}, {key: 1, id: 2})
            , obj)
  log 'ok'

test_cat = ->
  testing 'cat (concat)'
  arr = [0, 1, 2, 3, 4]
  (equal_deep (cat [0], [1], [2, 3, 4])
            , arr)
  (equal_deep (() => cat(arguments, [3, 4]))(0, 1, 2)
            , arr)
  log 'ok'

test_slice = ->
  testing 'slice'
  arr = [0, 1, 2, 3, 4]
  (equal_deep (slice arr)
            , arr)
  (equal_deep (slice arr, 1, 5)
            , [1, 2, 3, 4])
  (equal_deep (slice arr, 0, 3)
            , [0, 1, 2])
  log 'ok'

test_range = ->
  testing 'range'
  (equal_deep (range 5)
            , [0, 1, 2, 3, 4])
  (equal_deep (range 1, 5)
            , [1, 2, 3, 4])
  (equal_deep (range 1, 5, 2)
            , [1, 3])
  testing 'range(4, -1, -1)'
  (equal_deep (range 4, -1, -1)
            , [4, 3, 2, 1, 0])
  log 'ok'

test_reverse = ->
  testing 'reverse'
  (equal_deep (reverse (range 4, -1, -1))
            , [0, 1, 2, 3, 4])
  (equal_deep (range 1, 5)
            , [1, 2, 3, 4])
  (equal_deep (range 1, 5, 2)
            , [1, 3])
  log 'ok'


tests =
  [ test_assign
    test_cat
    test_slice
    test_range
    test_reverse ]
for test in tests
  test()
  newline()
