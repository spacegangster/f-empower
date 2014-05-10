// Generated by CoffeeScript 1.7.1

/*
  F-EMPOWER
  A set of functions to harness the power functional programming in JS.
  Author: Ivan Fedorov <sharp.maestro@gmail.com>
  License: MIT
 */
var wrapper,
  __slice = [].slice;

wrapper = function() {
  var Errors, a_contains, a_each, a_filter, a_index_of, a_map, a_reduce, a_reject, apply, assign, assign_one, bind, butlast, cat, clone, clone_obj, clonedeep, comma, compact, complement, compose, contains, count, dec, defaults, delay, drop, each, filter, filter_fn, filter_obj, filter_obj_1kv, filter_obj_2kv, filter_prop, find, find_index, find_index_fn, find_index_obj, find_index_obj_1kv, find_index_obj_2kv, find_index_prop, first, flow, head, inc, index_of, invoke, is_array, is_defined, is_empty, is_function, is_number, is_object, is_zero, jquery_wrap_to_array, keys, last, list, list_compact, map, match, merge, mk_regexp, multicall, native_concat, native_slice, no_operation, not_array, not_contains, not_defined, not_empty, not_function, not_number, not_object, not_zero, o_map, o_match, partial, partialr, pluck, prelast, pull, range, read, read_1kv, recurse, reduce, reduce_right, reject, reject_fn, reject_obj, reject_obj_1kv, reject_obj_2kv, reject_prop, remap, remove, remove_at, reverse, second, set, set_difference, set_symmetric_difference, slice, space, splice, str, str_breplace, str_join, str_split, tail, take, time, vals, varynum, _clonedeep, _clonedeep2;
  Errors = {
    NO_KEY_VALUE_PAIR_IN_HASH: new Error('No key value pair in a criterion hash'),
    NOT_FUNCTION: new TypeError('Something is not function'),
    UNEXPECTED_TYPE: new TypeError('Unexpected type')
  };
  native_concat = Array.prototype.concat;
  native_slice = Array.prototype.slice;
  slice = function(array_or_arguments, start_idx, end_idx) {
    return native_slice.call(array_or_arguments, start_idx, end_idx);
  };
  bind = function(fn, this_arg) {
    var other_args;
    other_args = slice(arguments, 2);
    return (count(arguments)) <= 2 && (function() {
      return fn.apply(this_arg, arguments);
    }) || (function() {
      return fn.apply(this_arg, other_args.concat(slice(arguments)));
    });
  };
  partial = function() {
    var args, fn;
    fn = arguments[0];
    args = slice(arguments, 1);
    return function() {
      return fn.apply(null, args.concat(slice(arguments)));
    };
  };
  apply = function(fn, args_list) {
    return fn.apply(this, args_list);
  };
  compose = function() {
    var functions, item, _i, _len;
    functions = arguments;
    for (_i = 0, _len = functions.length; _i < _len; _i++) {
      item = functions[_i];
      if (not_function(item)) {
        throw Errors.NOT_FUNCTION;
      }
    }
    return function() {
      var i, memo;
      memo = arguments;
      i = functions.length;
      while (--i >= 0) {
        memo = [functions[i].apply(null, memo)];
      }
      return first(memo);
    };
  };
  complement = function(predicate) {
    return function() {
      return !(apply(predicate, arguments));
    };
  };
  delay = function(delay_ms, fn) {
    return setTimeout(fn, delay_ms);
  };
  flow = function() {
    var functions, item, _i, _len;
    functions = arguments;
    for (_i = 0, _len = functions.length; _i < _len; _i++) {
      item = functions[_i];
      if (not_function(item)) {
        throw Errors.NOT_FUNCTION;
      }
    }
    return function() {
      var i, len, memo;
      memo = arguments;
      len = functions.length;
      i = -1;
      while (++i < len) {
        memo = [functions[i].apply(null, memo)];
      }
      return first(memo);
    };
  };
  multicall = function(fns) {
    fns = compact(fns);
    return function() {
      var fn, _i, _len;
      for (_i = 0, _len = functions.length; _i < _len; _i++) {
        fn = functions[_i];
        fn.apply(this, arguments);
      }
    };
  };
  no_operation = function() {};
  partialr = function(fn, right_args) {
    right_args = slice(arguments, 1);
    return function() {
      return apply(fn, cat(apply(list, arguments), right_args));
    };
  };
  is_array = Array.isArray;
  is_defined = function(subj) {
    return 'undefined' !== (typeof subj);
  };
  is_empty = function(seq) {
    return seq.length === 0;
  };
  is_function = function(candidate) {
    return 'function' === typeof candidate;
  };
  is_number = function(candidate) {
    return 'number' === typeof candidate;
  };
  is_object = function(candidate) {
    return 'object' === typeof candidate;
  };
  is_zero = function(candidate) {
    return candidate === 0;
  };
  not_array = complement(is_array);
  not_defined = complement(is_defined);
  not_empty = complement(is_empty);
  not_function = complement(is_function);
  not_number = complement(is_number);
  not_object = complement(is_object);
  not_zero = complement(is_zero);
  butlast = function(array) {
    return slice(array, 0, array.length - 1);
  };
  cat = function(array) {
    return native_concat.apply(array, slice(arguments, 1));
  };
  contains = function(searched_item, array) {
    var item, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (searched_item === item) {
        return true;
      }
    }
    return false;
  };
  a_contains = function(array, searched_item) {
    var item, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (searched_item === item) {
        return true;
      }
    }
    return false;
  };
  a_each = function(array, fn) {
    return each(fn, array);
  };
  a_filter = function(array, fn) {
    return filter(fn, array);
  };
  a_index_of = function(array, item) {
    return array.indexOf(item);
  };
  a_map = function(array, fn) {
    return map(fn, array);
  };
  a_reduce = function(array, fn, val) {
    return reduce(fn, val, array);
  };
  a_reject = function(array, fn) {
    return reject(fn, array);
  };
  compact = function(coll) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = coll.length; _i < _len; _i++) {
      item = coll[_i];
      if (item) {
        _results.push(item);
      }
    }
    return _results;
  };
  count = function(array) {
    return array.length;
  };
  drop = function(items_number_to_drop, array_like) {
    return slice(array_like, items_number_to_drop);
  };
  each = function(fn, array) {
    var item, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      fn(item);
    }
  };
  first = function(array) {
    return array[0];
  };
  filter_fn = function(fn, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (fn(item)) {
        _results.push(item);
      }
    }
    return _results;
  };
  filter_prop = function(prop_name, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (!!item[prop_name]) {
        _results.push(item);
      }
    }
    return _results;
  };
  filter_obj_1kv = function(obj, array) {
    var item, key, val, _i, _len, _ref, _results;
    _ref = read_1kv(obj), key = _ref[0], val = _ref[1];
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item[key] === val) {
        _results.push(item);
      }
    }
    return _results;
  };
  filter_obj_2kv = function(obj, array) {
    var item, key1, key2, val1, val2, _i, _len, _ref, _ref1, _results;
    _ref = keys(obj), key1 = _ref[0], key2 = _ref[1];
    _ref1 = [obj[key1], obj[key2]], val1 = _ref1[0], val2 = _ref1[1];
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item[key1] === val1 && item[key2] === val2) {
        _results.push(item);
      }
    }
    return _results;
  };
  filter_obj = function(obj, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (o_match(obj, item)) {
        _results.push(item);
      }
    }
    return _results;
  };
  filter = function(some_criteria, array) {
    switch (typeof some_criteria) {
      case "string":
        return filter_prop(some_criteria, array);
      case "function":
        return filter_fn(some_criteria, array);
      case "object":
        switch (count(keys(some_criteria))) {
          case 0:
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
            break;
          case 1:
            return filter_obj_1kv(some_criteria, array);
          case 2:
            return filter_obj_2kv(some_criteria, array);
          default:
            return filter_obj(some_criteria, array);
        }
        break;
      default:
        throw Errors.UNEXPECTED_TYPE;
    }
  };
  find_index_fn = function(fn, array) {
    var idx, item, _i, _len;
    for (idx = _i = 0, _len = array.length; _i < _len; idx = ++_i) {
      item = array[idx];
      if (fn(item)) {
        return idx;
      }
    }
    return -1;
  };
  find_index_prop = function(prop_name, array) {
    var idx, item, _i, _len;
    for (idx = _i = 0, _len = array.length; _i < _len; idx = ++_i) {
      item = array[idx];
      if (item[prop_name]) {
        return idx;
      }
    }
    return -1;
  };
  find_index_obj_1kv = function(obj_with_1kv_pair, array) {
    var idx, item, key, val, _i, _len, _ref;
    _ref = read_1kv(obj_with_1kv_pair), key = _ref[0], val = _ref[1];
    for (idx = _i = 0, _len = array.length; _i < _len; idx = ++_i) {
      item = array[idx];
      if (item[key] === val) {
        return idx;
      }
    }
    return -1;
  };
  find_index_obj_2kv = function(obj_with_2kv_pair, array) {
    var idx, item, key1, key2, val1, val2, _i, _len, _ref, _ref1;
    _ref = keys(obj_with_2kv_pair), key1 = _ref[0], key2 = _ref[1];
    _ref1 = [obj_with_2kv_pair[key1], obj_with_2kv_pair[key2]], val1 = _ref1[0], val2 = _ref1[1];
    for (idx = _i = 0, _len = array.length; _i < _len; idx = ++_i) {
      item = array[idx];
      if (item[key1] === val1 && item[key2] === val2) {
        return idx;
      }
    }
    return -1;
  };
  find_index_obj = function(obj, array) {
    var idx, item, _i, _len;
    for (idx = _i = 0, _len = array.length; _i < _len; idx = ++_i) {
      item = array[idx];
      if (o_match(obj, item)) {
        return idx;
      }
    }
    return -1;
  };
  find_index = function(some_criteria, array) {
    switch (typeof some_criteria) {
      case "string":
        return find_index_prop(some_criteria, array);
      case "function":
        return find_index_fn(some_criteria, array);
      case "object":
        switch (count(keys(some_criteria))) {
          case 0:
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
            break;
          case 1:
            return find_index_obj_1kv(some_criteria, array);
          case 2:
            return find_index_obj_2kv(some_criteria, array);
          default:
            return find_index_obj(some_criteria, array);
        }
        break;
      default:
        throw Errors.UNEXPECTED_TYPE;
    }
  };
  find = function(some_criteria, array) {
    var item_idx;
    item_idx = find_index(some_criteria, array);
    if (item_idx === -1) {
      return;
    }
    return read(item_idx, array);
  };
  index_of = function(item, array) {
    return array.indexOf(item);
  };
  last = function(list) {
    return list[list.length - 1];
  };
  list = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return args;
  };
  list_compact = function() {
    var arg, result, _i, _len;
    result = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      if (!!arg) {
        result.push(arg);
      }
    }
    return result;
  };
  map = function(fn, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      _results.push(fn(item));
    }
    return _results;
  };
  not_contains = complement(contains);
  prelast = function(array) {
    return array[(count(array)) - 2];
  };
  reduce = function(fn, val, array) {
    var idx;
    idx = -1;
    if (!array && (is_array(val))) {
      array = val;
      val = fn(first(array), second(array));
      idx = 1;
    }
    while (++idx < array.length) {
      val = fn(val, array[idx]);
    }
    return val;
  };
  reduce_right = function(fn, val, array) {
    var idx;
    idx = count(array);
    if (!array && (is_array(val))) {
      array = val;
      val = fn(last(array), prelast(array));
      idx = idx - 2;
    }
    while (--idx >= 0) {
      val = fn(val, array[idx]);
    }
    return val;
  };
  reject_fn = function(fn, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (!(fn(item))) {
        _results.push(item);
      }
    }
    return _results;
  };
  reject_prop = function(prop_name, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (!item[prop_name]) {
        _results.push(item);
      }
    }
    return _results;
  };
  reject_obj_1kv = function(one_kv_pair_object, array) {
    var item, key, val, _i, _len, _ref, _results;
    _ref = read_1kv(one_kv_pair_object), key = _ref[0], val = _ref[1];
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (item[key] !== val) {
        _results.push(item);
      }
    }
    return _results;
  };
  reject_obj_2kv = function(two_kv_pairs_object, array) {
    var item, key1, key2, val1, val2, _i, _len, _ref, _ref1, _results;
    _ref = keys(two_kv_pairs_object), key1 = _ref[0], key2 = _ref[1];
    _ref1 = [two_kv_pairs_object[key1], two_kv_pairs_object[key2]], val1 = _ref1[0], val2 = _ref1[1];
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (!(item[key1] === val1 && item[key2] === val2)) {
        _results.push(item);
      }
    }
    return _results;
  };
  reject_obj = function(object, array) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      if (!(o_match(object, item))) {
        _results.push(item);
      }
    }
    return _results;
  };
  reject = function(some_criteria, array) {
    switch (typeof some_criteria) {
      case "string":
        return reject_prop(some_criteria, array);
      case "function":
        return reject_fn(some_criteria, array);
      case "object":
        switch (count(keys(some_criteria))) {
          case 0:
            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
            break;
          case 1:
            return reject_obj_1kv(some_criteria, array);
          case 2:
            return reject_obj_2kv(some_criteria, array);
          default:
            return reject_obj(some_criteria, array);
        }
        break;
      default:
        throw Errors.UNEXPECTED_TYPE;
    }
  };
  remap = function(fn, arr) {
    var item, item_idx, _i, _len;
    for (item_idx = _i = 0, _len = arr.length; _i < _len; item_idx = ++_i) {
      item = arr[item_idx];
      arr[item_idx] = fn(item);
    }
    return arr;
  };
  remove = function(item, arr) {
    var idx;
    idx = index_of(item, arr);
    return idx !== -1 && (remove_at(idx, arr));
  };
  remove_at = function(idx, arr) {
    return splice(arr, idx, 1);
  };
  reverse = bind(Function.prototype.call, Array.prototype.reverse);
  splice = bind(Function.prototype.call, Array.prototype.splice);
  second = function(array) {
    return array[1];
  };
  set_difference = function(set_a, set_b) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = set_a.length; _i < _len; _i++) {
      item = set_a[_i];
      if (not_contains(item, set_b)) {
        _results.push(item);
      }
    }
    return _results;
  };
  set_symmetric_difference = function(set_a, set_b) {
    return [set_difference(set_a, set_b), set_difference(set_b, set_a)];
  };
  take = function(items_number_to_take, array_like) {
    return slice(array_like, 0, items_number_to_take);
  };
  invoke = function(method_name, coll) {
    var args_count, item, method_args, results, _i, _j, _len, _len1;
    results = [];
    args_count = count(arguments);
    if (args_count >= 3) {
      method_args = slice(arguments, 1, args_count - 1);
      coll = last(arguments);
      for (_i = 0, _len = coll.length; _i < _len; _i++) {
        item = coll[_i];
        results.push(item[method_name].apply(item, method_args));
      }
    } else {
      for (_j = 0, _len1 = coll.length; _j < _len1; _j++) {
        item = coll[_j];
        results.push(item[method_name]());
      }
    }
    return results;
  };
  pluck = function(prop_name, coll) {
    return map(partial(read, prop_name), coll);
  };
  varynum = function(numbers, start_with_one) {
    var number, variator, _i, _len, _results;
    variator = start_with_one && -1 || 1;
    _results = [];
    for (_i = 0, _len = numbers.length; _i < _len; _i++) {
      number = numbers[_i];
      variator *= -1;
      _results.push(number * variator);
    }
    return _results;
  };
  assign = function(dest, sources) {
    if (dest == null) {
      dest = {};
    }
    sources = drop(1, arguments);
    each(partial(assign_one, dest), sources);
    return dest;
  };
  assign_one = function(dest, src) {
    var key, val, _results;
    _results = [];
    for (key in src) {
      val = src[key];
      _results.push(dest[key] = val);
    }
    return _results;
  };
  clone_obj = function(obj) {
    var key, res, val;
    res = {};
    for (key in obj) {
      val = obj[key];
      res[key] = val;
    }
    return res;
  };
  clone = function(data) {
    if (is_object(data)) {
      if (is_array(data)) {
        return slice(data);
      } else {
        return clone_obj(data);
      }
    } else {
      throw Errors.UNEXPECTED_TYPE;
    }
  };
  clonedeep = function(src) {
    var dst, stack_dst, stack_src;
    return _clonedeep(src, dst = (is_array(src)) && [] || {}, stack_dst = [dst], stack_src = [src]);
  };
  _clonedeep = function(src, dst, stack_dst, stack_src) {
    var child_dst, key, val, val_idx;
    for (key in src) {
      val = src[key];
      if (not_object(val)) {
        dst[key] = val;
      } else {
        val_idx = index_of(val, stack_src);
        if (val_idx === -1) {
          dst[key] = child_dst = (is_array(val)) && [] || {};
          stack_src.push(val);
          stack_dst.push(child_dst);
          _clonedeep(val, child_dst, stack_dst, stack_src);
        } else {
          dst[key] = stack_dst[val_idx];
        }
      }
    }
    return dst;
  };
  _clonedeep2 = function(src) {
    var child_dst, cur_dst, cur_key_idx, cur_keys, cur_src, dst, key, stack_act, stack_dst, stack_src, val, val_idx, _ref;
    dst = (is_array(src)) && [] || {};
    cur_src = src;
    cur_dst = dst;
    stack_src = [src];
    stack_dst = [dst];
    stack_act = [];
    cur_keys = (is_array(cur_src)) && (range(count(cur_src))) || (reverse(keys(cur_src)));
    cur_key_idx = count(cur_keys);
    while (--cur_key_idx >= 0) {
      key = cur_keys[cur_key_idx];
      val = cur_src[key];
      if (not_object(val)) {
        cur_dst[key] = val;
      } else {
        val_idx = index_of(val, stack_src);
        if (val_idx === -1) {
          child_dst = (is_array(val)) && [] || {};
          cur_dst[key] = child_dst;
          stack_act.push([cur_src, cur_dst, cur_keys, cur_key_idx]);
          cur_src = val;
          cur_dst = child_dst;
          cur_keys = (is_array(cur_src)) && (range(count(cur_src))) || (reverse(keys(cur_src)));
          cur_key_idx = count(cur_keys);
          stack_src.push(cur_src);
          stack_dst.push(cur_dst);
        } else {
          cur_dst[key] = stack_dst[val_idx];
        }
      }
      while ((is_zero(cur_key_idx)) && (not_zero(count(stack_act)))) {
        _ref = stack_act.pop(), cur_src = _ref[0], cur_dst = _ref[1], cur_keys = _ref[2], cur_key_idx = _ref[3];
      }
    }
    return dst;
  };
  defaults = function(dest, source) {
    var key, val;
    if (dest == null) {
      dest = {};
    }
    for (key in source) {
      val = source[key];
      if ('undefined' === typeof dest[key]) {
        dest[key] = val;
      }
    }
    return dest;
  };
  keys = function(hash) {
    return Object.keys(hash);
  };
  merge = function(dst, src) {
    var call_stack, cur_dst, cur_key_idx, cur_keys, cur_src, key, src_stack, val, val_idx, _ref;
    call_stack = [];
    src_stack = [];
    cur_dst = dst;
    cur_src = src;
    cur_keys = keys(src);
    cur_key_idx = count(cur_keys);
    while (--cur_key_idx >= 0) {
      key = cur_keys[cur_key_idx];
      val = cur_src[key];
      if ((not_defined(dst[key])) || (not_object(val))) {
        dst[key] = val;
        if (is_object(val)) {
          src_stack.push(val);
        }
      } else {
        val_idx = index_of(val, src_stack);
        if (val_idx === -1) {
          call_stack.push([cur_dst, cur_src, cur_keys, cur_key_idx]);
          src_stack.push(cur_src);
          cur_dst = cur_dst[key];
          cur_src = cur_src[key];
          cur_keys = keys(cur_src);
          cur_key_idx = count(cur_keys);
        } else {

        }
      }
      while ((is_zero(cur_key_idx)) && (not_empty(call_stack))) {
        _ref = call_stack.pop(), cur_dst = _ref[0], cur_src = _ref[1], cur_keys = _ref[2], cur_key_idx = _ref[3];
      }
    }
    return dst;
  };
  o_map = function(hash, keys_list) {
    var key, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = keys_list.length; _i < _len; _i++) {
      key = keys_list[_i];
      _results.push(hash[key]);
    }
    return _results;
  };
  o_match = function(criteria_obj, matched) {
    var key, val;
    for (key in criteria_obj) {
      val = criteria_obj[key];
      if (matched[key] !== val) {
        return false;
      }
    }
    return true;
  };
  pull = function(prop_name, hash) {
    var val;
    val = hash[prop_name];
    delete hash[prop_name];
    return val;
  };
  vals = function(hash) {
    return o_map(hash, keys(hash));
  };
  head = function(chars_to_take, str) {
    return str.substr(0, chars_to_take);
  };
  match = function(source_str, regexp) {
    return source_str.match(regexp);
  };
  comma = function() {
    return str_join(',', slice(arguments));
  };
  space = function() {
    return str_join(' ', slice(arguments));
  };
  str = function() {
    return str_join('', slice(arguments));
  };
  str_breplace = function(map, str) {
    var regex;
    regex = mk_regexp(str_join('|', keys(map)), 'ig');
    return str.replace(regex, function(seq) {
      return map[seq] || seq;
    });
  };
  str_join = function(join_string, array_to_join) {
    return array_to_join.join(join_string);
  };
  str_split = function(split_str, string_to_split) {
    return string_to_split.split(split_str);
  };
  tail = function(chars_to_drop, str) {
    return str.substr(chars_to_drop);
  };
  dec = function(num) {
    return num - 1;
  };
  inc = function(num) {
    return num + 1;
  };
  jquery_wrap_to_array = function(jquery_wrap) {
    var i, wrap_len, _results;
    wrap_len = jquery_wrap.length;
    i = -1;
    _results = [];
    while (++i < wrap_len) {
      _results.push(jquery_wrap.eq(i));
    }
    return _results;
  };
  mk_regexp = function(rx_str, rx_settings) {
    rx_settings = rx_settings || "";
    return new RegExp(rx_str, rx_settings);
  };
  range = function(length) {
    var array;
    array = new Array(length);
    while (--length >= 0) {
      array[length] = length;
    }
    return array;
  };
  read = function(prop_name, hash) {
    return hash[prop_name];
  };
  read_1kv = function(obj_with_1kv_pair) {
    var key;
    key = first(keys(obj_with_1kv_pair));
    return [key, read(key, obj_with_1kv_pair)];
  };

  /*
  This is a function that iterates with another function 
  over the nodes of a tree structure.
  @param func {function} function that operates on the node.
    signature: son, parent, son_idx, depth
  @param root {hash} a tree whose children lie in the sons
    list (i.e. ordered collection).
  @param depth: indicates depth of recursion
   */
  recurse = function(func, root, depth) {
    var idx, son, sons, _i, _j, _len, _len1;
    if (depth == null) {
      depth = 0;
    }
    sons = root.sons;
    for (idx = _i = 0, _len = sons.length; _i < _len; idx = ++_i) {
      son = sons[idx];
      func(son, root, idx, depth + 1);
    }
    for (_j = 0, _len1 = sons.length; _j < _len1; _j++) {
      son = sons[_j];
      recurse(func, son, depth + 1);
    }
    return root;
  };
  set = function(prop_name, val, hash) {
    return hash[prop_name] = val;
  };
  time = function(fn) {
    var time_end, time_start;
    time_start = Date.now();
    fn();
    time_end = Date.now();
    return time_end - time_start;
  };
  return {
    a_contains: a_contains,
    a_each: a_each,
    a_filter: a_filter,
    a_index_of: a_index_of,
    a_map: a_map,
    a_reduce: a_reduce,
    a_reject: a_reject,
    assign: assign,
    apply: apply,
    bind: bind,
    butlast: butlast,
    cat: cat,
    clone: clone,
    clonedeep: clonedeep,
    clonedeep2: _clonedeep2,
    comma: comma,
    compact: compact,
    compose: compose,
    complement: complement,
    concat: cat,
    contains: contains,
    count: count,
    dec: dec,
    defaults: defaults,
    delay: delay,
    detect: find,
    drop: drop,
    each: each,
    extend: assign,
    fastbind: bind,
    flow: flow,
    first: first,
    filter: filter,
    filter_fn: filter_fn,
    filter_obj: filter_obj,
    filter_obj_1kv: filter_obj_1kv,
    filter_obj_2kv: filter_obj_2kv,
    filter_prop: filter_prop,
    find: find,
    find_index: find_index,
    find_index_fn: find_index_fn,
    find_index_prop: find_index_prop,
    find_index_obj_1kv: find_index_obj_1kv,
    find_index_obj_2kv: find_index_obj_2kv,
    find_index_obj: find_index_obj,
    get: read,
    head: head,
    inc: inc,
    index_of: index_of,
    invoke: invoke,
    is_array: is_array,
    is_defined: is_defined,
    is_empty: is_empty,
    is_function: is_function,
    is_number: is_number,
    is_object: is_object,
    is_zero: is_zero,
    jquery_wrap_to_array: jquery_wrap_to_array,
    keys: keys,
    last: last,
    list: list,
    list_compact: list_compact,
    map: map,
    match: match,
    merge: merge,
    mk_regexp: mk_regexp,
    multicall: multicall,
    no_operation: no_operation,
    noop: no_operation,
    not_array: not_array,
    not_defined: not_defined,
    not_empty: not_empty,
    not_function: not_function,
    not_number: not_number,
    not_object: not_object,
    not_zero: not_zero,
    o_map: o_map,
    o_match: o_match,
    partial: partial,
    partialr: partialr,
    pipeline: flow,
    pluck: pluck,
    pull: pull,
    read: read,
    recurse: recurse,
    reduce: reduce,
    reject: reject,
    reject_fn: reject_fn,
    reject_obj: reject_obj,
    reject_obj_1kv: reject_obj_1kv,
    reject_obj_2kv: reject_obj_2kv,
    reject_prop: reject_prop,
    remap: remap,
    remove: remove,
    remove_at: remove_at,
    reverse: reverse,
    second: second,
    set: set,
    set_difference: set_difference,
    set_symmetric_difference: set_symmetric_difference,
    slice: slice,
    space: space,
    splice: splice,
    str: str,
    str_breplace: str_breplace,
    str_join: str_join,
    str_split: str_split,
    take: take,
    tail: tail,
    time: time,
    vals: vals,
    varynum: varynum
  };
};

if (('undefined' !== typeof define) && define.amd) {
  define(wrapper);
} else if (('undefined' !== typeof module) && module.exports) {
  module.exports = wrapper();
}
