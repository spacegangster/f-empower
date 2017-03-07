f_empower = require '../f-empower.umd'
tooling   = require './tooling'

{ bind
  filter
  find
  find_index
  index_of
  is_function
  partial
  reject } = f_empower

{ equal
  equal_deep
  log
  newline
  print_json
  testing } = tooling


somefn = ->
  "la"

array_for_find = [
  'one'
  'two'
  somefn
  { editor: 'vim'  , year: '1991' }
  { editor: 'emacs', year: '1976' }
  { editor: 'naa'  , year: '1991' }
  { editor: 'emacs', has_lisp: true }
  somefn
  'two'
  'one'
]
array_without_fns = [
  'one'
  'two'
  { editor: 'vim'  , year: '1991' }
  { editor: 'emacs', year: '1976' }
  { editor: 'naa'  , year: '1991' }
  { editor: 'emacs', has_lisp: true }
  'two'
  'one'
]



test_filter = ->
  testing "filter"
  #
  testing "filter with function"
  (equal_deep [ somefn
              , somefn ]
            , (filter is_function, array_for_find) )
  log "ok"
  #
  testing "filter with object"
  (equal_deep [ {editor: 'vim', year: '1991'}
              , {editor: 'naa', year: '1991'} ]
            , (filter {year: '1991'}, array_for_find) )
  log "ok"
  #
  testing "filter with string key"
  (equal_deep [ {editor: 'emacs', has_lisp: true} ]
            , (filter 'has_lisp', array_for_find) )
  log "ok"


test_reject = ->
  testing "reject"
  #
  testing "reject with function"
  (equal_deep array_without_fns
            , (reject is_function, array_for_find) )
  log "ok"
  #
  testing "reject with object"
  (equal_deep [ ]
            , (reject {year: '1991'}
                    , [ {editor: 'vim', year: '1991'}
                      , {editor: 'naa', year: '1991'} ] ) )
  log "ok"
  #
  testing "reject with string key"
  (equal_deep [ {editor: 'vim', has_lisp: false} ]
            , (reject 'has_lisp'
                    , [ {editor: 'emacs', has_lisp: true}
                      , {editor: 'vim'  , has_lisp: false} ] ) )
  #
  log "ok"

test_index_of = ->
  testing "index_of"
  #
  (equal 5
       , (index_of 'disj', [ 'conj', 'cons', 'first', 'rest'
                           , 'if'  , 'disj', 'fred' , 'some' ] ) )
  #
  log "ok"

test_find_index = ->
  testing "find_index"
  #
  testing "find_index with function"
  (equal 2
       , (find_index is_function, array_for_find) )
  log "ok"
  #
  testing "find_index with object"
  (equal 3
       , (find_index {year: '1991'}
                   , array_for_find ) )
  log "ok"
  #
  testing "find_index with string key"
  (equal 6
       , (find_index 'has_lisp'
                   , array_for_find ) )
  #
  log "ok"


test_filter()
newline()

test_reject()
newline()

test_index_of()
newline()

test_find_index()
newline()
