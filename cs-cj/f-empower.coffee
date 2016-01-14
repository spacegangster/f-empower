
###
F-EMPOWER
A set of functions to harness the power functional programming in JS.
Author: Ivan Fedorov <sharp.maestro@gmail.com>
License: MIT
###

# use 64k as large array size threshold
# small arrays can be static size
# large array should be dynamically sized
THRESHOLD_LARGE_ARRAY_SIZE = 64000


Errors =
  NO_KEY_VALUE_PAIR_IN_HASH : new Error('No key value pair in a criterion hash')
  NOT_FUNCTION              : new TypeError('Something is not function')
  UNEXPECTED_TYPE           : new TypeError('Unexpected type')

ReducedClass = (val) ->
  @val = val
  return

Reduced = (val) ->
  new ReducedClass(val)

to_string       = Object::toString
native_concat   = Array::concat
native_index_of = Array::indexOf
native_slice    = Array::slice

slice = (array_or_arguments, start_idx, end_idx) ->
  native_slice.call(array_or_arguments, start_idx, end_idx)

bind = (fn, this_arg) ->
  (-> fn.apply(this_arg, arguments))

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

add2 = (a, b) ->
  a + b

and2 = (a, b) ->
  a && b

and_r = (a, b) ->
  (a && b) || Reduced(false)

# prop_names..., this_arg
bind_all = ->
  props = (butlast arguments)
  this_arg = (last arguments)
  a_each props, (prop) ->
    this_arg[prop] = (bind this_arg[prop], this_arg)

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
  if arguments.length == 1
    fn = debounce_timeout
    debounce_timeout = 0
  #
  last_result = undefined
  last_args   = null
  last_timeout_id = null
  last_this = null
  #
  exec = ->
    last_result = fn.apply(last_this, last_args)
  #
  ->
    last_args = (slice arguments)
    last_this = this
    #
    (clearTimeout last_timeout_id)
    last_timeout_id = (delay debounce_timeout, exec)
    #
    last_result

debug_wrap = (fn) ->
  ->
    debugger
    fn.apply(null, arguments)

delay = (delay_ms, fn) ->
  if arguments.length == 1
    fn       = delay_ms
    delay_ms = 0
  #
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

periodically = (interval, countdown, fn) ->
  if (not_number countdown) || (countdown < 1)
    throw new Error("Bad countdown")
  interval_id = set_interval interval, ->
    fn()
    countdown = countdown - 1
    if 0 == countdown
      (clearInterval interval_id)

pbind = (fn) ->
  ->
    fn.apply(null, (cat [this], (slice arguments)))

set_interval = (ms, fn) ->
  if !fn
    fn = ms
    ms = 0
  #
  (setInterval fn, ms)

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

is_atomic = (val) ->
  switch (type_of2 val)
    when '[object Object]'
    ,    '[object Array]'
    ,    '[object Date]'
      false
    else
      true

is_arguments = (v) ->
  '[object Arguments]' == (type_of2 v)

is_array = Array.isArray

is_array_like = (v) ->
  #(is_array v) || (is_arguments v)
  (is_number v.length)

is_boolean = (v) ->
  'boolean' == (typeof v)

is_date = (val) ->
  '[object Date]' == (type_of2 val)

is_defined = (subj) ->
  'undefined' != (typeof subj)

is_empty = (o) ->
  0 == (count1 o)

is_empty$ = (o) ->
  !o || (is_empty o)

is_even = (num) ->
  0 == (num % 2)

is_function = (candidate) ->
  'function' == typeof candidate

is_number = (candidate) ->
  'number' == typeof candidate

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

is_regexp = (item) ->
  '[object RegExp]' == (type_of2 item)

is_string = (item) ->
  "string" == (type_of item)

is_subset = (subset, superset) ->
  (is_empty (difference subset, superset))

is_zero = (candidate) ->
  candidate == 0


not_array = (complement is_array)

not_boolean = (complement is_boolean)

not_date = (complement is_date)

not_defined = (complement is_defined)

not_empty = (complement is_empty)

not_empty$ = (complement is_empty$)

not_function = (complement is_function)

not_mergeable = (complement is_mergeable)

not_number = (complement is_number)

not_object = (complement is_object)

not_string = (complement is_string)

not_subset = (complement is_subset)

not_zero = (complement is_zero)


# ============================================================
# CATEGORY: ARRAYS
# ============================================================

butlast = (array) ->
  (slice array, 0, ((count1 array) - 1))

# @param arrays...
cat = (array) ->
  native_concat.apply(array, (slice arguments, 1))

contains = (searched_item, array) ->
  for item in array
    if searched_item == item
      return true
  false

not_contains = (complement contains)

a_contains = (array, searched_item) ->
  for item in array
    if searched_item == item
      return true
  false

# TODO implement signature like:
#   array..., fn
a_each = (array, fn) ->
  (each fn, array)

a_filter = (array, fn) ->
  (filter fn, array)

a_find_index = (array, pred) ->
  (find_index pred, array)

a_index_of = (array, item) ->
  array.indexOf(item)

a_map = (array, fn) ->
  (map fn, array)

# (array, fn)
# (array, val, fn)
a_reduce = (array, val, fn) ->
  if (is_function val)
    (reduce val, array)
  else
    (reduce fn, val, array)

a_reject = (array, fn) ->
  (reject fn, array)

# @return {boolean} true if array contains an element matching the condition
any = (pred, arr) ->
  if arguments.length == 1
    arr = pred
    pred = true
  #
  -1 != (find_index pred, arr)

compact = (coll) ->
  item for item in coll when item

count = (pred, coll) ->
  if !coll
    (count1 pred)
  else if !pred
    coll.length
  else
    if (is_function pred)
      (count_pred pred, coll)
    else
      (count_obj pred, coll)

count1 = (o) ->
  if (is_array_like o)
    o.length
  else
    (keys o).length

count_obj = (pred, coll) ->
  (filter pred, coll).length

count_pred = (pred, coll) ->
  cnt = 0
  for item in coll
    if (pred item)
      cnt++
  cnt

drop = (items_number_to_drop, array_like) ->
  (slice array_like, items_number_to_drop)

drop_last = (chars_to_drop, string) ->
  len = string.length
  if chars_to_drop > len
    ""
  else
    string.substring(0, len - chars_to_drop)

# signatures: 
#   fn, arr
#   fn, arr, arr
#   fn, arrs...
each = (fn, coll) ->
  switch arguments.length
    when 0, 1
      throw new Error("Each doesn't have a signature of that arity")
    when 2
      (each2 fn, coll)
    when 3
      (each3 fn, coll, arguments[2])
    else
      (apply eachn, arguments)

# each of arity = 2
each2 = (fn, arr) ->
  for item in arr
    (fn item)
  return

# each of arity = 3
each3 = (fn, arr1, arr2) ->
  length_of_shortest = (Math.min (count1 arr1), (count1 arr2))
  i                  = -1
  while ++i < length_of_shortest
    (fn arr1[i], arr2[i])
  return

calc_shortest_length = (arrs) ->
  (apply Math.min, (map2 count1, arrs))

# each of arity = n
eachn = ->
  args         = arguments
  fn           = (first args)
  arrs         = (rest args)
  shortest_len = (calc_shortest_length arrs)
  i            = -1
  local_pluck  = pluck
  local_apply  = apply
  while ++i < shortest_len
    (local_apply fn, (local_pluck i, arrs))
  return

each_idx = ->
  if arguments.length == 2
    (each_idx2 arguments[0], arguments[1])
  else
    (apply each_idxn, arguments)

each_idx2 = (fn, arr) ->
  len = arr.length
  i   = -1
  while ++i < len
    (fn arr[i], i)
  return

each_idxn = ->
  fn   = (first arguments)
  arrs = (rest arguments)
  shortest_len = (calc_shortest_length arrs)
  local_pluck  = pluck
  local_apply  = apply
  while ++i < shortest_len
    args = (local_pluck i, arrs)
    args.push(i)
    (local_apply fn, args)
  return

check_keys = (obj, keys_to_check) ->
  (every (wrap_invoke_obj obj), keys_to_check)

check_true = (val) ->
  val == true

every = (pred, coll) ->
  if !coll
    coll = pred
    pred = check_true
  return true  if (is_empty coll)
  #
  (every_fn pred, coll)

every_fn = (fn, coll) ->
  a_reduce coll, true, (v1, v2) ->
    (v1 && (fn v2)) || Reduced(false)

first = (array) ->
  array[0]

# ARRAY FILTERING FUNCTIONS
filter_fn = (fn, arr) ->
  res = []
  len = arr.length
  i = -1
  while ++i < len
    item = arr[i]
    if (fn item)
      res.push(item)
  res

filter_prop = (prop_name, arr) ->
  res = []
  len = arr.length
  i = -1
  while ++i < len
    item = arr[i]
    if item[prop_name]
      res.push(item)
  res

filter_obj_1kv = (obj, array) ->
  [key, val] = (read_1kv obj)
  item for item in array when item[key] == val

filter_obj_2kv = (obj, array) ->
  [key1, key2] = (keys obj)
  [val1, val2] = [obj[key1], obj[key2]]
  item for item in array when item[key1] == val1 && item[key2] == val2

filter_obj = (obj, array) ->
  item for item in array when (o_match obj, item)

filter_re = (regex, strings) ->
  results = []
  for string in strings
    if regex.test(string)
      results.push(string)
  results

filter = (some_criteria, array) ->
  switch (typeof some_criteria)
    when "string"
      (filter_prop some_criteria, array)
    when "function"
      (filter_fn some_criteria, array)
    when "object"
      if (is_regexp some_criteria)
        (filter_re some_criteria, array)
      else
        switch (count1 (keys some_criteria))
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

find = (some_criteria, array) ->
  item_idx = (find_index some_criteria, array)
  return  if item_idx == -1
  (read item_idx, array)

find_index = (pred, array) ->
  switch (typeof pred)
    when "string"
      (find_index_prop pred, array)
    when "function"
      (find_index_fn pred, array)
    when "boolean", "number"
      (index_of pred, array)
    when "object"
      switch (count1 (keys pred))
        when 0
          throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
        when 1
          (find_index_obj_1kv pred, array)
        when 2
          (find_index_obj_2kv pred, array)
        else
          (find_index_obj pred, array)
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


base_find_index_r = (iter_fn, array) ->
  i = array.length
  while --i > -1
    if (iter_fn array[i], i, array)
      return i
  return -1

equal_bool = (b1, b2) ->
  b1 == b2

equal_number = (n1, n2) ->
  n1 == n2

dispatch_find_index_matcher = (pred) ->
  switch (typeof pred)
    when 'function'
      pred
    when 'boolean'
      (partial equal_bool, pred)
    when 'number'
      (partial equal_number, pred)
    else
      throw new Error("No matcher for #{typeof pred} yet")

find_index_last = (pred, array) ->
  (base_find_index_r (dispatch_find_index_matcher pred), array)


flatten = (arr) ->
  if (is_empty arr)
    []
  else
    (apply cat, arr)

index_of = (item, array) ->
  native_index_of.call(array, item)

insert_at = (items, idx, item) ->
  items.splice(idx, 0, item)
  items

last = (list) ->
  list[(dec (count1 list))]

list = ->
  (count1 (args = arguments)) && (slice args) || []

# Produces list from arguments and then applies compact
# function (which removes all falsies)
list_compact = ->
  result = []
  for arg in arguments
    if !!arg
      result.push(arg)
  result

log_pipe = (val) ->
  console.log.apply(console, val)
  val

next = (arr, item) ->
  arr[(index_of item, arr) + 1]

prev = (arr, item) ->
  arr[(index_of item, arr) - 1]

type_of = (mixed) ->
  typeof mixed

type_of2 = (val) ->
  to_string.call(val)

# arr
# criterion, arr
sort = (criterion, arr) ->
  switch (count1 arguments)
    when 1
      return criterion.sort()
    when 2
      return (slice arr)  if 2 > (count1 arr)
      #
      switch (type_of criterion)
        when "string"
          (sort_prop criterion, arr)
        when "array"
          (sort_multi criterion, arr)
        when "function"
          (sort_fn criterion, arr)

sort_prop = (prop, arr) ->
  sort_suitable_arr = (map (partial _suit_sort, prop), arr)
  #
  need_string_comparison = (is_string arr[0][prop])
  compare_fn = need_string_comparison && _compare_string || _compare_crit
  (pluck 'val', sort_suitable_arr.sort(compare_fn))

_suit_sort = (prop, obj) ->
  {val: obj, criteria: obj[prop]}

_compare_crit = (obj1, obj2) ->
  obj1.criteria - obj2.criteria

native_locale_compare = String::localeCompare
_compare_string = (obj1, obj2) ->
  native_locale_compare.call(obj1.criteria, obj2.criteria)

sort_multi = (props_arr, arr) ->

sort_fn = (compare_fn, arr) ->
  arr.sort(compare_fn)


# signatures: 
#   fn, arr
#   fn, arr, arr
#   fn, arrs...
#   str, arr
#   obj, arr
map = (mapper, coll) ->
  switch arguments.length
    when 0, 1
      throw new Error("Map doesn't have a signature of that arity")
    when 2
      switch typeof mapper
        when 'function'
          (map2 mapper, coll)
        when 'string'
          (pluck mapper, coll)
        when 'object'
          (o_map mapper, coll)
    when 3
      (map3 mapper, coll, arguments[2])
    else
      (apply mapn, arguments)


_async_mapper = (err_fn, map_fn, accumulator, report_arr, item, idx) ->
  map_fn item, (err, res) ->
    return (err_fn err) if err
    #
    accumulator[idx] = res
    report_arr[idx] = true

# Parallel mapper
# @param {function} map_fn
# @param {Array} items
# @param {function} on_res(err, mapped_result)
map_async = (map_fn, items, on_res) ->
  len = items.length
  help_arr = (repeat len, false)
  res_arr  = (make_array len)
  #
  int_id = set_interval 2, ->
    if (every help_arr)
      (clearInterval int_id)
      (on_res null, res_arr)
  #
  err_fn = (err) ->
    (clearInterval int_id)
    (on_res err)
  #
  (each_idx2 (partial _async_mapper, err_fn, map_fn, res_arr, help_arr), items)


# @private
# use V8 array size optimization
make_array = (len) ->
  (len > THRESHOLD_LARGE_ARRAY_SIZE) && [] || new Array(len)


# map of arity = 2
map2 = (fn, arr) ->
  i      = -1
  len    = (count1 arr)
  result = (make_array len)
  #
  while ++i < len
    result[i] = (fn arr[i])
  #
  result

# map of arity = 3
map3 = (fn, arr1, arr2) ->
  length_of_shortest = (Math.min (count1 arr1), (count1 arr2))
  i                  = -1
  result             = (make_array length_of_shortest)
  #
  while ++i < length_of_shortest
    result[i] = (fn arr1[i], arr2[i])
  #
  result

# map of arity = n
# fn, arr1, arr2, arr3, etc.
mapn = ->
  args         = arguments
  fn           = (first args)
  arrs         = (rest args)
  shortest_len = (apply Math.min, (map2 count1, arrs))
  i            = -1
  local_pluck  = pluck
  local_apply  = apply
  result       = (make_array shortest_len)
  #
  while ++i < shortest_len
    result[i] = (local_apply fn, (local_pluck i, arrs))
  #
  result

not_contains = (complement contains)

prelast = (array) ->
  array[(count1 array) - 2]

push = (arr, item) ->
  arr.push(item)
  arr

push_all = (arr, items_to_push_arr) ->
  arr.push.apply(arr, items_to_push_arr)
  arr

# (fn(memo, cur), array)
# (fn(memo, cur), val, array)
reduce = (fn, val, array) ->
  idx = -1
  if !array && (is_array_like val)
    array = val
    val = (fn (first array), (second array))
    idx = 1
  len = (count1 array)
  #
  while ++idx < len && (!val || val.constructor != ReducedClass)
    val = (fn val, array[idx])
  #
  if val && val.constructor == ReducedClass
    val.val
  else
    val

# (fn, array)
# (fn, val, array)
reducer = (fn, val, arr) ->
  idx = -1
  if !arr && (is_array val)
    arr = val
    val = (fn (last arr), (prelast arr))
    idx = (count1 arr) - 2
  else
    idx = (count1 arr)
  #
  while --idx > -1
    val = (fn val, arr[idx])
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
      switch (count1 (keys some_criteria))
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

# fn, arr
# fn, prop, arr
remap = (fn, arr) ->
  switch arguments.length
    when 2
      (remap2 fn, arr)
    when 3
      (remap3 fn, arguments[1], arguments[2])

remap2 = (fn, arr) ->
  for item, item_idx in arr
    arr[item_idx] = (fn item)
  arr

remap3 = (fn, prop, arr) ->
  for item, item_idx in arr
    arr[item_idx][prop] = (fn item[prop])
  arr

# removes item from array based on ref equality
remove = (item, arr) ->
  idx = (index_of item, arr)
  idx != -1 && (remove_at idx, arr)

remove_at = (idx, arr) ->
  (splice arr, idx, 1)

# @param {int} times
# @param {mixed} value
repeat = (times, value) ->
  array = (make_array times)
  while --times > -1
    array[times] = value
  array

repeatf = (times, fn) ->
  array = (make_array times)
  while --times > -1
    array[times] = fn()
  array

# @return {Array} whole array except the first item
rest = (arr) ->
  (slice arr, 1)

reverse = (arr) ->
  len = arr.length
  i   = 0
  j   = len
  res = new Array(len)
  while --j > -1
    res[i] = arr[j]
    i += 1
  res

splice = (bind Function::call, Array::splice)

second = (array) ->
  array[1]

take = (items_number_to_take, array_like) ->
  (slice array_like, 0, items_number_to_take)

third = (arr) ->
  arr[2]

union = (arr1, arr2) ->
  result = arr1.slice()
  for item in arr2
    if !(contains item, arr1)
      result.push(item)
  result

unshift = (arr, item) ->
  arr.unshift(item)
  arr

without = (item, arr) ->
  (remove item, arr)
  arr

# ============================================================
# CATEGORY: COLLECTIONS
# ============================================================

# @param {string} method_name
# @param {var_args...} [method_args]
# @param {Array} coll
invoke = (method_name, coll) ->
  switch arguments.length
    when 2
      (invoke0 method_name, coll)
    when 3
      (invoke1 method_name, coll, arguments[2])
    else
      invoken.apply(null, arguments)

invoke0 = (method_name, coll) ->
  len = coll.length
  results = (make_array len)
  i = -1
  while ++i < len
    results[i] = coll[i][method_name]()
  results

invoke1 = (method_name, arg, coll) ->
  len = coll.length
  results = (make_array len)
  i = -1
  while ++i < len
    item = coll[i]
    results[i] = item[method_name].call(item, arg)
  results

invoken = (method_name, args..., coll) ->
  len = coll.length
  results = (make_array len)
  i = -1
  while ++i < len
    item = coll[i]
    results[i] = item[method_name].apply(item, args)
  results


# Muted invoke, returns undefined
# @param {string} method_name
# @param {var_args...} [method_args]
# @param {Array} coll
invokem = (method_name, coll) ->
  switch arguments.length
    when 2
      (invokem0 method_name, coll)
    when 3
      (invokem1 method_name, coll, arguments[2])
    else
      invokemn.apply(null, arguments)

invokem1 = (method_name, arg, coll) ->
  i = -1
  len = coll.length
  while ++i < len
    item = coll[i]
    item[method_name].call(item, arg)
  return

invokem0 = (method_name, coll) ->
  i = -1
  len = coll.length
  while ++i < len
    coll[i][method_name]()
  return

invokemn = (method_name, args..., coll) ->
  i = -1
  len = coll.length
  while ++i < len
    item = coll[i]
    item[method_name].apply(item, args)
  return


pluck = (key, coll) ->
  len    = (count1 coll)
  result = (make_array len)
  i      = -1
  #
  while ++i < len
    result[i] = coll[i][key]
  #
  result

varynum = (numbers_arr, start_with_one) ->
  variator = start_with_one && -1 || 1
  for number in numbers_arr
    variator *= -1
    number * variator

write = (dst_coll, prop_name, src_coll) ->
  for dst, idx in dst_coll
    src = src_coll[idx]
    dst[prop_name] = src
  dst_coll

# prop, array
# array
unique = (prop, array) ->
  if array
    (unique_by_prop prop, array)
  else
    array = prop
    if (is_empty array)
      []
    else if (is_number array[0]) || (is_string array[0])
      (unique_plain array)
    else
      throw Error("only propped uniq and plain number or string uniqueing supported")

# returns unique
unique_by_prop = (prop_name, arr) ->
  help_hash = {}
  out = []
  #
  a_each arr, (item) ->
    prop_val = item[prop_name]
    if !help_hash[prop_val]
      help_hash[prop_val] = true
      out.push(item)
  #
  out

unique_plain = (arr) ->
  help_hash = {}
  out = []
  #
  a_each arr, (val) ->
    if !help_hash[val]
      help_hash[val] = true
      out.push(val)
  #
  out

wrap_invoke_obj = (o) ->
  (key) ->
    o[key]



# ============================================================
# CATEGORY: OBJECTS
# ============================================================

# @param {object} dest the place where all properties
#  from all sources will be written
# @param {varargs} sources: 1 or more sources
assign = (dest = {}, sources) ->
  (reduce assign_one, dest, (drop 1, arguments))

assign_keys = (keys, dst, src) ->
  i = -1
  l = keys.length
  while ++i < l
    key = keys[i]
    if undefined != src[key]
      dst[key] = src[key]
  dst

assign_one = (dest, src) ->
  for key, val of src
    dest[key] = val
  dest

clone = (data) ->
  if (is_object data)
    if (is_array data)
      (slice data)
    else
      (clone_obj data)
  else
    throw Errors.UNEXPECTED_TYPE

# сигнатура функции
# @param {object} dst
# @param {object...} var_src
cloneassign = (dst, var_src) ->
  (reduce assign_one, (clonedeep dst), (drop 1, arguments))

clonedeep = (src) ->
  (_clonedeep src
            , dst = (is_array src) && [] || {}
            , stack_dst = [dst]
            , stack_src = [src])

clone_obj = (obj) ->
  res = {}
  for key, val of obj
    res[key] = val
  res

_clonedeep = (src, dst, stack_dst, stack_src) ->
  for key, val of src
    if (is_atomic val)
      dst[key] = val
    else if (is_date val)
      dst[key] = new Date(val.getTime())
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
  #
  stack_src = [src]
  stack_dst = [dst]
  stack_act = []
  #
  cur_keys = (is_array cur_src) && (range (count1 cur_src)) || (reverse (keys cur_src))
  cur_key_idx = (count1 cur_keys)
  #
  while --cur_key_idx >= 0
    key = cur_keys[cur_key_idx]
    val = cur_src[key]
    #
    if (is_atomic val)
      cur_dst[key] = val
    else if (is_date val)
      cur_dst[key] = new Date(val.getTime())
    else
      val_idx = (index_of val, stack_src)
      if (val_idx == -1)
        child_dst = (is_array val) && [] || {}
        cur_dst[key] = child_dst

        stack_act.push([cur_src, cur_dst, cur_keys, cur_key_idx])

        cur_src = val
        cur_dst = child_dst
        cur_keys = (is_array cur_src) && (range (count1 cur_src)) || (reverse (keys cur_src))
        cur_key_idx = (count1 cur_keys)

        stack_src.push(cur_src)
        stack_dst.push(cur_dst)
      else
        cur_dst[key] = stack_dst[val_idx]

    while (is_zero cur_key_idx) && (not_zero (count1 stack_act))
      [cur_src, cur_dst, cur_keys, cur_key_idx] = stack_act.pop()

  dst

# useful when you want to instantiate a list of instances
# from a list of data
create = (ctor, arg) ->
  new ctor(arg)
  
defaults = (dest = {}) ->
  (reduce defaults2, dest, (rest arguments))

defaults2 = (dest, source) ->
  for key, val of source
    if ('undefined' == typeof dest[key])
      dest[key] = val
  dest

difference = (o1, o2) ->
  if (is_object o1) && (is_object o2)
    if (is_array o1) && (is_array o2)
      (difference_sets o1, o2)
    else
      (difference_objs_vals o1, o2)
  else
    throw new TypeError("Tried to find difference between not objects")

# @param {object} o1, o2
# @return {object} object containing keys from o1,
#  which are defined in o2 and have different value
difference_objs_vals = (o1, o2) ->
  res = {}
  for key, val1 of o1
    if (is_defined  val2 = o2[key]) && !(equal2 val1, val2)
      res[key] = val1
  res

difference_sets = (set_a, set_b, contains_fn = contains) ->
  a_reject set_a, (item) ->
    (contains_fn item, set_b)

set_symmetric_difference = (set_a, set_b, contains_fn) ->
  [(difference_sets set_a, set_b, contains_fn), (difference_sets set_b, set_a, contains_fn)]

# tests objects and arrays for shallow equality
# @signatures
#  @signature object...
#  @signature array...
equal = ->
  val = a_reduce arguments, (v1, v2) ->
    (equal2 v1, v2) && v2 || (Reduced false)
  !!val

equal2 = (o1, o2) ->
  if (o1 == null) || (o2 == null) || (o1 == undefined) || (o2 == undefined)
    o1 == o2
  else if (is_object o1) && (is_object o2)
    if (is_array o1) && (is_array o2)
      (equal_array o1, o2)
    else if (is_date o1)
      o1.valueOf() == o2.valueOf()
    else
      (equal_object o1, o2)
  else
    o1 == o2

equal_array = (arr1, arr2) ->
  len1 = arr1.length
  len2 = arr2.length
  #
  ((0 == len1) && (0 == len2)) ||
    ((len1 == len2) && (equal_array_start arr1, arr2))

equal_array_start = (arr1, arr2) ->
 (reduce and_r, true, (map equal_val, arr1, arr2))

# shallow equality check
equal_object = (o1, o2) ->
  keys1 = (keys o1)
  keys2 = (keys o2)
  if keys1.length == keys2.length && (equal_set keys1, keys2)
    vals1 = (o_map o1, keys1)
    vals2 = (o_map o2, keys1)
    (equal_array_start vals1, vals2)
  else
    false

equal_set = (keyset1, keyset2) ->
  [diff1, diff2] = (set_symmetric_difference keyset1, keyset2)
  (is_empty diff1) && (is_empty diff2)

equal_val = (v1, v2) ->
  v1 == v2

extend = (extended, extension) ->
  (assign Object.create(extended), extension)

flatten_path = (prop, obj, opts) ->
  opts ?= {inlude_root: false}
  res = opts.include_root && [obj] || []
  while (obj = obj[prop])
    res.push(obj)
  res


# flattens a tree-like structure into array
# Example:
#   struct =
#     { id: 'Zero'
#     , children:
#       [ {id: 1}, {id: 2} ] }
#   (flattenp 'children', struct)
#   # -> [ {id: 'Zero', children: [...] }, {id: 1}, {id: 2} ]
flattenp = (key, root, {include_root} = {include_root: true}) ->
  accumulator = include_root && [root] || []
  (flattenp_recursive key, root, accumulator)

flattenp_recursive = (key, root, accumulator) ->
  (push_all accumulator, root[key])
  if children = root[key]
    for son in children
      (flattenp_recursive key, son, accumulator)
  return accumulator

for_own = (fn, obj) ->
  a_each (keys obj), (key) ->
    (fn key, obj[key])
  return

index_by = (index_prop, list_to_index, accumulator = {}) ->
  for item in list_to_index
    accumulator[ item[index_prop] ] = item
  accumulator

interpose = (sep, coll) ->
  coll_len   = coll.length
  seps_count = coll_len - 1
  new_len = coll_len + seps_count
  new_res = (make_array new_len)
  #
  i_coll = -1
  i_res  = 0
  while ++i_coll < coll_len
    new_res[i_res] = coll[i_coll]
    if (i_res + 1) < new_len
      new_res[i_res + 1] = sep
    i_res += 2
  #
  new_res

intersection = (coll1, coll2, contains_fn = contains) ->
  a_filter coll1, (item) ->
    (contains_fn item, coll2)

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
  cur_key_idx = (count1 cur_keys)
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
        cur_key_idx = (count1 cur_keys)
    #
    while (is_zero cur_key_idx) && (not_empty call_stack)
      [cur_dst, cur_src, cur_keys, cur_key_idx] = call_stack.pop()
  #
  dst

merge_with = (fn, o1, o2) ->
  res = {}
  keyset = (unique (cat (keys o1), (keys o2)))
  for key in keyset
    v1 = o1[key]
    v2 = o2[key]
    #
    if v1 && v2
      res[key] = (fn v1, v2)
    else
      res[key] = v1 || v2
  res

# @param {object} obj
# @param {string} props...
omit = (obj, props) ->
  (omit_all obj, (rest arguments))

omit_all = (obj, props_arr) ->
  res   = {}
  for key, val of obj
    if (not_contains key, props_arr)
      res[key] = val
  res

o_for_own = (obj, fn) ->
  (for_own fn, obj)

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

# tests subject to match the criteria object
# (o_match {id: 3}, {id: 3, name: 'Katie'}) # true
# (o_match {id: 3}, {id: 1, name: 'Stacy'}) # false
o_match = (criteria_obj, subject) ->
  for key, val of criteria_obj
    if subject[key] != val
      return false
  true

o_set = (obj, key, val) ->
  obj[key] = val

pull = (key, hash) ->
  val = hash[key]
  delete hash[key]
  val

# @param {object} obj
# @param {string...} props
pick = (obj, props) ->
  (pick_all obj, (rest arguments))

# @param {object} obj
# @param array<string> props
pick_all = (obj, props) ->
  res = {}
  for prop in props
    if obj[prop] != undefined
      res[prop] = obj[prop]
  res

transform = (fn, obj, keys) ->
  keys &&
    (transform3 fn, obj, keys) ||
    (transform2 fn, obj)

transform2 = (fn, obj) ->
  for key, val of obj
    obj[key] = (fn val)
  obj

transform3 = (fn, obj, keys) ->
  for key in keys
    obj[key] = (fn obj[key])
  obj

update_in = (obj, key, update_fn) ->
  if (is_defined (val = obj[key]))
    obj[key] = (update_fn val)
  obj

vals = (hash) ->
  (o_map hash, (keys hash))

zip_obj = (keys, vals) ->
  obj = {}
  (each (partial o_set, obj), keys, vals)
  obj

# ============================================================
# CATEGORY: STRINGS
# ============================================================


# Маленький форматтер строк:
# (format "My name is {0}, I drink {1}", "Ivan", "coffee")
# -> My name is Ivan, I drink coffee
format = (template_str) ->
  args = (rest arguments)
  template_str.replace /{(\d+)}/g, (match, number) ->
    (typeof args[number] != 'undefined') && args[number] || match

head = (chars_to_take, str) ->
  str.substr(0, chars_to_take)

match = (regexp, source_str) ->
  source_str.match(regexp)

matches = (regexp, str) ->
  if 'string' == (type_of regexp)
    (mk_regexp regexp).test(str)
  else
    regexp.test(str)

comma = ->
  (str_join ',', (slice arguments))

space = ->
  (str_join ' ', (slice arguments))

# Joins incoming strings into single one
str = ->
  (str_join '', (slice arguments))

str_breplace = (map, str) ->
  regex = (mk_regexp (str_join '|', (keys map)), 'ig')
  #
  str.replace regex, (seq) ->
    map[seq] || seq

str_join = (join_string, array_to_join) ->
  array_to_join.join(join_string)

str_split = (split_str, string_to_split) ->
  string_to_split.split(split_str)

tail = (chars_to_drop, str) ->
  str.substr(chars_to_drop)

trim = (str) ->
  str.trim()


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
  switch arguments.length
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
@param root {hash} a tree whose children lie in the children
  list (i.e. ordered collection).
@param depth: indicates depth of recursion
###
recurse = (fn, root, depth = 0) ->
  { children } = root
  depth++
  for son, idx in children
    (fn son, root, idx, depth)
  for son in children
    (recurse fn, son, depth)
  root

sum2 = (a, b) ->
  a + b

a_sum = (partial reduce, sum2, 0)

set = (prop_name, val, hash) ->
  hash[prop_name] = val

time = (fn) ->
  time_start = Date.now()
  fn()
  time_end   = Date.now()
  time_end - time_start

# EXPORTS
exports = ("undefined" != typeof module) && module.exports || {}
#
exports.Reduced           = Reduced
#
exports.a_contains        = a_contains
exports.a_each            = a_each
exports.a_filter          = a_filter
exports.a_find_index      = a_find_index
exports.a_index_of        = a_index_of
exports.a_map             = a_map
exports.a_reduce          = a_reduce
exports.a_reject          = a_reject
exports.a_sum             = a_sum
exports.and2              = and2
exports.add2              = add2
exports.any               = any
exports.assign            = assign
exports.assign_keys       = assign_keys
exports.apply             = apply
exports.bind              = bind
exports.bind_all          = bind_all
exports.butlast           = butlast
exports.cat               = cat
exports.clone             = clone
exports.cloneassign       = cloneassign
exports.clonedeep         = clonedeep
exports.clonedeep2        = _clonedeep2
exports.comma             = comma
exports.compact           = compact
exports.compose           = compose
exports.complement        = complement
exports.concat            = cat
exports.contains          = contains
exports.count             = count
exports.create            = create
exports.debug_wrap        = debug_wrap
exports.debounce          = debounce
exports.dec               = dec
exports.defaults          = defaults
exports.delay             = delay
exports.detect            = find
exports.diff              = difference
exports.difference        = difference
exports.difference_sets   = difference_sets
exports.drop              = drop
exports.drop_last         = drop_last
exports.each              = each
exports.each_idx          = each_idx
exports.equal             = equal
exports.equal_array_start = equal_array_start
exports.equal_val         = equal_val
exports.equal_set         = equal_set
exports.every             = every
exports.extend            = extend
exports.fastbind          = bind
exports.first             = first
exports.filter            = filter
exports.filter_fn         = filter_fn
exports.filter_obj        = filter_obj
exports.filter_obj_1kv    = filter_obj_1kv
exports.filter_obj_2kv    = filter_obj_2kv
exports.filter_prop       = filter_prop
exports.filter_re         = filter_re
exports.find              = find
exports.find_index        = find_index
exports.find_index_fn     = find_index_fn
exports.find_index_prop   = find_index_prop
exports.find_index_obj_1kv = find_index_obj_1kv
exports.find_index_obj_2kv = find_index_obj_2kv
exports.find_index_obj    = find_index_obj
exports.find_index_last   = find_index_last
exports.flatten           = flatten
exports.flattenp          = flattenp
exports.flatten_path      = flatten_path
exports.flow              = flow
exports.for_own           = for_own
exports.format            = format
exports.get               = read
exports.check_keys        = check_keys
exports.head              = head
exports.inc               = inc
exports.index_by          = index_by
exports.index_by_id       = (partial index_by, 'id')
exports.index_of          = index_of
exports.insert_at         = insert_at
exports.intersection      = intersection
exports.interpose         = interpose
exports.interval          = set_interval
exports.invoke            = invoke
exports.invokem           = invokem
exports.is_array          = is_array
exports.is_boolean        = is_boolean
exports.is_date           = is_date
exports.is_defined        = is_defined
exports.is_empty          = is_empty
exports.is_empty$         = is_empty$
exports.is_even           = is_even
exports.is_function       = is_function
exports.is_mergeable      = is_mergeable
exports.is_number         = is_number
exports.is_object         = is_object
exports.is_plain_object   = is_plain_object
exports.is_string         = is_string
exports.is_subset         = is_subset
exports.is_zero           = is_zero
exports.jquery_wrap_to_array = jquery_wrap_to_array
exports.j2a               = jquery_wrap_to_array
exports.keys              = keys
exports.last              = last
exports.list              = list
exports.list_compact      = list_compact
exports.log_pipe          = log_pipe
exports.map               = map
exports.map_async         = map_async
exports.magic             = no_operation
exports.match             = match
exports.matches           = matches
exports.merge             = merge
exports.merge_with        = merge_with
exports.mk_regexp         = mk_regexp
exports.multicall         = multicall
exports.next              = next
exports.no_operation      = no_operation
exports.noop              = no_operation
exports.not_array         = not_array
exports.not_boolean       = not_boolean
exports.not_contains      = not_contains
exports.not_date          = not_date
exports.not_defined       = not_defined
exports.not_empty         = not_empty
exports.not_empty$        = not_empty$
exports.not_function      = not_function
exports.not_number        = not_number
exports.not_object        = not_object
exports.not_string        = not_string
exports.not_subset        = not_subset
exports.not_zero          = not_zero
exports.omit              = omit
exports.omit_all          = omit_all
exports.o_for_own         = o_for_own
exports.o_map             = o_map
exports.o_match           = o_match
exports.partial           = partial
exports.pbind             = pbind
exports.periodically      = periodically
exports.pt                = partial
exports.ptr               = partialr
exports.partialr          = partialr
exports.pick              = pick
exports.pick_all          = pick_all
exports.pipeline          = flow
exports.pluck             = pluck
exports.pluck_id          = (partial pluck, 'id')
exports.prev              = prev
exports.pull              = pull
exports.push              = push
exports.push_all          = push_all
exports.range             = range
exports.read              = read
exports.recurse           = recurse
exports.reduce            = reduce
exports.reducer           = reducer
exports.reject            = reject
exports.reject_fn         = reject_fn
exports.reject_obj        = reject_obj
exports.reject_obj_1kv    = reject_obj_1kv
exports.reject_obj_2kv    = reject_obj_2kv
exports.reject_prop       = reject_prop
exports.remap             = remap
exports.remove            = remove
exports.remove_at         = remove_at
exports.repeat            = repeat
exports.repeatf           = repeatf
exports.rest              = rest
exports.reverse           = reverse
exports.second            = second
exports.set               = set
exports.set_difference    = difference_sets
exports.set_symmetric_difference = set_symmetric_difference
exports.slice             = slice
exports.sort              = sort
exports.space             = space
exports.splice            = splice
exports.str               = str
exports.str_breplace      = str_breplace
exports.str_drop          = tail
exports.str_join          = str_join
exports.str_split         = str_split
exports.str_take          = head
exports.sum2              = sum2
exports.sum               = a_sum
exports.take              = take
exports.tail              = tail
exports.third             = third
exports.throttle          = throttle
exports.time              = time
exports.transform         = transform
exports.trim              = trim
exports.update_in         = update_in
exports.union             = union
exports.unique            = unique
exports.unshift           = unshift
exports.vals              = vals
exports.varynum           = varynum
exports.without           = without
exports.write             = write
exports.zip_obj           = zip_obj


exports
