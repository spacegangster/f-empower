###
  F-EMPOWER
  A set of functions to harness the power functional programming in JS.
  Author: Ivan Fedorov <sharp.maestro@gmail.com>
  License: MIT
###
wrapper = ->

  Errors =
    NO_KEY_VALUE_PAIR_IN_HASH : new Error('No key value pair in a criterion hash')
    NOT_FUNCTION              : new TypeError('Something is not function')
    UNEXPECTED_TYPE           : new TypeError('Unexpected type')
  
  to_string = Object::toString
  native_concat = Array::concat
  native_slice  = Array::slice

  slice = (array_or_arguments, start_idx, end_idx) ->
    native_slice.call(array_or_arguments, start_idx, end_idx)

  bind = (fn, this_arg) -> # TODO make dumb
    other_args = (slice arguments, 2)
    (count arguments) <= 2 &&
      (-> fn.apply(this_arg, arguments)) ||
      # deprecated
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
    fn.apply(this, args_list)

  and2 = (a, b) ->
    a && b

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

  debounce = (debounce_timeout, fn) ->
    last_result = undefined
    last_args   = null
    last_timeout_id = null
    #
    exec = ->
      last_result = (apply fn, last_args)
    #
    ->
      last_args = (slice arguments)
      #
      (clearTimeout last_timeout_id)
      last_timeout_id = (delay debounce_timeout, exec)
      #
      last_result

  delay = (delay_ms, fn) ->
    (setTimeout fn, delay_ms)

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

  # @param {var_args} fns variable number of functions
  multicall = (fns) ->
    fns = (compact fns)
    ->
      for fn in fns
        fn.apply(this, arguments)
      return

  no_operation = ->

  partialr = (fn, right_args) ->
    right_args = (slice arguments, 1)
    ->
      (apply fn, (cat (apply list, arguments), right_args))

  # Executes fn once in the given period
  # BEWARE: if fn should be executed with context, you should bind it before throttling
  throttle = (throttle_millis, fn) ->
    locked      = false
    should_call = false
    #
    last_args   = null
    last_result = null
    #
    ->
      last_args = (slice arguments)
      if locked
        should_call = true
        last_result
      else
        locked = true
        last_result = fn.apply(null, last_args)
        void_main = ->
          delay throttle_millis, ->
            if should_call
              last_result = fn.apply(null, last_args)
              should_call = false
              void_main()
            else
              locked = false
        void_main()
        #
        last_result


  # ============================================================
  # CATEGORY: PREDICATES
  # ============================================================

  is_array = Array.isArray

  is_atom = (val) ->
    !((is_array val) || (is_object val))

  is_defined = (subj) ->
    'undefined' != (typeof subj)

  is_empty = (seq) ->
    seq.length == 0

  is_function = (candidate) ->
    'function' == typeof candidate

  is_number = (candidate) ->
    'number' == typeof candidate

  # TODO check usages on conflict with old typeof predicate
  # FIXME complete merge function and clonedeep
  is_object = (candidate) ->
    'object' == typeof candidate

  is_plain_object = (subj) ->
    is_defnd = 'undefined' != typeof subj
    is_objct = is_defnd && ('[object Object]' == to_string.call(subj)) && !(is_function subj)
    if (!is_objct ||
         (!hasOwnProperty.call(subj, 'constructor') &&
         ((ctor = subj.constructor) && (is_function ctor) && !(ctor instanceof ctor))))
      return false
    #
    latest_key = null
    for key, val of subj
      latest_key = key
    #
    (not_defined key) || hasOwnProperty.call(subj, latest_key)

  is_mergeable = (item) ->
    (is_array item) || (is_plain_object item)

  is_zero = (candidate) ->
    candidate == 0


  not_array = (complement is_array)

  not_defined = (complement is_defined)

  not_empty = (complement is_empty)

  not_function = (complement is_function)

  not_mergeable = (complement is_mergeable)

  not_number = (complement is_number)

  not_object = (complement is_object)

  not_zero = (complement is_zero)


  # ============================================================
  # CATEGORY: ARRAYS
  # ============================================================

  butlast = (array) ->
    (slice array, 0, ((count array) - 1))
  
  # @param arrays...
  cat = (array) ->
    native_concat.apply(array, (slice arguments, 1))

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

  a_each = (array, fn) ->
    (each fn, array)

  a_filter = (array, fn) ->
    (filter fn, array)

  a_index_of = (array, item) ->
    array.indexOf(item)

  a_map = (array, fn) ->
    (map fn, array)

  a_reduce = (array, fn, val) ->
    (reduce fn, val, array)

  a_reject = (array, fn) ->
    (reject fn, array)

  compact = (coll) ->
    item for item in coll when item
    
  count = (array) ->
    array.length

  drop = (items_number_to_drop, array_like) ->
    (slice array_like, items_number_to_drop)

  # signatures: 
  #   fn, arr
  #   fn, arr, arr
  #   fn, arrs...
  each = ->
    args = arguments
    switch (count args)
      when 0, 1
        throw new Error("Each doesn't have a signature of that arity")
      when 2
        (each2 args[0], args[1])
      when 3
        (each3 args[0], args[1], args[2])
      else
        (apply eachn, args)

  # each of arity = 2
  each2 = (fn, arr) ->
    for item in arr
      (fn item)
    return

  # each of arity = 3
  each3 = (fn, arr1, arr2) ->
    length_of_shortest = (Math.min (count arr1), (count arr2))
    i                  = -1
    while ++i < length_of_shortest
      (fn arr1[i], arr2[i])
    return

  # each of arity = n
  eachn = ->
    args         = arguments
    fn           = (first args)
    arrs         = (rest args)
    shortest_idx = (apply Math.min, (map2 count, arrs))
    i            = -1
    local_pluck  = pluck
    local_apply  = apply
    while ++i < shortest_idx
      (local_apply fn, (local_pluck i, arrs))
    return

  first = (array) ->
    array[0]

  # ARRAY FILTERING FUNCTIONS
  filter_fn = (fn, array) ->
    item for item in array when (fn item)

  filter_prop = (prop_name, array) ->
    item for item in array when !!item[prop_name]

  filter_obj_1kv = (obj, array) ->
    [key, val] = (read_1kv obj)
    item for item in array when item[key] == val

  filter_obj_2kv = (obj, array) ->
    [key1, key2] = (keys obj)
    [val1, val2] = [obj[key1], obj[key2]]
    item for item in array when item[key1] == val1 && item[key2] == val2

  filter_obj = (obj, array) ->
    item for item in array when (o_match obj, item)

  filter = (some_criteria, array) ->
    switch (typeof some_criteria)
      when "string"
        (filter_prop some_criteria, array)
      when "function"
        (filter_fn some_criteria, array)
      when "object"
        switch (count (keys some_criteria))
          when 0
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
          when 1
            (filter_obj_1kv some_criteria, array)
          when 2
            (filter_obj_2kv some_criteria, array)
          else
            (filter_obj some_criteria, array)
      else
        throw Errors.UNEXPECTED_TYPE
  
  find_index_fn = (fn, array) ->
    for item, idx in array
      if (fn item)
        return idx
    -1

  find_index_prop = (prop_name, array) ->
    for item, idx in array
      if item[prop_name]
        return idx
    -1

  find_index_obj_1kv = (obj_with_1kv_pair, array) ->
    [key, val] = (read_1kv obj_with_1kv_pair)
    for item, idx in array
      if item[key] == val
        return idx
    -1

  find_index_obj_2kv = (obj_with_2kv_pair, array) ->
    [key1, key2] = (keys obj_with_2kv_pair)
    [val1, val2] = [obj_with_2kv_pair[key1], obj_with_2kv_pair[key2]]
    for item, idx in array
      if item[key1] == val1 && item[key2] == val2
        return idx
    -1

  find_index_obj = (obj, array) ->
    for item, idx in array
      if (o_match obj, item)
        return idx
    -1

  find_index = (some_criteria, array) ->
    switch (typeof some_criteria)
      when "string"
        (find_index_prop some_criteria, array)
      when "function"
        (find_index_fn some_criteria, array)
      when "object"
        switch (count (keys some_criteria))
          when 0
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
          when 1
            (find_index_obj_1kv some_criteria, array)
          when 2
            (find_index_obj_2kv some_criteria, array)
          else
            (find_index_obj some_criteria, array)
      else
        throw Errors.UNEXPECTED_TYPE

  find = (some_criteria, array) ->
    item_idx = (find_index some_criteria, array)
    return  if item_idx == -1
    (read item_idx, array)

  index_of = (item, array) ->
    array.indexOf(item)

  last = (list) ->
    list[(dec (count list))]

  list = ->
    (count (args = arguments)) && (slice args) || []

  # Produces list from arguments and then applies compact
  # function (which removes all falsies)
  list_compact = ->
    result = []
    for arg in arguments
      if !!arg
        result.push(arg)
    result

  # signatures: 
  #   fn, arr
  #   fn, arr, arr
  #   fn, arrs...
  map = ->
    args = arguments
    switch (count args)
      when 0, 1
        throw new Error("Map doesn't have a signature of that arity")
      when 2
        (map2 args[0], args[1])
      when 3
        (map3 args[0], args[1], args[2])
      else
        (apply mapn, args)

  # map of arity = 2
  map2 = (fn, arr) ->
    for item in arr
      (fn item)

  # map of arity = 3
  map3 = (fn, arr1, arr2) ->
    length_of_shortest = (Math.min (count arr1), (count arr2))
    i                  = -1
    while ++i < length_of_shortest
      (fn arr1[i], arr2[i])

  # map of arity = n
  mapn = ->
    args         = arguments
    fn           = (first args)
    arrs         = (rest args)
    shortest_idx = (apply Math.min, (map2 count, arrs))
    i            = -1
    local_pluck  = pluck
    local_apply  = apply
    while ++i < shortest_idx
      (local_apply fn, (local_pluck i, arrs))

  not_contains = (complement contains)

  prelast = (array) ->
    array[(count array) - 2]

  push = (arr, item) ->
    arr.push(item)
    arr

  # (fn, array)
  # (fn, val, array)
  reduce = (fn, val, array) ->
    idx = -1
    if !array && (is_array val)
      array = val
      val = (fn (first array), (second array))
      idx = 1

    while ++idx < array.length
      val = (fn val, array[idx])

    val

  # (fn, array)
  # (fn, val, array) # TODO finish
  reduce_right = (fn, val, array) ->
    idx = (count array)
    if !array && (is_array val)
      array = val
      val = (fn (last array), (prelast array))
      idx = idx - 2
    #
    while --idx >= 0
      val = (fn val, array[idx])
    #
    val



  reject_fn = (fn, array) ->
    item for item in array when !(fn item)

  reject_prop = (prop_name, array) ->
    item for item in array when !item[prop_name]

  reject_obj_1kv = (one_kv_pair_object, array) ->
    [key, val] = (read_1kv one_kv_pair_object)
    item for item in array when item[key] != val

  reject_obj_2kv = (two_kv_pairs_object, array) ->
    [key1, key2] = (keys two_kv_pairs_object)
    [val1, val2] = [two_kv_pairs_object[key1], two_kv_pairs_object[key2]]
    item for item in array when !(item[key1] == val1 && item[key2] == val2)

  reject_obj = (object, array) ->
    item for item in array when !(o_match object, item)

  reject = (some_criteria, array) ->
    switch (typeof some_criteria)
      when "string"
        (reject_prop some_criteria, array)
      when "function"
        (reject_fn some_criteria, array)
      when "object"
        switch (count (keys some_criteria))
          when 0
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
          when 1
            (reject_obj_1kv some_criteria, array)
          when 2
            (reject_obj_2kv some_criteria, array)
          else
            (reject_obj some_criteria, array)
      else
        throw Errors.UNEXPECTED_TYPE

  remap = (fn, arr) ->
    for item, item_idx in arr
      arr[item_idx] = (fn item)
    arr

  # removes item from array based on ref equality
  remove = (item, arr) ->
    idx = (index_of item, arr)
    idx != -1 && (remove_at idx, arr)

  remove_at = (idx, arr) ->
    (splice arr, idx, 1)

  repeat = (times, value) ->
    while --times >= 0
      value

  # @return {Array} whole array except the first item
  rest = (arr) ->
    (slice arr, 1)

  reverse = (bind Function::call, Array::reverse)

  splice = (bind Function::call, Array::splice)

  second = (array) ->
    array[1]

  set_difference = (set_a, set_b) ->
    item for item in set_a when (not_contains item, set_b)

  set_symmetric_difference = (set_a, set_b) ->
    [(set_difference set_a, set_b), (set_difference set_b, set_a)]

  take = (items_number_to_take, array_like) ->
    (slice array_like, 0, items_number_to_take)

  unshift = (arr, item) ->
    arr.unshift(item)
    arr

  # ============================================================
  # CATEGORY: COLLECTIONS
  # ============================================================

  # @param {string} method_name
  # @param {var_args...} [method_args]
  # @param {Array} coll
  invoke = (method_name, coll) ->
    results = []
    args_count = (count arguments)

    if args_count >= 3
      method_args = (slice arguments, 1, args_count - 1)
      coll = (last arguments)
      for item in coll
        results.push( item[method_name].apply(item, method_args) )
    else
      for item in coll
        results.push( item[method_name]() )

    results

  pluck = (key, coll) ->
    for item in coll
      item[key]

  varynum = (numbers_arr, start_with_one) ->
    variator = start_with_one && -1 || 1
    for number in numbers_arr
      variator *= -1
      number * variator


  # ============================================================
  # CATEGORY: OBJECTS
  # ============================================================


  # @param {object} dest the place where all properties
  #  from all sources will be written
  # @param {varargs} sources: 1 or more sources
  assign = (dest = {}, sources) ->
    sources = (drop 1, arguments)
    (each (partial assign_one, dest), sources)
    dest

  assign_one = (dest, src) ->
    for key, val of src
      dest[key] = val
  
  clone_obj = (obj) ->
    res = {}
    for key, val of obj
      res[key] = val
    res

  clone = (data) ->
    if (is_object data)
      if (is_array data)
        (slice data)
      else
        (clone_obj data)
    else
      throw Errors.UNEXPECTED_TYPE

  clonedeep = (src) ->
    (_clonedeep src
              , dst = (is_array src) && [] || {}
              , stack_dst = [dst]
              , stack_src = [src])

  _clonedeep = (src, dst, stack_dst, stack_src) ->
    for key, val of src
      if (not_mergeable val)
        dst[key] = val
      else
        val_idx = (index_of val, stack_src)
        if (val_idx == -1)
          dst[key] = child_dst = (is_array val) && [] || {}
          stack_src.push(val)
          stack_dst.push(child_dst)
          (_clonedeep val, child_dst, stack_dst, stack_src)
        else
          dst[key] = stack_dst[val_idx]
    dst

  # _clonedeep2
  # проверить чтобы клонировалась также множественные ссылки на один объект
  _clonedeep2 = (src) ->
    dst = (is_array src) && [] || {}
    cur_src = src
    cur_dst = dst

    stack_src = [src]
    stack_dst = [dst]
    stack_act = []

    cur_keys = (is_array cur_src) && (range (count cur_src)) || (reverse (keys cur_src))
    cur_key_idx = (count cur_keys)

    while --cur_key_idx >= 0
      key = cur_keys[cur_key_idx]
      val = cur_src[key]

      if (not_mergeable val)
        cur_dst[key] = val
      else
        val_idx = (index_of val, stack_src)
        if (val_idx == -1)
          child_dst = (is_array val) && [] || {}
          cur_dst[key] = child_dst

          stack_act.push([cur_src, cur_dst, cur_keys, cur_key_idx])

          cur_src = val
          cur_dst = child_dst
          cur_keys = (is_array cur_src) && (range (count cur_src)) || (reverse (keys cur_src))
          cur_key_idx = (count cur_keys)

          stack_src.push(cur_src)
          stack_dst.push(cur_dst)
        else
          cur_dst[key] = stack_dst[val_idx]

      while (is_zero cur_key_idx) && (not_zero (count stack_act))
        [cur_src, cur_dst, cur_keys, cur_key_idx] = stack_act.pop()

    dst
    
  defaults = (dest = {}) ->
    (reduce defaults2, dest, (rest arguments))
  
  defaults2 = (dest, source) ->
    for key, val of source
      if ('undefined' == typeof dest[key])
        dest[key] = val
    dest

  keys = (hash) ->
    Object.keys(hash)

  # what is more important?
  #   1) to have all the links of the source objects inside the dest object? 
  #      don't replacate circular refs then
  #   2) or to have the dest object to repeat qualities of the source objects?
  #      then replicate circular refs
  # this function acts by first strategy.
  merge = (dst, src) ->
    call_stack  = []
    src_stack   = []
    #
    cur_dst     = dst
    cur_src     = src
    cur_keys    = (keys src)
    cur_key_idx = (count cur_keys)
    #
    while --cur_key_idx >= 0
      key = cur_keys[cur_key_idx]
      val = cur_src[key]
      #
      if (not_defined cur_dst[key]) || (not_mergeable val)
        cur_dst[key] = val
        if (is_mergeable val)
          src_stack.push(val)
      else
        val_idx = (index_of val, src_stack)
        if (val_idx == -1)
          #
          call_stack.push([cur_dst, cur_src, cur_keys, cur_key_idx])
          src_stack.push(val)
          #
          cur_dst     = cur_dst[key]
          cur_src     = cur_src[key]
          cur_keys    = (keys cur_src)
          cur_key_idx = (count cur_keys)
      #
      while (is_zero cur_key_idx) && (not_empty call_stack)
        [cur_dst, cur_src, cur_keys, cur_key_idx] = call_stack.pop()
    #
    dst


  # @param {object} hash source
  # @param {array<string>} keys_list
  # @return {array<*>}
  # @example:
  #  food_related_hash =
  #    cook_haggis : (ingredients...) -> ... some code ...
  #    cook_pasta  : (ingredients...) ->
  #    cook_soup   : (ingredients...) ->
  #    drink_beer  : (beer) ->
  #
  #  cooking_for_today = (o_map hash, [ 'cook_haggis', 'drink_beer' ]) # -> [ function, function ]
  #  (first cooking_for_today) == food_related_hash['cook_haggis'] # -> true
  o_map = (hash, keys_list) ->
    for key in keys_list
      hash[key]

  o_match = (criteria_obj, matched) ->
    for key, val of criteria_obj
      if matched[key] != val
        return false
    true

  pull = (key, hash) ->
    val = hash[key]
    delete hash[key]
    val

  vals = (hash) ->
    (o_map hash, (keys hash))

  # ============================================================
  # CATEGORY: STRINGS
  # ============================================================
  
  head = (chars_to_take, str) ->
    str.substr(0, chars_to_take)
  
  match = (source_str, regexp) ->
    source_str.match(regexp)

  comma = ->
    (str_join ',', (slice arguments))

  space = ->
    (str_join ' ', (slice arguments))

  # Joins incoming strings into single one
  str = ->
    (str_join '', (slice arguments))

  str_breplace = (map, str) ->
    regex = (mk_regexp (str_join '|', (keys map)), 'ig')

    str.replace regex, (seq) ->
      map[seq] || seq

  str_join = (join_string, array_to_join) ->
    array_to_join.join(join_string)

  str_split = (split_str, string_to_split) ->
    string_to_split.split(split_str)

  tail = (chars_to_drop, str) ->
    str.substr(chars_to_drop)


  # ============================================================
  # CATEGORY: MISCELLANEOUS
  # ============================================================

  # decrement
  dec = (num) ->
    num - 1

  inc = (num) ->
    num + 1

  jquery_wrap_to_array = (jquery_wrap) ->
    wrap_len = jquery_wrap.length
    i = -1
    while ++i < wrap_len
      jquery_wrap.eq(i)
  
  mk_regexp = (rx_str, rx_settings) ->
    rx_settings = rx_settings || ""
    new RegExp(rx_str, rx_settings)

  # signatures:
  #  end_idx
  #  start_idx, end_idx
  #  start_idx, end_idx, step
  range = (start_idx, end_idx, step) ->
    switch (count arguments)
      when 1
        end_idx   = start_idx
        start_idx = 0
        step      = 1
      when 2
        step      = 1
      when 3
        break
      else
        throw new Error(
          'Bad arguments length,
          available signatures are for arguments length 1, 2 and 3')
    #
    length = (Math.ceil ((Math.abs (end_idx - start_idx)) / step))
    array  = new Array(length)
    start_idx -= step
    i = -1
    while ++i < length
      array[i] = (start_idx += step)
    array

  read = (prop_name, hash) ->
    hash[prop_name]

  read_1kv = (obj_with_1kv_pair) ->
    key = (first (keys obj_with_1kv_pair))
    [key, (read key, obj_with_1kv_pair)]

  ###
  This is a function that iterates with another function 
  over the nodes of a tree structure.
  @param fn {function} function that operates on the node.
    signature: son, parent, son_idx, depth
  @param root {hash} a tree whose children lie in the sons
    list (i.e. ordered collection).
  @param depth: indicates depth of recursion
  ###
  recurse = (fn, root, depth = 0) ->
    { sons } = root
    depth++
    for son, idx in sons
      (fn son, root, idx, depth)
    for son in sons
      (recurse fn, son, depth)
    root

  sum2 = (a, b) ->
    a + b

  a_sum = (partial reduce, sum2)

  set = (prop_name, val, hash) ->
    hash[prop_name] = val

  time = (fn) ->
    time_start = Date.now()
    fn()
    time_end   = Date.now()
    time_end - time_start

  # EXPORTS
  { a_contains
  , a_each
  , a_filter
  , a_index_of
  , a_map
  , a_reduce
  , a_reject
  , a_sum
  , and2
  , assign
  , apply
  , bind
  , butlast
  , cat
  , clone
  , clonedeep
  , clonedeep2: _clonedeep2
  , comma
  , compact
  , compose
  , complement
  , concat: cat
  , contains
  , count
  , debounce
  , dec
  , defaults
  , delay
  , detect: find
  , drop
  , each
  , extend: assign
  , fastbind: bind
  , flow
  , first
  , filter
  , filter_fn
  , filter_obj
  , filter_obj_1kv
  , filter_obj_2kv
  , filter_prop
  , find
  , find_index
  , find_index_fn
  , find_index_prop
  , find_index_obj_1kv
  , find_index_obj_2kv
  , find_index_obj
  , get: read
  , head
  , inc
  , index_of
  , invoke
  , is_array
  , is_defined
  , is_empty
  , is_function
  , is_mergeable
  , is_number
  , is_object
  , is_plain_object
  , is_zero
  , jquery_wrap_to_array
  , keys
  , last
  , list
  , list_compact
  , map
  , match
  , merge
  , mk_regexp
  , multicall
  , no_operation
  , noop: no_operation
  , not_array
  , not_defined
  , not_empty
  , not_function
  , not_number
  , not_object
  , not_zero
  , o_map
  , o_match
  , partial
  , partialr
  , pipeline: flow
  , pluck
  , pull
  , push
  , range
  , read
  , recurse
  , reduce
  , reject
  , reject_fn
  , reject_obj
  , reject_obj_1kv
  , reject_obj_2kv
  , reject_prop
  , remap
  , remove
  , remove_at
  , repeat
  , rest
  , reverse
  , second
  , set
  , set_difference
  , set_symmetric_difference
  , slice
  , space
  , splice
  , str
  , str_breplace
  , str_join
  , str_split
  , sum2
  , sumn: (flow list, (partial reduce, sum2))
  , take
  , tail
  , throttle
  , time
  , unshift
  , vals
  , varynum }

# AMD loader support
if (('undefined' != typeof define) && define.amd)
  (define wrapper)
# CommonJS support
else if (('undefined' != typeof module) && module.exports)
  module.exports = wrapper()
