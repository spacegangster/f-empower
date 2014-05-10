# F-EMPOWER
## A set of functions designed for composition
It makes your code leaner and easier to read, improves development speed 
and efficiency. Use it to precompile functions, or make partial functions 
before their usage. Written with V8's optimizing copiler (Crankshaft) 
in mind, so functional monomorphism is emphasized.

Includes nonrecursive deep cloning function (clonedeep2)

CommonJS and AMD loaders are supported


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

## F-EMPOWER vs ECMA 5 / underscore / lodash
### Map a collection of sads into doges
```coffeescript
# ECMA 5
# ... some battle logic, lots of code, etc ...
# ... and this is how you do it ...
doges = sads.map(turn_sad_into_doge)

# Lodash
# ... the same thing with lodash / underscore because ...
# ... their map function first argument is collection, not function ...
doges = _.map(sads, turn_sad_into_doge)

# f-empower 
# ... precompile function ...
map_sads_into_doges = (f.partial f.map, turn_sad_into_doge)
# ... some battle logics, lots of code, etc ...
doges = (map_sads_into_doges sads)
```
That's it. Less symbols, less code, less distraction when you read your code year after.

### Check if collection contains item
```coffeescript
# Plain JS
has_flaw = (coll) ->
  coll.indexOf('flaw') != -1
(has_flaw [ 'ok', 'good', 'flaw') # -> true

# Lodash
has_flaw = (_.partialRight _.contains, 'flaw')
(has_flaw [ 'ok', 'good', 'flaw']) # -> true

# f-empower
has_flaw = (f.partial f.contains, 'flaw')
(has_flaw ['ok', 'good', 'flaw']) # -> true
```

## Function index
- a_contains  : array first `contains`, like in underscore
- a_each      : array first `each`
- a_filter    : array first `filter`
- a_map       : array first `map`
- a_reduce    : (array, fn) | (array, fn, val) array first `reduce`
- a_reject    : array first `reject`
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
- defaults    : (dest, src)
- delay       : (delay_ms, fn) like set timeout, but the delay parameter is specified before fn
- drop        : (x, array) drops first x items from array
- each
- extend      -> assign
- fastbind    -> bind
- filter      : (criteria(fn/obj/string), array)
- first
- flow
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
- map
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
- read         : (prop_name, hash) - will read a property with specified name
- recurse
- reduce       : (fn, array) | (fn, val, array)
- reject       : (fn, array)
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
- varynum
- vals         : (hash) returns the list of object's values

## License : MIT
