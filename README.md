#F-EMPOWER
##A set of functions oriented towards functional composition
It makes your code lighter and easier to read, while improving performance.
Use it to precompile functions, or make partial functions before their usage.

The set is very small, and I use it WITH lodash.

CommonJS and AMD loaders are supported
No support for lots of runtime scenarios like lodash does

Prerequisites: 
  You understand CoffeeScript compilation well
  You are not a hater

##F-EMPOWER vs ECMA 5 / underscore / lodash
###Map a collection of sads into doges
```coffeescript
# ECMA 5
# ... some battle logics, lots of code, etc ...
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

###Check if collection contains item
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

##Function index
- apply
- bind
- each
- map
- partial
- str: (list_of_strings) - join list of strings with a whitespace into one string

## License : MIT
