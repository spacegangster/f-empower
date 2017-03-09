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

{ a_each
  bind
  clonedeep
  clonedeep2
  each
  index_of
  is_plain_object
  is_function
  inc
  map
  merge
  partial
  push
  slice
  sort
  sumn } = f_empower

# Classes used in some tests
class Snake
  constructor: (@name = 'Pat') ->
class Python extends Snake
  constructor: (@length = 10) ->
    super()

class Tree
  constructor: (children) ->
    @float_id = Math.random()
    @parent   = null
    @children = []
    if children
      @set_children(children)

  set_children: (children) ->
    @children.length = 0
    for child in children
      @children.push(child)
      child.parent = this

# child1 = new Tree()
# child2 = new Tree()
# child3 = new Tree()
# complex_src2 = new Tree([
#   child1, child2, child3
# ])
# #
# #
# result = (fn.clonedeep2 complex_src2)


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
  child1 = new Tree()
  child2 = new Tree()
  child3 = new Tree()
  complex_src2 = new Tree([
    child1, child2, child3
  ])
  #
  #
  result = (cloningfn complex_src)
  for key, val of result
    if typeof val != 'object'
      (equal complex_src[key], val)
  # class instance should be cloned as plain object
  python.length = 20
  (equal result.python.length, 10)
  # object must be cloned
  singer.name = "Mary"
  (equal result.obj.name, "Johny")
  # array must be cloned
  list[0] = "there will be"
  (equal result.list[0], "no")
  #
  #
  result2 = (cloningfn complex_src2)
  (assert.ok result2.children.length == 3)
  (assert.ok result2.children[0].parent == result2)


test_clonedeep = ->
  console.log "testing clonedeep..."
  (test_clonefn clonedeep)
  console.log "ok"

test_clonedeep2 = ->
  console.log "testing clonedeep2..."
  (test_clonefn clonedeep2)
  console.log "ok"

test_each = ->
  testing "each"
  results = null
  write_result = ->
    (push results, (slice arguments))
  #
  results = []
  (each write_result, [1, 2, 3])
  (equal_deep results, [[1], [2], [3]])
  log "each:arity 2 is ok"
  #
  results = []
  (each write_result, [1, 2], [1, 2, 3])
  (equal_deep results, [[1, 1], [2, 2]])
  results = []
  (each write_result, [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1], [2, 2], [3, 3]])
  log "each:arity 3 is ok"
  #
  results = []
  (each write_result, [1, 2], [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1, 1], [2, 2, 2]])
  results = []
  (each write_result, [1, 2, 3], [1, 2, 3], [1, 2, 3])
  (equal_deep results, [[1, 1, 1], [2, 2, 2], [3, 3, 3]])
  log "each:arity n is ok"


test_map = ->
  testing "map"
  #
  (equal (sumn 1, 2), 3)
  (equal (sumn 1, 2, 3, 4), 10)
  log "helper function is ok"
  #
  (equal_deep (map inc, [0, 1, 2]), [1, 2, 3])
  log "map:arity 2 is ok"
  #
  (equal_deep (map sumn, [1, 2], [1]), [2]) # result length should equals to the length of the shortest arr
  (equal_deep (map sumn, [1, 2], [1, 2]), [2, 4])
  log "map:arity 3 is ok"
  #
  (equal_deep (map sumn, [1, 2], [1, 2, 3], [1, 2, 3]), [3, 6])
  (equal_deep (map sumn, [1, 2, 3], [1, 2, 3], [1, 2, 3]), [3, 6, 9])
  log "map:arity n is ok"
  

test_merge = ->
  testing "merge"
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
  log "ok"


test_is_plain_object = ->
  testing "is_plain_object"
  #
  sammy = new Python(4)
  
  (assert !(is_plain_object sammy))
  (assert (is_plain_object {editor: 'vim'}))
  #
  log "ok"

test_sort = ->
  testing "sort"
  george = {name: 'George', age: 35}
  chuck  = {name: 'Chuck', age: 80}
  ivan   = {name: 'Ivan', age: 20}
  unsorted = [ george, chuck, ivan ]
  sorted   = [ ivan, george, chuck ]
  sorted_by_name = [ chuck, george, ivan ]
  (equal_deep (sort 'age', unsorted)
            , sorted)
  (equal_deep (sort 'name', unsorted)
            , sorted_by_name)
  log "ok"


tests =
  [ test_clonedeep
  , test_clonedeep2
  , test_map
  , test_each
  , test_merge
  , test_is_plain_object
  , test_sort ]
for test in tests
  test()
  newline()
