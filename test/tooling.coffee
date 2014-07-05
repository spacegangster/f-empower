assert = require 'assert'
fn     = require 'f-empower'

{ bind
  partial } = fn

log     = (bind console.log, console)
testing = (partial log, "testing")
newline = log

print_json = (obj) ->
  console.log JSON.stringify(obj, null, 2)

equal      = assert.equal
equal_deep = assert.deepEqual

module.exports =
  { equal
    equal_deep
    log
    newline
    print_json
    testing }
