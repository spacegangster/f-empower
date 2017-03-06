f_empower = require '../f-empower'
fs        = require 'fs'
assert    = require 'assert'

newline = ->
  console.log ""

{ debounce
  throttle } = f_empower

print_json = (obj) ->
  console.log JSON.stringify(obj, null, 2)

equal      = assert.equal
equal_deep = assert.deepEqual

test_debounce = (next) ->
  console.log "testing debounce"
  # HELPER SECTION
  a = 0
  fn = ->
    ++a * 2
  # INIT 
  dfn = (debounce 90, fn)
  #
  (equal dfn(), undefined)
  setTimeout ->
    (equal dfn(), 2)
  , 100
  setTimeout ->
    (equal dfn(), 4)
    console.log "ok"
    newline()
    next && next()
  , 202

 
test_throttle = (next) ->
  console.log "testing throttle"
  # HELPER SECTION
  sum = (a, b) ->
    a + b
  # SETUP
  tsum = (throttle 100, sum)
  #
  (equal (tsum 1, 1), 2) # first call - function actually runs, so 2 is returned
  (equal (tsum 2, 2), 2) # second call - payload function call delayed and previous result is returned
  setTimeout ->
    (equal (tsum 3, 3), 2) # after 50 millis nothing should change, we should still get the result of the first call
  , 50
  setTimeout ->
    (equal (tsum 4, 4), 6) # after 102 millis we should get the results for the previous call (3 + 3)
  , 102
  setTimeout ->
    (equal (tsum 1, 1), 8) # after 210 millis we should get the results for the previous call (4 + 4)
  , 210
  setTimeout ->
    (equal (tsum 5, 5), 10) # after 430 millis we should get the results of the actual call (5 + 5)
    console.log "ok"
    newline()
    next && next()
  , 430


test_debounce ->
  test_throttle()
