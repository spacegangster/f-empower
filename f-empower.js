/**
 * F-EMPOWER
 * A set of functions to harness the power functional programming in JS.
 * Author: Ivan Fedorov <sharp.maestro@gmail.com>
 * License: MIT
 */

define(function() {
    "use strict";

    var slice1 = [].slice,
        hasOwnProperty = {}.hasOwnProperty

    var THRESHOLD_LARGE_ARRAY_SIZE = 64000

    var Errors = {
        NO_KEY_VALUE_PAIR_IN_HASH: new Error('No key value pair in a criterion hash'),
        NOT_FUNCTION: new TypeError('Something is not function'),
        UNEXPECTED_TYPE: new TypeError('Unexpected type')
    }

    function ReducedClass(val) {
        this.val = val
    }

    function Reduced(val) {
        return new ReducedClass(val)
    }

    var to_string = Object.prototype.toString,
        native_concat = Array.prototype.concat,
        native_index_of = Array.prototype.indexOf,
        native_slice = Array.prototype.slice,
        is_array = Array.isArray

    function slice(array_or_arguments, start_idx, end_idx) {
        return native_slice.call(array_or_arguments, start_idx, end_idx)
    }

    function bind(fn, this_arg) {
        return function() {
            return fn.apply(this_arg, arguments)
        }
    }

    function partial() {
        var args, fn
        fn = arguments[0]
        args = slice(arguments, 1)
        return function() {
            return fn.apply(null, args.concat(slice(arguments)))
        }
    }

    function apply(fn, args_list) {
        return fn.apply(this, args_list)
    }

    function add2(a, b) {
        return a + b
    }

    function and2(a, b) {
        return a && b
    }

    function and_r(a, b) {
        return (a && b) || Reduced(false)
    }

    function bind_all() {
        var props, this_arg
        props = butlast(arguments)
        this_arg = last(arguments)
        return a_each(props, function(prop) {
            return this_arg[prop] = bind(this_arg[prop], this_arg)
        })
    }

    function compose() {
        var functions, item, k, len3
        functions = arguments
        for (k = 0, len3 = functions.length; k < len3; k++) {
            item = functions[k]
            if (not_function(item)) {
                throw Errors.NOT_FUNCTION
            }
        }
        return function() {
            var i, memo
            memo = arguments
            i = functions.length
            while (--i >= 0) {
                memo = [functions[i].apply(null, memo)]
            }
            return first(memo)
        }
    }

    function complement(predicate) {
        return function() {
            return !(apply(predicate, arguments))
        }
    }

    function debounce(debounce_timeout, fn) {
        var exec, last_args, last_result, last_this, last_timeout_id
        if (arguments.length === 1) {
            fn = debounce_timeout
            debounce_timeout = 0
        }
        last_result = void 0
        last_args = null
        last_timeout_id = null
        last_this = null
        exec = function() {
            return last_result = fn.apply(last_this, last_args)
        }
        return function() {
            last_args = slice(arguments)
            last_this = this
            clearTimeout(last_timeout_id)
            last_timeout_id = delay(debounce_timeout, exec)
            return last_result
        }
    }

    function debug_wrap(fn) {
        return function() {
            debugger
            return fn.apply(null, arguments)
        }
    }

    function delay(delay_ms, fn) {
        if (arguments.length === 1) {
            fn = delay_ms
            delay_ms = 0
        }
        return setTimeout(fn, delay_ms)
    }

    function flow() {
        var functions, item, k, len3
        functions = arguments
        for (k = 0, len3 = functions.length; k < len3; k++) {
            item = functions[k]
            if (not_function(item)) {
                throw Errors.NOT_FUNCTION
            }
        }
        return function() {
            var i, len, memo
            memo = arguments
            len = functions.length
            i = -1
            while (++i < len) {
                memo = [functions[i].apply(null, memo)]
            }
            return first(memo)
        }
    }

    function multicall(fns) {
        fns = compact(fns)
        return function() {
            var fn, k, len3
            for (k = 0, len3 = fns.length; k < len3; k++) {
                fn = fns[k]
                fn.apply(this, arguments)
            }
        }
    }

    function no_operation() {}
    function partialr(fn, right_args) {
        right_args = slice(arguments, 1)
        return function() {
            return apply(fn, cat(apply(list, arguments), right_args))
        }
    }

    function periodically(interval, countdown, fn) {
        var interval_id
        if ((not_number(countdown)) || (countdown < 1)) {
            throw new Error("Bad countdown")
        }
        return interval_id = set_interval(interval, function() {
            fn()
            countdown = countdown - 1
            if (0 === countdown) {
                return clearInterval(interval_id)
            }
        })
    }

    function pbind(fn) {
        return function() {
            return fn.apply(null, cat([this], slice(arguments)))
        }
    }

    function set_interval(ms, fn) {
        if (!fn) {
            fn = ms
            ms = 0
        }
        return setInterval(fn, ms)
    }

    function throttle(throttle_millis, fn) {
        var last_args, last_result, locked, should_call
        locked = false
        should_call = false
        last_args = null
        last_result = null
        return function() {
            var void_main
            last_args = slice(arguments)
            if (locked) {
                should_call = true
                return last_result
            } else {
                locked = true
                last_result = fn.apply(null, last_args)
                void_main = function() {
                    return delay(throttle_millis, function() {
                        if (should_call) {
                            last_result = fn.apply(null, last_args)
                            should_call = false
                            return void_main()
                        } else {
                            return locked = false
                        }
                    })
                }
                void_main()
                return last_result
            }
        }
    }

    function is_atomic(val) {
        switch (type_of2(val)) {
            case '[object Object]':
            case '[object Array]':
            case '[object Date]':
                return false
            default:
                return true
        }
    }

    function is_arguments(v) {
        return '[object Arguments]' === type_of2(v)
    }

    function is_array_like(v) {
        return is_number(v.length)
    }

    function is_boolean(v) {
        return 'boolean' === (typeof v)
    }

    function is_date(val) {
        return '[object Date]' === (type_of2(val))
    }

    function is_defined(subj) {
        return 'undefined' !== (typeof subj)
    }

    function is_empty(o) {
        return 0 === (count1(o))
    }

    function is_empty$(o) {
        return !o || (is_empty(o))
    }

    function is_even(num) {
        return 0 === (num % 2)
    }

    function is_function(candidate) {
        return 'function' === typeof candidate
    }

    function is_number(candidate) {
        return 'number' === typeof candidate
    }

    function is_integer(n) {
        return (Number(n) === n) && (n % 1 === 0)
    }

    function is_object(candidate) {
        return 'object' === typeof candidate
    }

    /**
     * Checks subject for being plain old JavaScript object
     * @return {boolean}
     */
    function is_plain_object(subject) {
        var ctor = null,
            is_defnd = 'undefined' !== typeof subject,
            is_objct = is_defnd && ('[object Object]' === to_string.call(subject)) && !(is_function(subject))
        //
        if (!is_objct || (!hasOwnProperty.call(subject, 'constructor') &&
                    ((ctor = subject.constructor) && (is_function(ctor)) && !(ctor instanceof ctor)))) {
            return false
        }
        var latest_key;
        for (var key in subject) {
            latest_key = key
        }
        return not_defined(key) || hasOwnProperty.call(subject, latest_key)
    }

    function is_mergeable(item) {
        return is_array(item) || is_plain_object(item)
    }

    function is_regexp(item) {
        return '[object RegExp]' === (type_of2(item))
    }

    function is_string(item) {
        return "string" === (type_of(item))
    }

    function is_subset(subset, superset) {
        return is_empty(difference(subset, superset))
    }

    function is_zero(candidate) {
        return candidate === 0
    }

    var not_array     = complement(is_array),
        not_boolean   = complement(is_boolean),
        not_date      = complement(is_date),
        not_defined   = complement(is_defined),
        not_empty     = complement(is_empty),
        not_empty$    = complement(is_empty$),
        not_function  = complement(is_function),
        not_mergeable = complement(is_mergeable),
        not_number    = complement(is_number),
        not_object    = complement(is_object),
        not_string    = complement(is_string),
        not_subset    = complement(is_subset),
        not_zero      = complement(is_zero)

    function butlast(array) {
        return slice(array, 0, (count1(array)) - 1)
    }

    function cat(array) {
        return native_concat.apply(array, slice(arguments, 1))
    }

    function contains(searched_item, array) {
        var item, k, len3
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (searched_item === item) {
                return true
            }
        }
        return false
    }

    var not_contains = complement(contains)
    function a_contains(array, searched_item) {
        var item, k, len3
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (searched_item === item) {
                return true
            }
        }
        return false
    }

    function a_each(array, fn) {
        each(fn, array)
    }

    function a_each_idx(array, fn) {
        each_idx(fn, array)
    }

    function a_filter(array, fn) {
        return filter(fn, array)
    }

    function a_find_index(array, pred) {
        return find_index(pred, array)
    }

    function a_index_of(array, item) {
        return array.indexOf(item)
    }

    function a_map(array, fn) {
        return map(fn, array)
    }

    function a_reduce(array, val, fn) {
        if (is_function(val)) {
            return reduce(val, array)
        } else {
            return reduce(fn, val, array)
        }
    }

    function a_reject(array, fn) {
        return reject(fn, array)
    }

    function any(pred, arr) {
        if (arguments.length === 1) {
            arr = pred
            pred = true
        }
        return -1 < find_index(pred, arr)
    }

    function compact(coll) {
        var item, k, len3, results1
        results1 = []
        for (k = 0, len3 = coll.length; k < len3; k++) {
            item = coll[k]
            if (item) {
                results1.push(item)
            }
        }
        return results1
    }

    function count(pred, coll) {
        if (!coll) {
            return count1(pred)
        } else if (!pred) {
            return coll.length
        } else {
            if (is_function(pred)) {
                return count_pred(pred, coll)
            } else {
                return count_obj(pred, coll)
            }
        }
    }

    function count1(o) {
        if (is_array_like(o)) {
            return o.length
        } else {
            return (keys(o)).length
        }
    }

    function count_obj(pred, coll) {
        return (filter(pred, coll)).length
    }

    function count_pred(pred, coll) {
        var cnt, item, k, len3
        cnt = 0
        for (k = 0, len3 = coll.length; k < len3; k++) {
            item = coll[k]
            if (pred(item)) {
                cnt++
            }
        }
        return cnt
    }

    function drop(items_number_to_drop, array_like) {
        return slice(array_like, items_number_to_drop)
    }

    function drop_last(chars_to_drop, string) {
        var len
        len = string.length
        if (chars_to_drop > len) {
            return ""
        } else {
            return string.substring(0, len - chars_to_drop)
        }
    }

    function each(fn, coll) {
        switch (arguments.length) {
            case 0:
            case 1:
                throw new Error("Each doesn't have a signature of that arity")
            case 2:
                return each2(fn, coll)
            case 3:
                return each3(fn, coll, arguments[2])
            default:
                return eachn.apply(null, arguments)
        }
    }

    function each2(fn, arr) {
        var item, k, len3
        for (k = 0, len3 = arr.length; k < len3; k++) {
            item = arr[k]
            fn(item)
        }
    }

    function each3(fn, arr1, arr2) {
        var i, length_of_shortest
        length_of_shortest = Math.min(count1(arr1), count1(arr2))
        i = -1
        while (++i < length_of_shortest) {
            fn(arr1[i], arr2[i])
        }
    }

    function calc_shortest_length(arrs) {
        return apply(Math.min, map2(count1, arrs))
    }

    /**
     * Variant of `each` that traverses `n` arrays with `fn`
     * fn, array1, array2, array3...
     */
    function eachn(fn) {
        var args         = arguments,
            arrs         = rest(args),
            shortest_len = calc_shortest_length(arrs),
            local_pluck  = pluck,
            local_apply  = apply,
            i            = -1;
        while (++i < shortest_len) {
            local_apply(fn, local_pluck(i, arrs))
        }
    }

    function each_idx(fn, arr) {
        if (arguments.length === 2) {
            each_idx2(fn, arr)
        } else {
            each_idxn.apply(null, arguments)
        }
    }

    function each_idx2(fn, arr) {
        var i, len
        len = arr.length
        i = -1
        while (++i < len) {
            fn(arr[i], i)
        }
    }

    function each_idxn() {
        var args, arrs, fn, local_apply, local_pluck, shortest_len
        fn = first(arguments)
        arrs = rest(arguments)
        shortest_len = calc_shortest_length(arrs)
        local_pluck = pluck
        local_apply = apply
        while (++i < shortest_len) {
            args = local_pluck(i, arrs)
            args.push(i)
            local_apply(fn, args)
        }
    }

    function check_keys(obj, keys_to_check) {
        return every(wrap_invoke_obj(obj), keys_to_check)
    }

    function check_true(val) {
        return val === true
    }

    function every(pred, coll) {
        if (!coll) {
            coll = pred
            pred = check_true
        }
        if (is_empty(coll)) {
            return true
        }
        return every_fn(pred, coll)
    }

    function every_fn(fn, coll) {
        return a_reduce(coll, true, function(v1, v2) {
            return (v1 && (fn(v2))) || Reduced(false)
        })
    }

    function first(array) {
        return array[0]
    }

    function filter_fn(fn, arr) {
        var i, item, len, res
        res = []
        len = arr.length
        i = -1
        while (++i < len) {
            item = arr[i]
            if (fn(item)) {
                res.push(item)
            }
        }
        return res
    }

    function filter_prop(prop_name, arr) {
        var i, item, len, res
        res = []
        len = arr.length
        i = -1
        while (++i < len) {
            item = arr[i]
            if (item[prop_name]) {
                res.push(item)
            }
        }
        return res
    }

    function filter_obj_1kv(obj, array) {
        var item, k, key, len3, ref, results1, val
        ref = read_1kv(obj), key = ref[0], val = ref[1]
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (item[key] === val) {
                results1.push(item)
            }
        }
        return results1
    }

    function filter_obj_2kv(obj, array) {
        var item, k, key1, key2, len3, ref, ref1, results1, val1, val2
        ref = keys(obj), key1 = ref[0], key2 = ref[1]
        ref1 = [obj[key1], obj[key2]], val1 = ref1[0], val2 = ref1[1]
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (item[key1] === val1 && item[key2] === val2) {
                results1.push(item)
            }
        }
        return results1
    }

    function filter_obj(obj, array) {
        var item, k, len3, results1
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (o_match(obj, item)) {
                results1.push(item)
            }
        }
        return results1
    }

    function filter_re(regex, strings) {
        var k, len3, results, string
        results = []
        for (k = 0, len3 = strings.length; k < len3; k++) {
            string = strings[k]
            if (regex.test(string)) {
                results.push(string)
            }
        }
        return results
    }

    function filter(some_criteria, array) {
        switch (typeof some_criteria) {
            case "string":
                return filter_prop(some_criteria, array)
            case "function":
                return filter_fn(some_criteria, array)
            case "object":
                if (is_regexp(some_criteria)) {
                    return filter_re(some_criteria, array)
                } else {
                    switch (count1(keys(some_criteria))) {
                        case 0:
                            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
                        case 1:
                            return filter_obj_1kv(some_criteria, array)
                        case 2:
                            return filter_obj_2kv(some_criteria, array)
                        default:
                            return filter_obj(some_criteria, array)
                    }
                }
                break
            default:
                throw Errors.UNEXPECTED_TYPE
        }
    }

    function find(some_criteria, array) {
        var item_idx
        item_idx = find_index(some_criteria, array)
        if (item_idx === -1) {
            return
        }
        return read(item_idx, array)
    }

    function find_index(pred, array) {
        switch (typeof pred) {
            case "string":
                return find_index_prop(pred, array)
            case "function":
                return find_index_fn(pred, array)
            case "boolean":
            case "number":
                return index_of(pred, array)
            case "object":
                switch (count1(keys(pred))) {
                    case 0:
                        throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
                    case 1:
                        return find_index_obj_1kv(pred, array)
                    case 2:
                        return find_index_obj_2kv(pred, array)
                    default:
                        return find_index_obj(pred, array)
                }
                break
            default:
                throw Errors.UNEXPECTED_TYPE
        }
    }

    function find_index_fn(fn, array) {
        var idx, item, k, len3
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx]
            if (fn(item)) {
                return idx
            }
        }
        return -1
    }

    function find_index_prop(prop_name, array) {
        var idx, item, k, len3
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx]
            if (item[prop_name]) {
                return idx
            }
        }
        return -1
    }

    function find_index_obj_1kv(obj_with_1kv_pair, array) {
        var idx, item, k, key, len3, ref, val
        ref = read_1kv(obj_with_1kv_pair), key = ref[0], val = ref[1]
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx]
            if (item[key] === val) {
                return idx
            }
        }
        return -1
    }

    function find_index_obj_2kv(obj_with_2kv_pair, array) {
        var idx, item, k, key1, key2, len3, ref, ref1, val1, val2
        ref = keys(obj_with_2kv_pair), key1 = ref[0], key2 = ref[1]
        ref1 = [obj_with_2kv_pair[key1], obj_with_2kv_pair[key2]], val1 = ref1[0], val2 = ref1[1]
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx]
            if (item[key1] === val1 && item[key2] === val2) {
                return idx
            }
        }
        return -1
    }

    function find_index_obj(obj, array) {
        var idx, item, k, len3
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx]
            if (o_match(obj, item)) {
                return idx
            }
        }
        return -1
    }

    function base_find_index_r(iter_fn, array) {
        var i
        i = array.length
        while (--i > -1) {
            if (iter_fn(array[i], i, array)) {
                return i
            }
        }
        return -1
    }

    function equal_bool(b1, b2) {
        return b1 === b2
    }

    function equal_number(n1, n2) {
        return n1 === n2
    }

    function dispatch_find_index_matcher(pred) {
        switch (typeof pred) {
            case 'function':
                return pred
            case 'boolean':
                return partial(equal_bool, pred)
            case 'number':
                return partial(equal_number, pred)
            default:
                throw new Error("No matcher for " + (typeof pred) + " yet")
        }
    }

    function find_index_last(pred, array) {
        return base_find_index_r(dispatch_find_index_matcher(pred), array)
    }

    function flatten(arr) {
        if (is_empty(arr)) {
            return []
        } else {
            return apply(cat, arr)
        }
    }

    function index_of(item, array) {
        return native_index_of.call(array, item)
    }

    function insert_at(items, idx, item) {
        items.splice(idx, 0, item)
        return items
    }

    function last(list) {
        return list[dec(count1(list))]
    }

    function list() {
        var args
        return (count1((args = arguments))) && (slice(args)) || []
    }

    function list_compact() {
        var arg, k, len3, result
        result = []
        for (k = 0, len3 = arguments.length; k < len3; k++) {
            arg = arguments[k]
            if (!!arg) {
                result.push(arg)
            }
        }
        return result
    }

    function log_pipe(val) {
        console.log.apply(console, val)
        return val
    }

    function next(arr, item) {
        return arr[(index_of(item, arr)) + 1]
    }

    function prev(arr, item) {
        return arr[(index_of(item, arr)) - 1]
    }

    function type_of(mixed) {
        return typeof mixed
    }

    function type_of2(val) {
        return to_string.call(val)
    }

    /**
     * @signature arr
     * @signature criterion, arr
     */
    function sort(criterion, arr) {
        switch (arguments.length) {
            case 1:
                return criterion.sort()
            case 2:
                if (2 > arr.length) {
                    return slice(arr)
                }
                switch (type_of(criterion)) {
                    case "string":
                        return sort_prop(criterion, arr)
                    case "array":
                        return sort_multi(criterion, arr)
                    case "function":
                        return sort_fn(criterion, arr)
                }
        }
    }

    /**
     * WARNING: immutable
     */
    function sort_prop(prop, arr) {
        var sort_suitable_arr = map(partial(_suit_sort, prop), arr),
            need_string_comparison = is_string(arr[0][prop]),
            compare_fn = need_string_comparison && _compare_string || _compare_numeric;
        return pluck('val', sort_suitable_arr.sort(compare_fn))
    }

    function _suit_sort(prop, obj) {
        return {
            val: obj,
            criteria: obj[prop]
        }
    }

    function _compare_numeric(obj1, obj2) {
        return obj1.criteria - obj2.criteria
    }


    var native_locale_compare = String.prototype.localeCompare

    function _compare_string(obj1, obj2) {
        return native_locale_compare.call(obj1.criteria, obj2.criteria)
    }

    function sort_multi(props_arr, arr) {}
    function sort_fn(compare_fn, arr) {
        return arr.sort(compare_fn)
    }

    function map(mapper, coll) {
        switch (arguments.length) {
            case 0:
            case 1:
                throw new Error("`map` doesn't have a signature of that arity (0 or 1)")
            case 2:
                switch (typeof mapper) {
                    case 'function':
                        return map2(mapper, coll)
                    case 'string':
                        return pluck(mapper, coll)
                    case 'object':
                        return o_map(mapper, coll)
                }
                break
            case 3:
                return map3(mapper, coll, arguments[2])
            default:
                return apply(mapn, arguments)
        }
    }

    function _async_mapper(err_fn, map_fn, accumulator, report_arr, item, idx) {
        return map_fn(item, function(err, res) {
            if (err) {
                return err_fn(err)
            }
            accumulator[idx] = res
            return report_arr[idx] = true
        })
    }

    function map_async(map_fn, items, on_res) {
        var err_fn, help_arr, int_id, len, res_arr
        len = items.length
        help_arr = repeat(len, false)
        res_arr = make_array(len)
        int_id = set_interval(2, function() {
            if (every(help_arr)) {
                clearInterval(int_id)
                return on_res(null, res_arr)
            }
        })
        err_fn = function(err) {
            clearInterval(int_id)
            return on_res(err)
        }
        return each_idx2(partial(_async_mapper, err_fn, map_fn, res_arr, help_arr), items)
    }

    /**
     * Special array creation helper.
     * V8 recommends to create small arrays fixed size, and large arrays with dynamic size
     */
    function make_array(len) {
        return (len > THRESHOLD_LARGE_ARRAY_SIZE) && [] || new Array(len)
    }

    function map2(fn, arr) {
        var i, len, result
        i = -1
        len = count1(arr)
        result = make_array(len)
        while (++i < len) {
            result[i] = fn(arr[i])
        }
        return result
    }

    function map3(fn, arr1, arr2) {
        var i, length_of_shortest, result
        length_of_shortest = Math.min(count1(arr1), count1(arr2))
        i = -1
        result = make_array(length_of_shortest)
        while (++i < length_of_shortest) {
            result[i] = fn(arr1[i], arr2[i])
        }
        return result
    }

    function mapn() {
        var args, arrs, fn, i, local_apply, local_pluck, result, shortest_len
        args = arguments
        fn = first(args)
        arrs = rest(args)
        shortest_len = apply(Math.min, map2(count1, arrs))
        i = -1
        local_pluck = pluck
        local_apply = apply
        result = make_array(shortest_len)
        while (++i < shortest_len) {
            result[i] = local_apply(fn, local_pluck(i, arrs))
        }
        return result
    }


    var not_contains = complement(contains)

    function prelast(array) {
        return array[(count1(array)) - 2]
    }

    function push(arr, item) {
        arr.push(item)
        return arr
    }

    function push_all(arr, items_to_push_arr) {
        arr.push.apply(arr, items_to_push_arr)
        return arr
    }

    function reduce(fn, val, array) {
        var idx, len
        idx = -1
        if (!array && (is_array_like(val))) {
            array = val
            val = fn(first(array), second(array))
            idx = 1
        }
        len = count1(array)
        while (++idx < len && (!val || val.constructor !== ReducedClass)) {
            val = fn(val, array[idx])
        }
        if (val && val.constructor === ReducedClass) {
            return val.val
        } else {
            return val
        }
    }

    function reducer(fn, val, arr) {
        var idx
        idx = -1
        if (!arr && (is_array(val))) {
            arr = val
            val = fn(last(arr), prelast(arr))
            idx = (count1(arr)) - 2
        } else {
            idx = count1(arr)
        }
        while (--idx > -1) {
            val = fn(val, arr[idx])
        }
        return val
    }

    function reject_fn(fn, array) {
        var item, k, len3, results1
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (!(fn(item))) {
                results1.push(item)
            }
        }
        return results1
    }

    function reject_prop(prop_name, array) {
        var item, k, len3, results1
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (!item[prop_name]) {
                results1.push(item)
            }
        }
        return results1
    }

    function reject_obj_1kv(one_kv_pair_object, array) {
        var item, k, key, len3, ref, results1, val
        ref = read_1kv(one_kv_pair_object), key = ref[0], val = ref[1]
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (item[key] !== val) {
                results1.push(item)
            }
        }
        return results1
    }

    function reject_obj_2kv(two_kv_pairs_object, array) {
        var item, k, key1, key2, len3, ref, ref1, results1, val1, val2
        ref = keys(two_kv_pairs_object), key1 = ref[0], key2 = ref[1]
        ref1 = [two_kv_pairs_object[key1], two_kv_pairs_object[key2]], val1 = ref1[0], val2 = ref1[1]
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (!(item[key1] === val1 && item[key2] === val2)) {
                results1.push(item)
            }
        }
        return results1
    }

    function reject_obj(object, array) {
        var item, k, len3, results1
        results1 = []
        for (k = 0, len3 = array.length; k < len3; k++) {
            item = array[k]
            if (!(o_match(object, item))) {
                results1.push(item)
            }
        }
        return results1
    }

    function reject(some_criteria, array) {
        switch (typeof some_criteria) {
            case "string":
                return reject_prop(some_criteria, array)
            case "function":
                return reject_fn(some_criteria, array)
            case "object":
                switch (count1(keys(some_criteria))) {
                    case 0:
                        throw Errors.NO_KEY_VALUE_PAIR_IN_HASH
                    case 1:
                        return reject_obj_1kv(some_criteria, array)
                    case 2:
                        return reject_obj_2kv(some_criteria, array)
                    default:
                        return reject_obj(some_criteria, array)
                }
                break
            default:
                throw Errors.UNEXPECTED_TYPE
        }
    }

    function remap(fn, arr) {
        switch (arguments.length) {
            case 2:
                return remap2(fn, arr)
            case 3:
                return remap3(fn, arguments[1], arguments[2])
        }
    }

    function remap2(fn, arr) {
        var item, item_idx, k, len3
        for (item_idx = k = 0, len3 = arr.length; k < len3; item_idx = ++k) {
            item = arr[item_idx]
            arr[item_idx] = fn(item)
        }
        return arr
    }

    function remap3(fn, prop, arr) {
        var item, item_idx, k, len3
        for (item_idx = k = 0, len3 = arr.length; k < len3; item_idx = ++k) {
            item = arr[item_idx]
            arr[item_idx][prop] = fn(item[prop])
        }
        return arr
    }

    function remove(item, arr) {
        var idx
        idx = index_of(item, arr)
        return idx !== -1 && (remove_at(idx, arr))
    }

    function remove_at(idx, arr) {
        return splice(arr, idx, 1)
    }

    function repeat(times, value) {
        var array
        array = make_array(times)
        while (--times > -1) {
            array[times] = value
        }
        return array
    }

    function repeatf(times, fn) {
        var array
        array = make_array(times)
        while (--times > -1) {
            array[times] = fn()
        }
        return array
    }

    function rest(arr) {
        return slice(arr, 1)
    }

    function reverse(arr) {
        var i, j, len, res
        len = arr.length
        i = 0
        j = len
        res = new Array(len)
        while (--j > -1) {
            res[i] = arr[j]
            i += 1
        }
        return res
    }


    var splice = bind(Function.prototype.call, Array.prototype.splice)

    function second(array) {
        return array[1]
    }

    function take(items_number_to_take, array_like) {
        return slice(array_like, 0, items_number_to_take)
    }

    function third(arr) {
        return arr[2]
    }

    function union(arr1, arr2) {
        var item, k, len3, result
        result = arr1.slice()
        for (k = 0, len3 = arr2.length; k < len3; k++) {
            item = arr2[k]
            if (!(contains(item, arr1))) {
                result.push(item)
            }
        }
        return result
    }

    function unshift(arr, item) {
        arr.unshift(item)
        return arr
    }

    function without(item, arr) {
        remove(item, arr)
        return arr
    }

    function invoke(method_name, coll) {
        switch (arguments.length) {
            case 2:
                return invoke0(method_name, coll)
            case 3:
                return invoke1(method_name, coll, arguments[2])
            default:
                return invoken.apply(null, arguments)
        }
    }

    function invoke0(method_name, coll) {
        var i, len, results
        len = coll.length
        results = make_array(len)
        i = -1
        while (++i < len) {
            results[i] = coll[i][method_name]()
        }
        return results
    }

    function invoke1(method_name, arg, coll) {
        var i, item, len, results
        len = coll.length
        results = make_array(len)
        i = -1
        while (++i < len) {
            item = coll[i]
            results[i] = item[method_name].call(item, arg)
        }
        return results
    }

    function invoken() {
        var args, coll, i, item, k, len, method_name, results
        method_name = arguments[0], args = 3 <= arguments.length ? slice1.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), coll = arguments[k++]
        len = coll.length
        results = make_array(len)
        i = -1
        while (++i < len) {
            item = coll[i]
            results[i] = item[method_name].apply(item, args)
        }
        return results
    }

    function invokem(method_name, coll) {
        switch (arguments.length) {
            case 2:
                return invokem0(method_name, coll)
            case 3:
                return invokem1(method_name, coll, arguments[2])
            default:
                return invokemn.apply(null, arguments)
        }
    }

    function invokem1(method_name, arg, coll) {
        var i, item, len
        i = -1
        len = coll.length
        while (++i < len) {
            item = coll[i]
            item[method_name].call(item, arg)
        }
    }

    function invokem0(method_name, coll) {
        var i, len
        i = -1
        len = coll.length
        while (++i < len) {
            coll[i][method_name]()
        }
    }

    function invokemn() {
        var args, coll, i, item, k, len, method_name
        method_name = arguments[0], args = 3 <= arguments.length ? slice1.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), coll = arguments[k++]
        i = -1
        len = coll.length
        while (++i < len) {
            item = coll[i]
            item[method_name].apply(item, args)
        }
    }

    function pluck(key, coll) {
        var i, len, result
        len = count1(coll)
        result = make_array(len)
        i = -1
        while (++i < len) {
            result[i] = coll[i][key]
        }
        return result
    }

    function varynum(numbers_arr, start_with_one) {
        var k, len3, number, results1, variator
        variator = start_with_one && -1 || 1
        results1 = []
        for (k = 0, len3 = numbers_arr.length; k < len3; k++) {
            number = numbers_arr[k]
            variator *= -1
            results1.push(number * variator)
        }
        return results1
    }

    /**
     * Writes a property `prop_name` of `dst_coll` to `dst_coll` objects
     * from `src_coll` values
     */
    function write(dst_coll, prop_name, src_coll) {
        var idx = dst_coll.length
        while (--idx > -1) {
            dst_coll[idx][prop_name] = src_coll[idx]
        }
        return dst_coll
    }

    function unique(prop, array) {
        if (array) {
            return unique_by_prop(prop, array)
        } else {
            array = prop
            if (is_empty(array)) {
                return []
            } else if ((is_number(array[0])) || (is_string(array[0]))) {
                return unique_plain(array)
            } else {
                throw Error("only propped uniq and plain number or string uniqueing supported")
            }
        }
    }

    function unique_by_prop(prop_name, arr) {
        var help_hash, out
        help_hash = {}
        out = []
        a_each(arr, function(item) {
            var prop_val
            prop_val = item[prop_name]
            if (!help_hash[prop_val]) {
                help_hash[prop_val] = true
                return out.push(item)
            }
        })
        return out
    }

    function unique_plain(arr) {
        var help_hash, out
        help_hash = {}
        out = []
        a_each(arr, function(val) {
            if (!help_hash[val]) {
                help_hash[val] = true
                return out.push(val)
            }
        })
        return out
    }

    function wrap_invoke_obj(o) {
        return function(key) {
            return o[key]
        }
    }



    function assign(dest, sources) {
        if (dest == null) {
            dest = {}
        }
        return reduce(assign_one, dest, drop(1, arguments))
    }

    function assign_keys(keys, dst, src) {
        var i, key, l
        i = -1
        l = keys.length
        while (++i < l) {
            key = keys[i]
            if (void 0 !== src[key]) {
                dst[key] = src[key]
            }
        }
        return dst
    }

    function assign_one(dest, src) {
        var key, val
        for (key in src) {
            val = src[key]
            dest[key] = val
        }
        return dest
    }

    function clone(data) {
        if (is_object(data)) {
            if (is_array(data)) {
                return slice(data)
            } else {
                return clone_obj(data)
            }
        } else {
            throw Errors.UNEXPECTED_TYPE
        }
    }

    function cloneassign(dst, var_src) {
        return reduce(assign_one, clonedeep(dst), drop(1, arguments))
    }

    function clonedeep(src) {
        return _clonedeep(
            src,
            is_array(src) && [] || {}, // destination object or array
            [dst], // destination stack
            [src]  // source object stack
        )
    }

    /**
     * Shallow object clone
     */
    function clone_obj(obj) {
        var key, res = {}
        for (key in obj) {
            res[key] = obj[key]
        }
        return res
    }

    function _clonedeep(src, dst, stack_dst, stack_src) {
        var child_dst, key, val, val_idx
        for (key in src) {
            val = src[key]
            if (is_atomic(val)) {
                dst[key] = val
            } else if (is_date(val)) {
                dst[key] = new Date(val.getTime())
            } else {
                val_idx = index_of(val, stack_src)
                if (val_idx === -1) {
                    dst[key] = child_dst = (is_array(val)) && [] || {}
                    stack_src.push(val)
                    stack_dst.push(child_dst)
                    _clonedeep(val, child_dst, stack_dst, stack_src)
                } else {
                    dst[key] = stack_dst[val_idx]
                }
            }
        }
        return dst
    }

    function _clonedeep2(src) {
        var child_dst, cur_dst, cur_key_idx, cur_keys, cur_src, dst, key, ref, stack_act, stack_dst, stack_src, val, val_idx
        dst = (is_array(src)) && [] || {}
        cur_src = src
        cur_dst = dst
        stack_src = [src]
        stack_dst = [dst]
        stack_act = []
        cur_keys = (is_array(cur_src)) && (range(count1(cur_src))) || (reverse(keys(cur_src)))
        cur_key_idx = count1(cur_keys)
        while (--cur_key_idx >= 0) {
            key = cur_keys[cur_key_idx]
            val = cur_src[key]
            if (is_atomic(val)) {
                cur_dst[key] = val
            } else if (is_date(val)) {
                cur_dst[key] = new Date(val.getTime())
            } else {
                val_idx = index_of(val, stack_src)
                if (val_idx === -1) {
                    child_dst = (is_array(val)) && [] || {}
                    cur_dst[key] = child_dst
                    stack_act.push([cur_src, cur_dst, cur_keys, cur_key_idx])
                    cur_src = val
                    cur_dst = child_dst
                    cur_keys = (is_array(cur_src)) && (range(count1(cur_src))) || (reverse(keys(cur_src)))
                    cur_key_idx = count1(cur_keys)
                    stack_src.push(cur_src)
                    stack_dst.push(cur_dst)
                } else {
                    cur_dst[key] = stack_dst[val_idx]
                }
            }
            while ((is_zero(cur_key_idx)) && (not_zero(count1(stack_act)))) {
                ref = stack_act.pop(), cur_src = ref[0], cur_dst = ref[1], cur_keys = ref[2], cur_key_idx = ref[3]
            }
        }
        return dst
    }

    function create(ctor, arg) {
        return new ctor(arg)
    }

    function defaults(dest) {
        if (dest == null) {
            dest = {}
        }
        return reduce(defaults2, dest, rest(arguments))
    }

    function defaults2(dest, source) {
        var key, val
        for (key in source) {
            val = source[key]
            if ('undefined' === typeof dest[key]) {
                dest[key] = val
            }
        }
        return dest
    }

    function difference(o1, o2) {
        if ((is_object(o1)) && (is_object(o2))) {
            if ((is_array(o1)) && (is_array(o2))) {
                return difference_sets(o1, o2)
            } else {
                return difference_objs_vals(o1, o2)
            }
        } else {
            throw new TypeError("Tried to find difference between not objects")
        }
    }

    function difference_objs_vals(o1, o2) {
        var key, res, val1, val2
        res = {}
        for (key in o1) {
            val1 = o1[key]
            if ((is_defined(val2 = o2[key])) && !(equal2(val1, val2))) {
                res[key] = val1
            }
        }
        return res
    }

    function difference_sets(set_a, set_b, contains_fn) {
        if (contains_fn == null) {
            contains_fn = contains
        }
        return a_reject(set_a, function(item) {
            return contains_fn(item, set_b)
        })
    }

    function set_symmetric_difference(set_a, set_b, contains_fn) {
        return [difference_sets(set_a, set_b, contains_fn), difference_sets(set_b, set_a, contains_fn)]
    }

    /**
     * Variadic equality checker
     * @signature vals...
     */
    function equal() {
        var args_length = arguments.length,
            all_args_equal = true
        while (all_args_equal && (--args_length > 0)) {
            all_args_equal = equal_r(arguments[args_length], arguments[args_length - 1])
        }
        return all_args_equal
    }

    /**
     * Shallow equality check for objects and arrays
     */
    function equal2(o1, o2) {
        if ((o1 == null) || (o1 == false)) { // special falsee trick from CoffeeScript
            return o1 === o2
        }
        else if (is_object(o1) && is_object(o2)) {
            if (is_array(o1) && is_array(o2)) {
                return equal_array(o1, o2)
            }
            else if (is_date(o1)) {
                return o1.valueOf() === o2.valueOf()
            }
            else {
                return equal_object(o1, o2)
            }
        }
        else {
            return o1 === o2
        }
    }

    /**
     * Recursive loop-free equality checker
     */
    function equal_r(o1, o2) {
        if (!is_mergeable(o1) || !is_mergeable(o2) || (o1 === o2)) {
            return o1 === o2
        }
        //
        var call_stack  = [],
            src_stack   = [],
            cur_o1      = o1,
            cur_o2      = o2,
            cur_keys    = keys(cur_o1),
            cur_key_idx = cur_keys.length
        //
        if ( !equal_array_str(cur_keys, keys(cur_o2)) ) {
            return false
        }
        //
        while (--cur_key_idx > -1) {
            var key = cur_keys[cur_key_idx],
                val_o1 = cur_o1[key],
                val_o2 = cur_o2[key]
            //
            if (!hasOwnProperty.call(cur_o2, key)) {
                return false
            }
            else if (not_mergeable(val_o1) && (val_o1 !== val_o2)) {
                return false
            }
            else if (index_of(val_o1, src_stack) === -1) {
                call_stack.push([cur_o1, cur_o2, cur_keys, cur_key_idx])
                src_stack.push(val_o1)
                //
                cur_o1      = val_o1
                cur_o2      = val_o2
                cur_keys    = keys(cur_o1)
                cur_key_idx = cur_o1.length
                //
                if (!equal_array_str(cur_keys, keys(cur_o2))) {
                    return false
                }
            }
            //
            while ((0 === cur_key_idx) && (0 !== call_stack.length)) {
                var call_data = call_stack.pop()
                cur_o1      = call_data[0]
                cur_o2      = call_data[1]
                cur_keys    = call_data[2]
                cur_key_idx = call_data[3]
            }
        }
        //
        return true
    }

    function equal_array(arr1, arr2) {
        var len1 = arr1.length,
            len2 = arr2.length
        return ((0 === len1) && (0 === len2)) || ((len1 === len2) && (equal_array_start(arr1, arr2)))
    }

    function equal_array_str(arr1, arr2) {
        var len1 = arr1.length,
            len2 = arr2.length
        if ((0 === len1) && (0 === len2)) {
            return true
        }
        else if (len1 !== len2) {
            return false
        }
        else {
            arr1.sort()
            arr2.sort()
            return equal_array_start(arr1, arr2)
        }
    }

    function equal_array_start(arr1, arr2) {
        return reduce(and_r, true, map(equal_val, arr1, arr2))
    }

    function equal_object(o1, o2) {
        var keys1, keys2, vals1, vals2
        keys1 = keys(o1)
        keys2 = keys(o2)
        if (keys1.length === keys2.length && (equal_set(keys1, keys2))) {
            vals1 = o_map(o1, keys1)
            vals2 = o_map(o2, keys1)
            return equal_array_start(vals1, vals2)
        } else {
            return false
        }
    }

    function equal_set(keyset1, keyset2) {
        var diff1, diff2, ref
        ref = set_symmetric_difference(keyset1, keyset2), diff1 = ref[0], diff2 = ref[1]
        return (is_empty(diff1)) && (is_empty(diff2))
    }

    function equal_val(v1, v2) {
        return v1 === v2
    }

    function extend(extended, extension) {
        return assign(Object.create(extended), extension)
    }

    function flatten_path(prop, obj, opts) {
        var res
        if (opts == null) {
            opts = {
                inlude_root: false
            }
        }
        res = opts.include_root && [obj] || []
        while ((obj = obj[prop])) {
            res.push(obj)
        }
        return res
    }

    function flattenp(key, root, arg1) {
        var accumulator, include_root
        include_root = (arg1 != null ? arg1 : {
            include_root: true
        }).include_root
        accumulator = include_root && [root] || []
        return flattenp_recursive(key, root, accumulator)
    }

    function flattenp_recursive(key, root, accumulator) {
        var children, k, len3, son
        push_all(accumulator, root[key])
        if (children = root[key]) {
            for (k = 0, len3 = children.length; k < len3; k++) {
                son = children[k]
                flattenp_recursive(key, son, accumulator)
            }
        }
        return accumulator
    }

    function for_own(fn, obj) {
        a_each(keys(obj), function(key) {
            fn(key, obj[key])
        })
    }

    function index_by(index_prop, list_to_index, accumulator) {
        var item, k, len3
        if (accumulator == null) {
            accumulator = {}
        }
        for (k = 0, len3 = list_to_index.length; k < len3; k++) {
            item = list_to_index[k]
            accumulator[item[index_prop]] = item
        }
        return accumulator
    }

    function interpose(sep, coll) {
        var coll_len, i_coll, i_res, new_len, new_res, seps_count
        coll_len = coll.length
        seps_count = coll_len - 1
        new_len = coll_len + seps_count
        new_res = make_array(new_len)
        i_coll = -1
        i_res = 0
        while (++i_coll < coll_len) {
            new_res[i_res] = coll[i_coll]
            if ((i_res + 1) < new_len) {
                new_res[i_res + 1] = sep
            }
            i_res += 2
        }
        return new_res
    }

    function intersection(coll1, coll2, contains_fn) {
        if (contains_fn == null) {
            contains_fn = contains
        }
        return a_filter(coll1, function(item) {
            return contains_fn(item, coll2)
        })
    }

    /**
     * Inverses object
     * Designed for plain <string -> string> objects.
     * inverse_object({a: 1, b: 2}) // yields {'1': 'a', '2': 'b'}
     */
    function inverse_object(obj) {
        var res = {},
            _keys = keys(obj),
            i = _keys.length
        while (--i > -1) {
            res[obj[_keys[i]]] = _keys[i]
        }
        return res
    }

    function keys(hash) {
        return Object.keys(hash)
    }

    function merge(dst, src) {
        var call_stack  = [],
            src_stack   = [],
            cur_dst     = dst,
            cur_src     = src,
            cur_keys    = keys(src),
            cur_key_idx = cur_keys.length
        //
        while (--cur_key_idx > -1) {
            var key = cur_keys[cur_key_idx],
                val = cur_src[key]
            if (!hasOwnProperty.call(cur_dst, key) || not_mergeable(val)) {
                cur_dst[key] = val
                if (is_mergeable(val)) {
                    src_stack.push(val)
                }
            }
            else if (index_of(val, src_stack) === -1) {
                call_stack.push([cur_dst, cur_src, cur_keys, cur_key_idx])
                src_stack.push(val)
                //
                cur_dst     = cur_dst[key]
                cur_src     = cur_src[key]
                cur_keys    = keys(cur_src)
                cur_key_idx = cur_keys.length
            }
            //
            while ((0 === cur_key_idx) && (0 !== call_stack.length)) {
                var call_data = call_stack.pop()
                cur_dst     = call_data[0]
                cur_src     = call_data[1]
                cur_keys    = call_data[2]
                cur_key_idx = call_data[3]
            }
        }
        return dst
    }

    function merge_with(fn, o1, o2) {
        var k, key, keyset, len3, res, v1, v2
        res = {}
        keyset = unique(cat(keys(o1), keys(o2)))
        for (k = 0, len3 = keyset.length; k < len3; k++) {
            key = keyset[k]
            v1 = o1[key]
            v2 = o2[key]
            if (v1 && v2) {
                res[key] = fn(v1, v2)
            } else {
                res[key] = v1 || v2
            }
        }
        return res
    }

    function omit(obj, props) {
        return omit_all(obj, rest(arguments))
    }

    function omit_all(obj, props_arr) {
        var key, res, val
        res = {}
        for (key in obj) {
            val = obj[key]
            if (not_contains(key, props_arr)) {
                res[key] = val
            }
        }
        return res
    }

    function o_for_own(obj, fn) {
        return for_own(fn, obj)
    }

    /**
     * Like map, but uses object as a function of keys to values
     * E.g.
     *  o_map({name: 'Helen', id: '2'}, ['name']) -> ['Helen']
     */
    function o_map(hash, keys_list) {
        var len = keys_list.length,
            results = Array(len),
            i = -1;
        for (; ++i < len;) {
            results[i] = hash[ keys_list[i] ]
        }
        return results
    }

    function o_match(criteria_obj, subject) {
        var key, val
        for (key in criteria_obj) {
            val = criteria_obj[key]
            if (subject[key] !== val) {
                return false
            }
        }
        return true
    }

    function o_set(obj, key, val) {
        return obj[key] = val
    }

    function pull(key, hash) {
        var val
        val = hash[key]
        delete hash[key]
        return val
    }

    function pick(obj, props) {
        return pick_all(obj, rest(arguments))
    }

    function pick_all(obj, props) {
        var k, len3, prop, res
        res = {}
        for (k = 0, len3 = props.length; k < len3; k++) {
            prop = props[k]
            if (obj[prop] !== void 0) {
                res[prop] = obj[prop]
            }
        }
        return res
    }

    function transform(fn, obj, keys) {
        return keys && (transform3(fn, obj, keys)) || (transform2(fn, obj))
    }

    function transform2(fn, obj) {
        var key, val
        for (key in obj) {
            val = obj[key]
            obj[key] = fn(val)
        }
        return obj
    }

    function transform3(fn, obj, keys) {
        var k, key, len3
        for (k = 0, len3 = keys.length; k < len3; k++) {
            key = keys[k]
            obj[key] = fn(obj[key])
        }
        return obj
    }

    function update_in(obj, key, update_fn) {
        var val
        if (is_defined((val = obj[key]))) {
            obj[key] = update_fn(val)
        }
        return obj
    }

    function vals(hash) {
        return o_map(hash, keys(hash))
    }

    function zip_obj(keys, vals) {
        var obj
        obj = {}
        each(partial(o_set, obj), keys, vals)
        return obj
    }

    function format(template_str) {
        var args
        args = rest(arguments)
        return template_str.replace(/{(\d+)}/g, function(match, number) {
            return (typeof args[number] !== 'undefined') && args[number] || match
        })
    }

    function head(chars_to_take, str) {
        return str.substr(0, chars_to_take)
    }

    function match(regexp, source_str) {
        return source_str.match(regexp)
    }

    function matches(regexp, str) {
        if ('string' === (type_of(regexp))) {
            return (mk_regexp(regexp)).test(str)
        } else {
            return regexp.test(str)
        }
    }

    function comma() {
        return str_join(',', slice(arguments))
    }

    function space() {
        return str_join(' ', slice(arguments))
    }

    function str() {
        return str_join('', slice(arguments))
    }

    function str_breplace(map, str) {
        var regex
        regex = mk_regexp(str_join('|', keys(map)), 'ig')
        return str.replace(regex, function(seq) {
            return map[seq] || seq
        })
    }

    function str_join(join_string, array_to_join) {
        return array_to_join.join(join_string)
    }

    /**
     * Joins an array of lines to single string
     * @param {array<string>} lines
     * @return {string}
     */
    function str_join_lines(lines) {
        return lines.join('\n')
    }

    function str_split(split_str, string_to_split) {
        return string_to_split.split(split_str)
    }

    /**
     * Splits a string by line breaks
     * @param {string} string
     * @return {array<string>}
     */
    function str_split_lines(string) {
        return string.split('\n')
    }

    function tail(chars_to_drop, str) {
        return str.substr(chars_to_drop)
    }

    function trim(str) {
        return str.trim()
    }

    function dec(num) {
        return num - 1
    }

    function inc(num) {
        return num + 1
    }

    function jquery_wrap_to_array(jquery_wrap) {
        var i, results1, wrap_len
        wrap_len = jquery_wrap.length
        i = -1
        results1 = []
        while (++i < wrap_len) {
            results1.push(jquery_wrap.eq(i))
        }
        return results1
    }

    function mk_regexp(rx_str, rx_settings) {
        rx_settings = rx_settings || ""
        return new RegExp(rx_str, rx_settings)
    }

    function range(start_idx, end_idx, step) {
        var array, i, length
        switch (arguments.length) {
            case 1:
                end_idx = start_idx
                start_idx = 0
                step = 1
                break
            case 2:
                step = 1
                break
            case 3:
                break
            default:
                throw new Error('Bad arguments length, available signatures are for arguments length 1, 2 and 3')
        }
        length = Math.ceil((Math.abs(end_idx - start_idx)) / step)
        array = new Array(length)
        start_idx -= step
        i = -1
        while (++i < length) {
            array[i] = (start_idx += step)
        }
        return array
    }

    function read(prop_name, hash) {
        return hash[prop_name]
    }

    function read_1kv(obj_with_1kv_pair) {
        var key
        key = first(keys(obj_with_1kv_pair))
        return [key, read(key, obj_with_1kv_pair)]
    }

    /*
       This is a function that iterates with another function
       over the nodes of a tree structure.
       @param fn {function} function that operates on the node.
       signature: son, parent, son_idx, depth
       @param root {hash} a tree whose children lie in the children
       list (i.e. ordered collection).
       @param depth: indicates depth of recursion
       */
    function recurse(fn, root, depth) {
        var children, idx, k, len3, len4, m, son
        if (depth == null) {
            depth = 0
        }
        children = root.children
        depth++
        for (idx = k = 0, len3 = children.length; k < len3; idx = ++k) {
            son = children[idx]
            fn(son, root, idx, depth)
        }
        for (m = 0, len4 = children.length; m < len4; m++) {
            son = children[m]
            recurse(fn, son, depth)
        }
        return root
    }

    function sum2(a, b) {
        return a + b
    }

    function a_sum(nums_array) {
        return reduce(sum2, 0, nums_array)
    }

    function set(prop_name, val, hash) {
        hash[prop_name] = val
    }

    /**
     * Raw measurement for function execution time
     * @return {int} milliseconds for `fn` execution
     */
    function time(fn) {
        var time_start = Date.now()
        fn()
        return Date.now() - time_start
    }



    var toStringTester = Object.prototype.toString

    var ToStringFootprints = {
        REGEXP: '[object RegExp]'
    }

    function is_regexp(mixedValue) {
        return ToStringFootprints.REGEXP === toStringTester.call(mixedValue)
    }
    var not_regexp = complement(is_regexp)

    function once(fn) {
        var run = false
        return function() {
            if (run) { return }
            run = true
            //
            fn.call(this, arguments)
        }
    }

    /**
     * Возвращает новую функцию, которая будет выполнятся каждый раз с задержкой.
     * Новая функция будет возвращать id таймаута.
     */
    function delayed(ms, payloadFunction) {
        return function() {
            var args = slice(arguments),
                _this = this
            return setTimeout(function() {
                payloadFunction.apply(_this, args);
            }, ms)
        }
    }

    function matches(matched_str, regexp_or_str) {
        if ( not_regexp(regexp_or_str) ) {
            regexp_or_str = new RegExp(regexp_or_str)
        }
        return regexp_or_str.test(matched_str)
    }



    var exports = ("undefined" !== typeof module) && module.exports || {}
    exports.once = once
    exports.delayed = delayed
    exports.matches = matches
    exports.Reduced              = Reduced
    exports.a_contains           = a_contains
    exports.a_each               = a_each
    exports.a_each_idx           = a_each_idx
    exports.a_filter             = a_filter
    exports.a_find_index         = a_find_index
    exports.a_index_of           = a_index_of
    exports.a_map                = a_map
    exports.a_reduce             = a_reduce
    exports.a_reject             = a_reject
    exports.a_sum                = a_sum
    exports.and2                 = and2
    exports.add2                 = add2
    exports.any                  = any
    exports.assign               = assign
    exports.assign_keys          = assign_keys
    exports.apply                = apply
    exports.bind                 = bind
    exports.bind_all             = bind_all
    exports.butlast              = butlast

    exports.cat                  = cat
    exports.check_keys           = check_keys
    exports.clone                = clone
    exports.cloneassign          = cloneassign
    exports.clonedeep            = clonedeep
    exports.clonedeep2           = _clonedeep2
    exports.comma                = comma
    exports.compact              = compact
    exports.compose              = compose
    exports.complement           = complement
    exports.concat               = cat
    exports.contains             = contains
    exports.count                = count
    exports.create               = create
    exports.debug_wrap           = debug_wrap
    exports.debounce             = debounce
    exports.dec                  = dec
    exports.defaults             = defaults
    exports.delay                = delay
    exports.detect               = find
    exports.diff                 = difference
    exports.difference           = difference
    exports.difference_sets      = difference_sets
    exports.drop                 = drop
    exports.drop_last            = drop_last

    exports.each                 = each
    exports.each_idx             = each_idx
    exports.equal                = equal
    exports.equal_array_start    = equal_array_start
    exports.equal_val            = equal_val
    exports.equal_set            = equal_set
    exports.every                = every
    exports.extend               = extend
    exports.fastbind             = bind
    exports.first                = first
    exports.filter               = filter
    exports.filter_fn            = filter_fn
    exports.filter_obj           = filter_obj
    exports.filter_obj_1kv       = filter_obj_1kv
    exports.filter_obj_2kv       = filter_obj_2kv
    exports.filter_prop          = filter_prop
    exports.filter_re            = filter_re
    exports.find                 = find
    exports.find_index           = find_index
    exports.find_index_fn        = find_index_fn
    exports.find_index_prop      = find_index_prop
    exports.find_index_obj_1kv   = find_index_obj_1kv
    exports.find_index_obj_2kv   = find_index_obj_2kv
    exports.find_index_obj       = find_index_obj
    exports.find_index_last      = find_index_last
    exports.flatten              = flatten
    exports.flattenp             = flattenp
    exports.flatten_path         = flatten_path
    exports.flow                 = flow
    exports.for_own              = for_own
    exports.format               = format

    exports.get                  = read
    exports.head                 = head
    exports.inverse_object       = inverse_object
    exports.inc                  = inc
    exports.index_by             = index_by
    exports.index_by_id          = partial(index_by, 'id')
    exports.index_of             = index_of
    exports.insert_at            = insert_at
    exports.intersection         = intersection
    exports.interpose            = interpose
    exports.interval             = set_interval
    exports.invoke               = invoke
    exports.invokem              = invokem
    exports.is_array             = is_array
    exports.is_arguments         = is_arguments
    exports.is_boolean           = is_boolean
    exports.is_date              = is_date
    exports.is_defined           = is_defined
    exports.is_empty             = is_empty
    exports.is_empty$            = is_empty$
    exports.is_even              = is_even
    exports.is_function          = is_function
    exports.is_mergeable         = is_mergeable
    exports.is_number            = is_number
    exports.is_integer           = is_integer
    exports.is_object            = is_object
    exports.is_plain_object      = is_plain_object
    exports.is_string            = is_string
    exports.is_subset            = is_subset
    exports.is_zero              = is_zero

    exports.jquery_wrap_to_array = jquery_wrap_to_array
    exports.j2a                  = jquery_wrap_to_array
    exports.keys                 = keys
    exports.last                 = last
    exports.list                 = list
    exports.list_compact         = list_compact
    exports.log_pipe             = log_pipe
    exports.map                  = map
    exports.map_async            = map_async
    exports.magic                = no_operation
    exports.match                = match
    exports.matches              = matches
    exports.merge                = merge
    exports.merge_with           = merge_with
    exports.mk_regexp            = mk_regexp
    exports.multicall            = multicall
    exports.next                 = next
    exports.no_operation         = no_operation
    exports.noop                 = no_operation
    exports.not_array            = not_array
    exports.not_boolean          = not_boolean
    exports.not_contains         = not_contains
    exports.not_date             = not_date
    exports.not_defined          = not_defined
    exports.not_empty            = not_empty
    exports.not_empty$           = not_empty$
    exports.not_function         = not_function
    exports.not_number           = not_number
    exports.not_object           = not_object
    exports.not_string           = not_string
    exports.not_subset           = not_subset
    exports.not_zero             = not_zero
    exports.omit                 = omit
    exports.omit_all             = omit_all
    exports.o_for_own            = o_for_own
    exports.o_map                = o_map
    exports.o_match              = o_match

    exports.partial              = partial
    exports.pbind                = pbind
    exports.periodically         = periodically
    exports.pt                   = partial
    exports.ptr                  = partialr
    exports.partialr             = partialr
    exports.pick                 = pick
    exports.pick_all             = pick_all
    exports.pipeline             = flow
    exports.pluck                = pluck
    exports.pluck_id             = partial(pluck, 'id')
    exports.prev                 = prev
    exports.pull                 = pull
    exports.push                 = push
    exports.push_all             = push_all

    exports.range                = range
    exports.read                 = read
    exports.recurse              = recurse
    exports.reduce               = reduce
    exports.reducer              = reducer
    exports.reject               = reject
    exports.reject_fn            = reject_fn
    exports.reject_obj           = reject_obj
    exports.reject_obj_1kv       = reject_obj_1kv
    exports.reject_obj_2kv       = reject_obj_2kv
    exports.reject_prop          = reject_prop
    exports.remap                = remap
    exports.remove               = remove
    exports.remove_at            = remove_at
    exports.repeat               = repeat
    exports.repeatf              = repeatf
    exports.rest                 = rest
    exports.reverse              = reverse

    // S
    exports.second                   = second
    exports.set                      = set
    exports.set_difference           = difference_sets
    exports.set_symmetric_difference = set_symmetric_difference
    exports.slice                    = slice
    exports.sort                     = sort
    exports.space                    = space
    exports.splice                   = splice
    exports.str                      = str
    exports.str_breplace             = str_breplace
    exports.str_drop                 = tail
    exports.str_join                 = str_join
    exports.str_join_lines           = str_join_lines
    exports.str_split                = str_split
    exports.str_split_lines          = str_split_lines
    exports.str_take                 = head
    exports.sum2                     = sum2
    exports.sum                      = a_sum

    exports.take         = take
    exports.tail         = tail
    exports.third        = third
    exports.throttle     = throttle
    exports.time         = time
    exports.transform    = transform
    exports.trim         = trim
    exports.update_in    = update_in
    exports.union        = union
    exports.unique       = unique
    exports.unshift      = unshift
    exports.vals         = vals
    exports.varynum      = varynum
    exports.without      = without
    exports.write        = write
    exports.zip_obj      = zip_obj

    return exports

})
