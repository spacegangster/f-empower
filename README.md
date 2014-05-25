# F-EMPOWER
## Utility functions designed for functional programming and composition
Written with V8's optimizing copiler (Crankshaft) in mind (functional monomorphism is emphasized).
Inspired by Clojure and Underscore.
CommonJS and AMD loaders are supported.

## Install
`npm install f-empower`

## Use
### NodeJS
```coffeescript
functions = require "f-empower"
{ apply
  bind }  = functions
array1 = [ 1, 2, 3 ]
push_to_array1 = (bind array1.push, array1)

(apply push_to_array1, [ 4, 5, 6 ])
console.log(array1) # -> [ 1, 2, 3, 4, 5, 6 ]
```
### Browser (require.js)
```coffeescript
require.config
  paths:
    'f-empower': 'path/to/f-empower'

define [ 'f-empower' ], (functions) ->
  { apply
    bind }  = functions
  array1 = [ 1, 2, 3 ]
  push_to_array1 = (bind array1.push, array1)

  (apply push_to_array1, [ 4, 5, 6 ])
  console.log(array1) # -> [ 1, 2, 3, 4, 5, 6 ]
```

## Compared to Underscore / Lodash
As a new thing f-empower doesn't have the functional multitude of Lodash or Underscore.
This is not (and won't be) a template library. Although it has `jquery_wrap_to_array` 
which converts a jQuery wrap, into array of jQuery wraps.

It is not so polished in terms of speed as Lodash. Although it respects functional 
monomorphism.

It is much closer to Clojure.

### Features not in Underscore
map, each. `map` and `each` work with any number of arrays.
`clonedeep2`, `merge` -- operate on deep structures, staying non-recursive.

## Function index
- a_contains  : array first `contains`, like in underscore
- a_each      : array first `each`
- a_filter    : array first `filter`
- a_map       : array first `map`
- a_reduce    : (array, fn) | (array, fn, val) array first `reduce`
- a_reject    : array first `reject`
- a_sum
- and2        : (a, b) -> a && b
- apply       : (fn, args...) applies arguments to function
- assign      : (dest, src)
- bind        : (fn, this_arg) simplified bind function, like makeCallback in lodash or bindJS in Closure
- butlast     : (array) slice all but last elements of array
- cat
- clone
- clonedeep   : deep clone for data structures, able to clone structures with circular references
- clonedeep2  : deep clone without recursion, able to clone very deep structures with circular references
- compact     : (coll) returns new version of the collection without elements evaluating to falsee
- compose
- complement  : (predicate) inverts predicate
- contains
- count
- debounce    : (debounce_timeout, fn)
- defaults    : (dest, src)
- delay       : (delay_ms, fn) like `setTimeout`, but the delay parameter is specified before fn
- drop        : (x, array) drops first x items from array
- each
- extend      -> assign
- fastbind    -> bind
- filter      : (criteria(fn/obj/string), array)
- first
- flow        : natural compose
- jquery_wrap_to_array : maps jquery wrapped array into array of jquery wrapped elements
- head         : (x, string) takes first x chars from string
- index_of     : (item, array)
- invoke       : (method_name, method_args..., array)
- is_array     : predicate that tests if object is array
- is_defined
- is_empty     : (array_like) checks some array like thing for length == 0
- is_function
- is_number
- is_object
- is_zero      : (num)
- keys         : (object)
- last
- list         : returns a list composed from arguments, like `Array(1, 2, 3) # -> [1, 2, 3]`
- list_compact : list and compact functions composed. Equal to (compact (list args...))
- merge        : (dest, src) deep merge of two objects
- o_map        : (hash, keys_list) hash based mapping function `(o_map {age: 35}, ['age']) # -> [ 35 ]`
- o_match      : (criteria_object, matched_object) checks properties of matched_object to match every
property inside criteria_object.
- map          : (fn, arrs...)
- match
- mk_regexp
- multicall    : (functions...) returns a function that will call the all of the functions, when called
- no_operation : function that does nothing, and returns undefined
- noop -> no_operation
- not_array
- not_defined
- not_empty
- not_function
- not_number
- not_object
- not_zero
- partial      : (fn, args...)
- pipeline -> flow
- pluck        : (prop_name, coll)
- pull
- push
- range        : (start_val, end_val, step)
- read         : (prop_name, hash) - will read a property with specified name
- recurse
- reduce       : (fn, array) | (fn, val, array)
- reject       : (fn, array)
- repeat       : (times, val)
- rest         : (arr) return all but first elements
- remap
- remove       : (item, array) removes item from array based on reference equality
- remove_at    : (idx, array) removes and returns one element at specified index from array
- second
- set_difference
- set_symmetric_difference
- slice        : (array [, start_idx, end_idx]) same as standard JS slice
- space        : (strings...) join strings with a whitespace
- splice       : (array [, start_idx, remove_count, new_elements...])
- str          : (strings...) - join any number of strings into one
- str_breplace : (replace_map, string) - string bulk character replace.
Given english to russian characters map `{ 'a': 'ф', 'b': 'и', 'f': 'а' }`,
and string `'bafbaffab'` will output `'ифаифаафи'`.
- str_join
- str_split    : (split_str, string_to_split)
- take         : (x, array) takes first x items from array
- tail         : (x, string) drops first chars from string
- throttle     : (throttle_ms, fn)
- unshift
- varynum
- vals         : (hash) returns the list of object's values

## License : MIT
