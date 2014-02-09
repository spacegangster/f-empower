###
  F-EMPOWER
  A set of functions to harness the power and benefits of functional
  programming in JS.
  Author: Ivan Fedorov <sharp.maestro@gmail.com>
  License: MIT
###
wrapper = ->

  Errors =
    NOT_FUNCTION : new TypeError('Something is not function')
  
  native_slice = Array::slice

  slice = (array_or_arguments, start_idx, end_idx) ->
    native_slice.call(array_or_arguments, start_idx, end_idx)

  bind = (fn, this_arg) -> # TODO make dumb
    other_args = (slice arguments, 2)
    arguments.length <= 2 &&
      (-> fn.apply(this_arg, arguments)) ||
      (-> fn.apply(this_arg, other_args.concat((slice arguments))))

  partial = ->
    fn = arguments[0]
    args = (slice arguments, 1)
    ->
      fn.apply(null, args.concat((slice arguments)))

  
  # ============================================================
  # CATEGORY: FUNCTIONAL
  # ============================================================

  # Calls a function with specified args list
  apply = (fn, args_list) ->
    fn.apply(null, args_list)

  # Composes a list of functions into one
  compose = ->
    functions = arguments
    # PRAGMA DEV
    for item in functions
      if (not_function item)
        throw Errors.NOT_FUNCTION
    # /PRAGMA DEV
    ->
      memo = arguments
      i = functions.length
      while --i >= 0
        memo = [ functions[i].apply(null, memo) ]
      (first memo)
  
  complement = (predicate) ->
    ->
      !(apply predicate, arguments)

  flow = ->
    functions = arguments
    # PRAGMA DEV
    for item in functions
      if (not_function item)
        throw Errors.NOT_FUNCTION
    # /PRAGMA DEV
    ->
      memo = arguments
      len = functions.length
      i = -1
      while ++i < len
        memo = [ functions[i].apply(null, memo) ]
      (first memo)

  # ============================================================
  # CATEGORY: PREDICATES
  # ============================================================

  is_empty = (list) ->
    list.length == 0

  is_function = (candidate) ->
    'function' == typeof candidate

  not_empty = (complement is_empty)

  not_function = (complement is_function)

  # ============================================================
  # CATEGORY: ARRAYS
  # ============================================================

  butlast = (array) ->
    (slice array, 0, array.length - 1)
  
  cat = (array) ->
    array.concat.apply(array, (slice arguments, 1))

  contains = (searched_item, array) ->
    for item in array
      if searched_item == item
        return true
    false

  a_contains = (array, searched_item) ->
    for item in array
      if searched_item == item
        return true
    false
    
  count = (array) ->
    array.length

  each = (fn, array) ->
    for item in array
      (fn item)
    return

  first = (array) ->
    array[0]

  last = (list) -> list[list.length - 1]

  # Produces list from arguments and then applies compact
  # function (which removes all falsies)
  list_compact = ->
    result = []
    for arg in arguments
      if !!arg
        result.push(arg)
    result

  map = (fn, array) ->
    for item in array
      (fn item)

  remap = (fn, array) ->
    for item, item_idx in array
      array[item_idx] = (fn item)
    array

  second = (array) ->
    array[1]

  # ============================================================
  # CATEGORY: COLLECTIONS
  # ============================================================


  invoke = (method_name, collection) ->
    for item in collection
      item[method_name]()

  varynum = (numbers, start_with_one) ->
    variator = start_with_one && -1 || 1
    for number in numbers
      variator *= -1
      number * variator

  # ============================================================
  # CATEGORY: OBJECTS
  # ============================================================

  
  keys = ->
    Object.keys.apply(Object, arguments)


  # ============================================================
  # CATEGORY: STRINGS
  # ============================================================
  
  match = (source_str, regexp) ->
    source_str.match(regexp)

  # Joins incoming strings with a whitespace
  str = ->
    Array::join.call(arguments, ' ')

  str_breplace = (map, str) ->
    regex = (mk_regexp (str_join '|', (keys map)), 'ig')

    str.replace regex, (seq) ->
      map[seq] || seq

  str_join = (join_string, array_to_join) ->
    array_to_join.join(join_string)


  # ============================================================
  # CATEGORY: MISCELLANEOUS
  # ============================================================

  jquery_wrap_to_array = (jquery_wrap) ->
    wrap_len = jquery_wrap.length
    i = -1
    while ++i < wrap_len
      jquery_wrap.eq(i)
  
  mk_regexp = (rx_str, rx_settings) ->
    rx_settings = rx_settings || ""
    new RegExp(rx_str, rx_settings)

  read = (prop_name, hash) ->
    hash[prop_name]
  
  ###
  This is a function that iterates with another function 
  over the nodes of a tree structure.
  @param func {function} function that operates on the node.
    signature: son, parent, son_idx, depth
  @param root {hash} a tree whose children lie in the sons
    list (i.e. ordered collection).
  @param depth: indicates depth of recursion
  ###
  recurse = (func, root, depth = 0) ->
    sons = root.sons
    for son, idx in sons
      (func son, root, idx, depth + 1)
    for son in sons
      (recurse func, son, depth + 1)
    root

  { a_contains
  , apply
  , bind
  , butlast
  , cat
  , compose
  , complement
  , contains
  , count
  , each
  , fastbind: bind
  , flow
  , first
  , invoke
  , is_empty
  , is_function
  , jquery_wrap_to_array
  , keys
  , last
  , list_compact
  , map
  , match
  , mk_regexp
  , not_empty
  , not_function
  , partial
  , read
  , recurse
  , remap
  , second
  , slice
  , str
  , str_breplace
  , str_join
  , varynum }

# AMD loader support
if (('undefined' != typeof define) && define.amd)
  (define wrapper)
# CommonJS support
else if (('undefined' != typeof module) && module.exports)
  module.exports = wrapper()
