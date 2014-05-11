functions = require './f-empower'
fs        = require 'fs'
assert    = require 'assert'

{ clonedeep2
  is_plain_object
  merge } = functions

print_json = (obj) ->
  console.log JSON.stringify(obj, null, 2)

test_clonedeep2 = ->
  tree = JSON.parse( fs.readFileSync('tree.json', 'utf-8') )
  cloned = (clonedeep2 tree)
  (print_json cloned)

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
  class Python
    constructor: (@length) ->
  sammy = new Python(4)
  
  (assert !(is_plain_object sammy))
  (assert (is_plain_object {editor: 'vim'}))


test_merge()
test_is_plain_object()

#test_clonedeep2()
