# f-empower
#### Utility belt inspired by Clojure

Over 200 functions for hashes, arrays, sets and functions. Written with V8's optimizing compiler (Crankshaft) in mind (functional monomorphism
is emphasized where possible).

Inspired by Clojure standard library functions and Underscore.

Only 7.2k when minified and gzipped (6.3k for Brotli). Tree-shaking-ready.

CommonJS and AMD loaders are supported.


## Install
#### using npm
`npm install -s f-empower`


## Usage
Master file is only compatible with ES modules. But allows patch imports and
effective dead code elimination.
For UMD build please use f-empower.umd.js file.

### ES Modules
```js
import { map, range } from 'f-empower'

const ids   = range(1, 6, 2)
const names = ['Joe', 'Jane', 'Alex']
const flowers = ['Rose', 'Iris', 'Sunflower', 'Cactus']

map(Array, ids, names, flowers) // yields
[ [1, 'Joe' , 'Rose'     ],
  [3, 'Jane', 'Iris'     ],
  [5, 'Alex', 'Sunflower'] ]
// note, that cactus is not used

```
### AMD (~ RequireJS)
```coffee
require.config
  paths:
    'f-empower': 'path/to/f-empower/dist/f-empower'

define [ 'f-empower' ], (functions) ->
  { apply
    bind }  = functions
  array1 = [ 1, 2, 3 ]
  push_to_array1 = (bind array1.push, array1)

  (apply push_to_array1, [ 4, 5, 6 ])
  console.log(array1) # -> [ 1, 2, 3, 4, 5, 6 ]
```
### Browser raw (badly supported, not recommended, questionable)
```html
<!-- including this -->
<script src='path/to/f-empower/dist-cj/f-empower'></script>
<!-- gives you exports object with all of the functions -->
<!-- and a lot of global pollution -->
<script>
console.log(typeof exports.map)
// function
</script>
```
However you could use AMD module from `dist/f-empower`,
you just need to define a `define` function before it

## Compared to Underscore / Lodash
As a new thing f-empower doesn't have the functional multitude of Lodash or Underscore.
This is not (and won't be) a template library. Although it has `jquery_wrap_to_array` 
which converts a jQuery wrap, into array of jQuery wraps.

It is not so polished in terms of speed as Lodash. Although it respects functional 
monomorphism.

It is much closer to Clojure, though here is no lazyness or immutability.

### Features not in Underscore
- `map`, `each`. `map` and `each` work with arbitrary number of arrays.
- `clonedeep2`, `merge` -- operate on deep structures, staying non-recursive.

## TODO
- Bencharks
- More tests
- Modularization:
  - Define a smaller core set of functions
  - Write new modules
- Further optmization for V8 and Crankshaft

## Function index
### Array
- a_contains   : (arr, item) array first `contains`, like in underscore, tests reference equality
- a_each       : (arr, fn) array first `each`, works with only one collection
- a_find_index : (arr, pred) array first `find_index`
- a_filter     : (arr, fn) array first `filter`
- a_map        : (arr, fn) array first `map`, works with only one collection
- a_reduce     : (arr, fn) | (arr, fn, val) array first `reduce`
- a_reject     : (arr, fn) array first `reject`
- a_sum        : (Array<number>) sum of array
- butlast      : (arr) slice all but last elements of array
- cat          : (arrays..) concatenate arrays
- compact      : (arr) returns new version of the array without elements that evaluate to falsee
- contains     : (item, arr) tests array if it contains the item
- count        : (array_like) reads `length` property of something, or counts keys of the object
- drop         : (x, arr) drops first x items from array
- each         : (fn, arr...)
- filter       : (criteria(fn/obj/string), arr)
- filter       : (regexp, string_arr) takes all strings from string_arr that match regexp
- find         : (pred, arr)
- find_index   : (pred, arr)
- find_index_last: (pred, arr)
- first        : (arr)
- index_of     : (item, arr)
- last         : (arr) returns last item from array
- list         : (items...) returns an array composed from items, like `Array(1, 2, 3) # -> [1, 2, 3]`
- list_compact : list and compact functions composed. Equal to (compact (list args...))
- map          : (fn, arrs...) map that works with arbitrary number of arrays
- map          : (str, arr) @see pluck
- map          : (obj, array_of_keys) @see o_map
```coffeescript
map(
    Array,
    [0, 1, 2, 3],
    ['zero', 'one' , 'two', 'three'], # en
    ['ноль', 'один', 'два', 'три'  ], # ru
    ['zero', 'uno' , 'due', 'tre'  ]  # it
)
# [ [ 0, 'zero ', 'ноль', 'zero' ],
#   [ 1, 'one'  , 'один', 'uno'  ],
#   [ 2, 'two'  , 'два' , 'due'  ],
#   [ 3, 'three', 'три' , 'tre'  ] ]
```

- map_async    : (map_fn, arr, on_res)
- push         : (arr, item)
- push_all     : (dest_arr, array_to_push) -- pushes one array to another
- reduce       : (fn, arr) | (fn, val, arr)
```coffeescript
reduce(and2, true, [true, null, false]) # false
reduce(sum2, [1, 2, 3]) # 6

reduce(bind(console.log, console), [1, 2, 3])
# 1 2
# undefined, 3
```

- reject       : (fn, arr)
- rest         : (arr) return all but first elements
- remap        : (fn, arr) rewrites each element in array, using fn
- remove       : (item, arr) removes item from array based on reference equality
- remove_at    : (idx, arr) removes and returns one element at specified index from array
- range        : (start_val, end_val, step)
- repeat       : (times, val)
- second       : (arr)
- set_difference : (arr1, arr2) -> items of first array which are not present in second array
- set_symmetric_difference (arr1, arr2) -> [(set_difference arr1, arr2), (set_difference arr2, arr1)]
- slice        : (arr [, start_idx, end_idx]) same as standard JS slice
- splice       : (arr [, start_idx, remove_count, new_elements...])
- sort         : (arr), (criterion {string, function}, arr) sorts items in array
- take         : (x, arr) takes first x items from array
- unshift      : (arr, item)
- union        : (set_arr1, set_arr2) - returns a new array that has all items from the first array, plus items from the second array, that are not in the former one


### Function
- apply        : (fn, args...) applies arguments to function
- bind         : (fn, this_arg) simplified bind function, like makeCallback in lodash or bindJS in Closure
```coffeescript
animals = []
populate_animals = bind(animals.push, animals)
populate_animals('cat', 'dog', 'monkey')
console.log(animals) # ['cat', 'dog', 'monkey']
```
- compose      : (fn...) composes functions
```coffeescript
square = (x) -> x * x
add2   = (x) -> x + 2
mult2  = (x) -> x * 2
all_math = compose(mult2, square, add2)
all_math( 0 ) # 8
# equivalent of
mult2( square( add2( 0 ) ) ) # 8 
```

- complement   : (predicate_fn) inverts predicate function
- debounce     : (debounce_timeout, fn)
- delay        : (fn) `setTimeout` with zero delay
- delay        : (delay_ms, fn) `setTimeout` with flipped signature
- multicall    : (fn...) returns a function that will call the all of the functions, when called
- partial      : (fn, args...)
- partialr     : (fn, args...) partial right
```coffee
map_my_set = partialr(map, [1, 2, 3], ['one', 'two', 'three'])
map_my_set(list) # [[1, 'one'], [2, 'two'], [3, 'three']]
```

- pbind        : (fn(x)) allows to use fn in a method-like fashion. Does it by passing `this`
as a first argument.
```coffee
shout_name = (girl_or_boy) ->
  alert(girl_or_boy.name + "!")

class Shouter
  constructor: (@name) ->
  shout_name: pbind( shout_name )

lisa = new Shouter('Lisa')
lisa.shout_name()
```

- pipeline     : (fn...) natural compose
```coffee
steps = pipeline(step1, step2, step3)
steps()
# equivalent:
step3( step2( step1() ) )
```
- pt           : short for partial
- throttle     : (throttle_ms, fn)
- no_operation : function that does nothing, and returns undefined
- noop -> no_operation


### Predicate
- and2         : (a, b) -> a && b
- is_array     : (item) predicate that tests if object is array
- is_defined   : (item)
- is_empty     : (array_like) checks some array like thing for length == 0
- is_even      : (number) checks number for being even
- is_function  : (item)
- is_number    : (item)
- is_object    : (item)
- is_plain_object : (item) tests item for being plain object. An object is plain when it's direct prototype is Object.
- is_zero      : (num)
- not_array    : antagonist for is_array
- not_defined  : antagonist for is_defined
- not_empty    : antagonist for is_empty
- not_function : antagonist for is_function
- not_number   : antagonist for is_number
- not_object   : antagonist for is_object
- not_zero     : antagonist for is_zero


### Collection
- invoke       : (method_name, arr) | (method_name, method_args..., arr)
```coffee
results = invoke('peace', {plant_flowers: true}, [soldier1, soldier1, soldier3])
# Equivalent of:
results =
  [ soldier1.peace({plant_flowers: true})
  , soldier2.peace({plant_flowers: true})
  , soldier3.peace({plant_flowers: true}) ]
```
- pluck        : (key, coll)
- write        : (dst_coll, prop_name, src_coll) for each item in dst_coll writes 
corresponding item from dst_coll as prop_name.

### Object
- assign       : (dest, src...) assigns all src objects to dest object
- assign_keys  : (keys_arr, dst, src)
- clone        : (item) shallow copy of the object
- clonedeep    : (item) deep clone for data structures, able to clone structures with circular references
- clonedeep2   : (item) deep clone without recursion, able to clone very deep structures with circular references
- defaults     : (dest, src...)
- extend       -> assign
- keys         : (obj) returns keys of object
- merge        : (dest, src) deep non-recursive merge of two objects
- merge_with   : (merge_fn, obj1, obj2)
- o_map        : (obj, keys_list) hash based mapping function `(o_map {age: 35}, ['age']) # -> [ 35 ]`
- o_match      : (criteria_object, matched_object) returns true if every property of the criteria_object is
equal to the corresponding property of the matched_object
- pull         : (key, obj) deletes the key from object and returns it
- read         : (key, obj) - will read a property with specified name
- recurse      : (fn(son, parent, son_idx, son_depth), root, depth) recurses a tree with fn, where children
are stored in `sons` array
- vals         : (obj) returns the list of object's values


### String
- comma        : (strings...)
- format       : (template_str, args...)
```javascript
format("My name is {0}, I drink", "Barbariana", "Ale")
"My name is Barbariana, I drink Ale"
```

- head         : (x, string) takes first x chars from string
- match        : (str, regexp)
- mk_regexp    : (regex_str, regex_options_str)
- space        : (strings...) join strings with a whitespace
- str          : (strings...) - join any number of strings into one
- str_breplace : (replace_map, string) - string bulk character replace.
```
en2ru_chars = { 'a': 'ф', 'b': 'и', 'f': 'а' }
en_str = 'bafbaffab'
str_breplace(en2ru_chars, en_str) # 'ифаифаафи'
```
- str_join     : (join_str, Array<string>)
- str_split    : (split_str, string_to_split)
- tail         : (x, string) drops first chars from string
- trim         : (str) removes leading and tailing whitespace

### Misc
- jquery_wrap_to_array : maps jquery wrapped array into array of jquery wrapped elements
property inside criteria_object.
- varynum      : (numbers_arr, start_with_one) returns a new array composed of members of numbers_arr
multiplied by -1 and 1 in turn
```
varynum([1, 2, 3, 4]) # [-1, 2, -3, 4]
```

## License : MIT
