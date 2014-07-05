f_empower = require '../cs-cj/f-empower'
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
  dfn = (debounce 100, fn)
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
  (equal (tsum 1, 1), 2)
  (equal (tsum 2, 2), 2) # probably the worst sum function in the world, lol
  setTimeout ->
    (equal (tsum 3, 3), 2)
  , 50
  setTimeout ->
    (equal (tsum 4, 4), 6)
  , 100
  setTimeout ->
    (equal (tsum 1, 1), 8)
    console.log "ok"
    newline()
    next && next()
  , 202


test_debounce ->
  test_throttle()
