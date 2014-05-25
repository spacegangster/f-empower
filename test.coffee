functions = require './f-empower'
fs        = require 'fs'
assert    = require 'assert'
newline = ->
  console.log ""

{ clonedeep
  clonedeep2
  debounce
  each
  is_plain_object
  inc
  map
  merge
  push
  slice
  sumn
  throttle } = functions

print_json = (obj) ->
  console.log JSON.stringify(obj, null, 2)

equal      = assert.equal
equal_deep = assert.deepEqual

# Classes used in some tests
class Snake
  constructor: (@name = 'Pat') ->
class Python extends Snake
  constructor: (@length = 10) ->
    super()

test_clonefn = (cloningfn) ->
  # INIT
  list   = [ "no", "rest", "for", "the", "wicked"]
  python  = new Python()
  singer = { name: "Johny"
           , last: "Cash" }
  complex_src =
    { string : "foo"
    , answer : 42
    , python : python
    , list   : list
    , obj    : singer }
  #
  result = (cloningfn complex_src)
  (equal_deep complex_src, result)

  # class instance should not be cloned
  python.length = 20
  (equal result.python.length, 20)

  # object should have been cloned
  singer.name = "Mary"
  (equal result.obj.name, "Johny")
  
  # array must be cloned
  list[0] = "there will be"
  (equal result.list[0], "no")

test_clonedeep = ->
  console.log "testing clonedeep..."
  (test_clonefn clonedeep)
  console.log "ok"

test_clonedeep2 = ->
  console.log "testing clonedeep2..."
  (test_clonefn clonedeep2)
  console.log "ok"

test_each = ->
  console.log "testing each"
  results = null
  write_result = ->
    (push results, (slice arguments))
  #
  results = []
  (each write_result, [1, 2, 3])
  (equal_deep results, [[1], [2], [3]])
  console.log "each:arity 2 is ok"
  #
  results = []
  (each write_result, [1, 2], [1, 2, 3])
  (equal_deep results, [[1, 1], [2, 2]])
  results = []
  (each write_result, [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1], [2, 2], [3, 3]])
  console.log "each:arity 3 is ok"
  #
  results = []
  (each write_result, [1, 2], [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1, 1], [2, 2, 2]])
  results = []
  (each write_result, [1, 2, 3], [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1, 1], [2, 2, 2], [3, 3, 3]])
  console.log "each:arity n is ok"


test_map = ->
  console.log "testing map"
  #
  (equal (sumn 1, 2), 3)
  (equal (sumn 1, 2, 3, 4), 10)
  console.log "helper function is ok"
  #
  (equal_deep (map inc, [0, 1, 2]), [1, 2, 3])
  console.log "map:arity 2 is ok"
  #
  (equal_deep (map sumn, [1, 2], [1]), [2]) # result length should equals to the length of the shortest arr
  (equal_deep (map sumn, [1, 2], [1, 2]), [2, 4])
  console.log "map:arity 3 is ok"
  #
  (equal_deep (map sumn, [1, 2], [1, 2, 3], [1, 2, 3]), [3, 6])
  (equal_deep (map sumn, [1, 2, 3], [1, 2, 3], [1, 2, 3]), [3, 6, 9])
  console.log "map:arity n is ok"
  

test_merge = ->

  #1
  b = {
    foo: 'bar'
    editor: 'vim'
    city: 'Moscow'
  }
  b.loop = b
  result = (merge {}, b)
  (assert result.loop.loop.loop == result.loop)

  #2
  class Editor
    constructor: (@name) ->
  class Editor2
    constructor: (@name) ->

  a = {
    editor: 'vim'
    ctor_opts:
      { ctor: Editor }
    plugins:
      tabs: true
      coffeescript: true
      clojure: true
    array: [ "should", "also", "be", "merged" ]
  }
  b = {
    editor: 'emacs'
    ctor_opts:
      { ctor: Editor2 }
    plugins:
      tabs: false
      coffeescript: false
      javascript: true
    array: [ "don't" ]
  }
  result = (merge a, b)
  (assert.deepEqual result,
    { editor: 'emacs'
    , ctor_opts:
        { ctor: Editor2 }
    , plugins:
        { tabs: false
        , coffeescript: false
        , clojure: true
        , javascript: true }
    , array: [ "don't", "also", "be", "merged" ] } )


test_is_plain_object = ->
  sammy = new Python(4)
  
  (assert !(is_plain_object sammy))
  (assert (is_plain_object {editor: 'vim'}))

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



test_clonedeep()
newline()

test_clonedeep2()
newline()

test_each()
newline()

test_map()
newline()

test_merge()
newline()

test_is_plain_object()
newline()

test_debounce ->
  test_throttle()
