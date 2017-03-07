f_empower = require '../f-empower.cjs'
tooling   = require './tooling'

{ log
  testing
  equal
  equal_deep
  newline } = tooling


{ invoke
  pluck } = f_empower


test_invoke = ->
  testing "invoke"

  class Python
    constructor: ->
      @x = 0
    move: (x = 5) ->
      @x += x

  pythons = [ new Python()
            , new Python()
            , new Python() ]
  #
  testing "invoke without args"
  (equal_deep [5, 5, 5]
            , (invoke 'move', pythons) )
  log "ok"
  #
  testing "invoke with args"
  (equal_deep [55, 55, 55]
            , (invoke 'move', 50, pythons) )
  log "ok"

test_pluck = ->
  testing "pluck"
  coll =
    [ {name: 'vim'}, {name: 'emacs'}
      {name: 'notepad'}, {name: 'evernote'} ]
  (equal_deep ['vim', 'emacs', 'notepad', 'evernote']
            , (pluck 'name', coll) )
  log "ok"


test_invoke()
newline()

test_pluck()
newline()
