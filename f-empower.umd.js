(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.fEmpower = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    /**
     * F-EMPOWER
     * A set of functions to harness the power functional programming in JS.
     * Author: Ivan Fedorov <sharp.maestro@gmail.com>
     * License: MIT
     */

    var hasOwnProperty = {}.hasOwnProperty;

    var THRESHOLD_LARGE_ARRAY_SIZE = 64000;

    var Errors = {
        NO_KEY_VALUE_PAIR_IN_HASH: new Error('No key value pair in a criterion hash'),
        NOT_FUNCTION: new TypeError('Something is not function'),
        UNEXPECTED_TYPE: new TypeError('Unexpected type')
    };

    function ReducedClass(val) {
        this.val = val;
    }

    function Reduced(val) {
        return new ReducedClass(val);
    }

    var to_string = Object.prototype.toString,
        native_concat = Array.prototype.concat,
        native_index_of = Array.prototype.indexOf,
        is_array = Array.isArray;

    /**
     * Simple and full slice
     */
    function __slice(array_like) {
        var len = array_like.length,
            result = new Array(len);
        while (--len > -1) {
            result[len] = array_like[len];
        }
        return result;
    }

    /**
     * Quick and unsafe slice
     */
    function _slice(array_like, start, end) {
        var idx = start - 1,
            len = array_like.length;
        end = end == null ? len : end;
        var result = new Array(end - start);
        while (++idx < end) {
            result[idx - start] = array_like[idx];
        }
        return result;
    }

    function slice(array_like, start, end) {
        var length = array_like == null ? 0 : array_like.length;
        if (!length) {
            return [];
        }
        start = start == null ? 0 : start;
        end = end == undefined ? length : end;
        end = end > length ? length : end;
        return _slice(array_like, start, end);
    }

    function bind(fn, this_arg) {
        return function () {
            return fn.apply(this_arg, arguments);
        };
    }

    function partial(fn, args) {
        args = rest(arguments);
        return function () {
            return fn.apply(null, args.concat(__slice(arguments)));
        };
    }

    function apply(fn, args_list) {
        return fn.apply(this, args_list);
    }

    function add2(a, b) {
        return a + b;
    }

    function and2(a, b) {
        return a && b;
    }

    function and_r(a, b) {
        return a && b || Reduced(false);
    }

    function bind_all() {
        var props = butlast(arguments),
            this_arg = last(arguments);
        return a_each(props, function (prop) {
            return this_arg[prop] = bind(this_arg[prop], this_arg);
        });
    }

    function _assert_all_functions(functions) {
        each2(function (item) {
            if (not_function(item)) {
                throw Errors.NOT_FUNCTION;
            }
        }, functions);
    }

    function compose(functions) {
        functions = arguments;
        _assert_all_functions(functions);
        return function (memo) {
            memo = arguments;
            var idx = functions.length;
            while (--idx > -1) {
                memo = [functions[idx].apply(null, memo)];
            }
            return first(memo);
        };
    }

    function complement(predicate) {
        return function () {
            return !predicate.apply(null, arguments);
        };
    }

    function debounce(debounce_timeout, payload_fn) {
        if (arguments.length === 1) {
            payload_fn = debounce_timeout;
            debounce_timeout = 0;
        }
        var last_result = void 0,
            last_args = null,
            last_timeout_id = null,
            last_this = null;
        function _exec_payload() {
            return last_result = payload_fn.apply(last_this, last_args);
        }
        return function () {
            last_args = __slice(arguments);
            last_this = this;
            clearTimeout(last_timeout_id);
            last_timeout_id = delay(debounce_timeout, _exec_payload);
            return last_result;
        };
    }

    function debug_wrap(fn) {
        return function () {
            debugger;
            return fn.apply(null, arguments);
        };
    }

    function delay(delay_ms, fn) {
        if (arguments.length === 1) {
            fn = delay_ms;
            delay_ms = 0;
        }
        return setTimeout(fn, delay_ms);
    }

    function flow(functions) {
        functions = arguments;
        _assert_all_functions(functions);
        return function () {
            var memo = arguments,
                len = functions.length,
                i = -1;
            while (++i < len) {
                memo = [functions[i].apply(null, memo)];
            }
            return first(memo);
        };
    }

    /**
     * Returns a function that dispatches a call to all functions from `fns`
     */
    function multicall(fns) {
        fns = compact(fns);
        return function () {
            for (var i = -1, len = fns.length; ++i < len;) {
                fns[i].apply(this, arguments);
            }
        };
    }

    function no_operation() {}

    function partialr(fn, right_args) {
        right_args = _slice(arguments, 1);
        return function () {
            return apply(fn, cat(apply(list, arguments), right_args));
        };
    }

    function periodically(interval, countdown, fn) {
        var interval_id;
        if (not_number(countdown) || countdown < 1) {
            throw new Error("Bad countdown");
        }
        return interval_id = set_interval(interval, function () {
            fn();
            countdown = countdown - 1;
            if (0 === countdown) {
                return clearInterval(interval_id);
            }
        });
    }

    /**
     * Wraps function `fn` is such way that its this context will be passed as first argument
     */
    function pbind(fn) {
        return function () {
            return fn.apply(null, cat([this], __slice(arguments)));
        };
    }

    /**
     * `ms` first wrapper of setInterval
     */
    function set_interval(ms, fn) {
        if (!fn) {
            fn = ms;
            ms = 0;
        }
        return setInterval(fn, ms);
    }

    function throttle(throttle_millis, fn) {
        var locked = false,
            should_call = false,
            last_args = null,
            last_result = null;
        return function () {
            last_args = __slice(arguments);
            if (locked) {
                should_call = true;
                return last_result;
            } else {
                var void_main = function void_main() {
                    delay(throttle_millis, function () {
                        if (should_call) {
                            last_result = fn.apply(null, last_args);
                            should_call = false;
                            void_main();
                        } else {
                            locked = false;
                        }
                    });
                };

                locked = true;
                last_result = fn.apply(null, last_args);

                void_main();
                return last_result;
            }
        };
    }

    /**
     * Checks if value is atomic, useful when you want to know if it is safe to copy by link
     */
    function is_atomic(val) {
        switch (type_of2(val)) {
            case '[object Object]':
            case '[object Array]':
            case '[object Date]':
                return false;
            default:
                return true;
        }
    }

    function is_arguments(v) {
        return '[object Arguments]' === type_of2(v);
    }

    function is_array_like(v) {
        return is_number(v.length);
    }

    function is_boolean(v) {
        return 'boolean' === typeof v;
    }

    function is_date(val) {
        return '[object Date]' === type_of2(val);
    }

    function is_defined(subj) {
        return 'undefined' !== typeof subj;
    }

    function is_empty(o) {
        return 0 === count1(o);
    }

    function is_empty$(o) {
        return !o || is_empty(o);
    }

    function is_even(num) {
        return 0 === num % 2;
    }

    function is_function(candidate) {
        return 'function' === typeof candidate;
    }

    function is_number(candidate) {
        return 'number' === typeof candidate;
    }

    function is_integer(n) {
        return Number(n) === n && n % 1 === 0;
    }

    function is_object(candidate) {
        return 'object' === (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate));
    }

    /**
     * Checks subject for being plain old JavaScript object
     * @return {boolean}
     */
    function is_plain_object(subject) {
        var ctor = null,
            is_defnd = 'undefined' !== typeof subject,
            is_objct = is_defnd && '[object Object]' === to_string.call(subject) && !is_function(subject);
        //
        if (!is_objct || !hasOwnProperty.call(subject, 'constructor') && (ctor = subject.constructor) && is_function(ctor) && !(ctor instanceof ctor)) {
            return false;
        }
        var latest_key;
        for (var key in subject) {
            latest_key = key;
        }
        return not_defined(key) || hasOwnProperty.call(subject, latest_key);
    }

    function is_mergeable(item) {
        return is_array(item) || is_plain_object(item);
    }

    function is_regexp(item) {
        return '[object RegExp]' === type_of2(item);
    }

    function is_string(item) {
        return "string" === type_of(item);
    }

    function is_subset(subset, superset) {
        return is_empty(difference(subset, superset));
    }

    function is_zero(candidate) {
        return candidate === 0;
    }

    var not_array = complement(is_array),
        not_boolean = complement(is_boolean),
        not_date = complement(is_date),
        not_defined = complement(is_defined),
        not_empty = complement(is_empty),
        not_empty$ = complement(is_empty$),
        not_function = complement(is_function),
        not_mergeable = complement(is_mergeable),
        not_number = complement(is_number),
        not_object = complement(is_object),
        not_string = complement(is_string),
        not_subset = complement(is_subset),
        not_zero = complement(is_zero);

    function butlast(arr) {
        return _slice(array, 0, arr.length - 1);
    }

    function cat(array) {
        return native_concat.apply(array, _slice(arguments, 1));
    }

    function contains(searched_item, array) {
        return index_of(searched_item, array) > -1;
    }
    var not_contains = complement(contains);

    function a_contains(array, searched_item) {
        return index_of(searched_item, array) > -1;
    }

    function a_each(array, fn) {
        each(fn, array);
    }

    function a_each_idx(array, fn) {
        each_idx(fn, array);
    }

    function a_filter(array, fn) {
        return filter(fn, array);
    }

    function a_find_index(array, pred) {
        return find_index(pred, array);
    }

    function a_index_of(array, item) {
        return array.indexOf(item);
    }

    function a_map(array, fn) {
        return map(fn, array);
    }

    function a_reduce(array, val, fn) {
        if (is_function(val)) {
            return reduce(val, array);
        } else {
            return reduce(fn, val, array);
        }
    }

    function a_reject(array, fn) {
        return reject(fn, array);
    }

    function any(pred, arr) {
        if (arguments.length === 1) {
            arr = pred;
            pred = true;
        }
        return -1 < find_index_fn(pred, arr);
    }

    /**
     * Returns a new coll withouh any falsee members
     */
    function compact(coll) {
        return filter_fn(function (x) {
            return x;
        }, coll);
    }

    function count(pred, coll) {
        if (!coll) {
            return count1(pred);
        } else if (!pred) {
            return coll.length;
        } else {
            if (is_function(pred)) {
                return count_pred(pred, coll);
            } else {
                return count_obj(pred, coll);
            }
        }
    }

    function count1(o) {
        if (is_array_like(o)) {
            return o.length;
        } else {
            return keys(o).length;
        }
    }

    function count_obj(pred, coll) {
        return filter(pred, coll).length;
    }

    function count_pred(pred, coll) {
        var cnt = 0,
            idx = coll.length;
        while (--idx > -1) {
            if (pred(coll[idx])) {
                ++cnt;
            }
        }
        return cnt;
    }

    function drop(items_number_to_drop, array_like) {
        return _slice(array_like, items_number_to_drop);
    }

    function drop_last(chars_to_drop, string) {
        var len = string.length;
        if (chars_to_drop > len) {
            return "";
        } else {
            return string.substring(0, len - chars_to_drop);
        }
    }

    function each(fn, coll) {
        switch (arguments.length) {
            case 0:
            case 1:
                throw new Error("Each doesn't have a signature of that arity");
            case 2:
                return each2(fn, coll);
            case 3:
                return each3(fn, coll, arguments[2]);
            default:
                return eachn.apply(null, arguments);
        }
    }

    function each2(fn, arr) {
        for (var i = -1, len = arr.length; ++i < len;) {
            fn(arr[i]);
        }
    }

    function each3(fn, arr1, arr2) {
        var length_of_shortest = Math.min(arr1.length, arr2.length);
        for (var i = -1; ++i < length_of_shortest;) {
            fn(arr1[i], arr2[i]);
        }
    }

    function calc_shortest_length(arrs) {
        return apply(Math.min, map2(count1, arrs));
    }

    /**
     * Variant of `each` that traverses `n` arrays with `fn`
     * fn, array1, array2, array3...
     */
    function eachn(fn) {
        var args = arguments,
            arrs = rest(args),
            shortest_len = calc_shortest_length(arrs),
            local_pluck = pluck,
            local_apply = apply,
            i = -1;
        while (++i < shortest_len) {
            local_apply(fn, local_pluck(i, arrs));
        }
    }

    function each_idx(fn, arr) {
        if (arguments.length === 2) {
            each_idx2(fn, arr);
        } else {
            each_idxn.apply(null, arguments);
        }
    }

    function each_idx2(fn, arr) {
        var len = arr.length,
            i = -1;
        while (++i < len) {
            fn(arr[i], i);
        }
    }

    function each_idxn(fn, arrs) {
        var arrs = rest(arguments),
            shortest_len = calc_shortest_length(arrs),
            local_pluck = pluck,
            local_apply = apply,
            i = -1,
            args;
        while (++i < shortest_len) {
            args = local_pluck(i, arrs);
            args.push(i);
            local_apply(fn, args);
        }
    }

    function check_keys(obj, keys_to_check) {
        return every(wrap_invoke_obj(obj), keys_to_check);
    }

    function check_true(val) {
        return val === true;
    }

    function every(pred, coll) {
        if (!coll) {
            coll = pred;
            pred = check_true;
        }
        if (is_empty(coll)) {
            return true;
        }
        return every_fn(pred, coll);
    }

    function every_fn(fn, coll) {
        return a_reduce(coll, true, function (v1, v2) {
            return v1 && fn(v2) || Reduced(false);
        });
    }

    function filter(some_criteria, array) {
        switch (typeof some_criteria === 'undefined' ? 'undefined' : _typeof(some_criteria)) {
            case "string":
                return filter_prop(some_criteria, array);
            case "function":
                return filter_fn(some_criteria, array);
            case "object":
                if (is_regexp(some_criteria)) {
                    return filter_re(some_criteria, array);
                } else {
                    switch (count1(keys(some_criteria))) {
                        case 0:
                            throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
                        case 1:
                            return filter_obj_1kv(some_criteria, array);
                        case 2:
                            return filter_obj_2kv(some_criteria, array);
                        default:
                            return filter_obj(some_criteria, array);
                    }
                }
                break;
            default:
                throw Errors.UNEXPECTED_TYPE;
        }
    }

    function filter_fn(fn, arr) {
        var res = [],
            len = arr.length,
            i = -1,
            item;
        while (++i < len) {
            item = arr[i];
            if (fn(item)) {
                res.push(item);
            }
        }
        return res;
    }

    function filter_prop(prop_name, arr) {
        var res = [],
            len = arr.length,
            i = -1,
            item;
        while (++i < len) {
            item = arr[i];
            if (item[prop_name]) {
                res.push(item);
            }
        }
        return res;
    }

    function filter_obj_1kv(obj, array) {
        var _read_1kv = read_1kv(obj),
            _read_1kv2 = _slicedToArray(_read_1kv, 2),
            key = _read_1kv2[0],
            val = _read_1kv2[1];

        var results = [];
        var len = array.length;
        var i = -1;
        while (++i < len) {
            if (array[i][key] === val) {
                results.push(array[i]);
            }
        }
        return results;
    }

    function filter_obj_2kv(obj, array) {
        var _keys2 = keys(obj),
            _keys3 = _slicedToArray(_keys2, 2),
            key1 = _keys3[0],
            key2 = _keys3[1],
            _ref = [obj[key1], obj[key2]],
            val1 = _ref[0],
            val2 = _ref[1],
            results = [],
            len = array.length;

        var i = -1,
            item;
        while (++i < len) {
            item = array[i];
            if (item[key1] === val1 && item[key2] === val2) {
                results.push(item);
            }
        }
        return results;
    }

    function filter_obj(obj, array) {
        return filter_fn(function (item) {
            return o_match(obj, item);
        }, array);
    }

    function filter_re(regex, strings) {
        return filter_fn(function (str) {
            return regex.test(str);
        }, strings);
    }

    function find(some_criteria, array) {
        var item_idx = find_index(some_criteria, array);
        if (item_idx > -1) {
            return array[item_idx];
        }
    }

    function find_index(pred, array) {
        switch (typeof pred === 'undefined' ? 'undefined' : _typeof(pred)) {
            case "string":
                return find_index_prop(pred, array);
            case "function":
                return find_index_fn(pred, array);
            case "boolean":
            case "number":
                return index_of(pred, array);
            case "object":
                switch (count1(keys(pred))) {
                    case 0:
                        throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
                    case 1:
                        return find_index_obj_1kv(pred, array);
                    case 2:
                        return find_index_obj_2kv(pred, array);
                    default:
                        return find_index_obj(pred, array);
                }
                break;
            default:
                throw Errors.UNEXPECTED_TYPE;
        }
    }

    function find_index_fn(fn, array) {
        var idx, item, k, len3;
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx];
            if (fn(item)) {
                return idx;
            }
        }
        return -1;
    }

    function find_index_prop(prop_name, array) {
        var idx, item, k, len3;
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx];
            if (item[prop_name]) {
                return idx;
            }
        }
        return -1;
    }

    function find_index_obj_1kv(obj_with_1kv_pair, array) {
        var kvpair1 = read_1kv(obj_with_1kv_pair);
        var key = kvpair1[0];
        var val = kvpair1[1];
        var len = array.length;
        var idx = -1;
        while (++idx < len) {
            if (array[idx][key] === val) {
                return idx;
            }
        }
        return -1;
    }

    function find_index_obj_2kv(obj_with_2kv_pair, array) {
        var o_keys = keys(obj_with_2kv_pair);
        var o_vals = vals(obj_with_2kv_pair);
        var key1 = o_keys[0],
            key2 = o_keys[1],
            val1 = o_vals[0],
            val2 = o_vals[1];
        var len = array.length;
        var idx = -1,
            item;
        while (++idx < len) {
            item = array[idx];
            if (item[key1] === val1 && item[key2] === val2) {
                return idx;
            }
        }
        return -1;
    }

    function find_index_obj(obj, array) {
        var idx, item, k, len3;
        for (idx = k = 0, len3 = array.length; k < len3; idx = ++k) {
            item = array[idx];
            if (o_match(obj, item)) {
                return idx;
            }
        }
        return -1;
    }

    function first(array) {
        return array[0];
    }

    function equal_bool(b1, b2) {
        return b1 === b2;
    }

    function equal_number(n1, n2) {
        return n1 === n2;
    }

    function dispatch_find_index_matcher(pred) {
        switch (typeof pred === 'undefined' ? 'undefined' : _typeof(pred)) {
            case 'function':
                return pred;
            case 'boolean':
                return partial(equal_bool, pred);
            case 'number':
                return partial(equal_number, pred);
            default:
                throw new Error("No matcher for " + (typeof pred === 'undefined' ? 'undefined' : _typeof(pred)) + " yet");
        }
    }

    function find_index_last(pred, array) {
        return find_index_last_iter(dispatch_find_index_matcher(pred), array);
    }

    function find_index_last_iter(iter_fn, array) {
        var i = array.length;
        while (--i > -1) {
            if (iter_fn(array[i], i, array)) {
                return i;
            }
        }
        return -1;
    }

    function flatten(arr) {
        if (is_empty(arr)) {
            return [];
        } else {
            return apply(cat, arr);
        }
    }

    function index_of(item, array) {
        return native_index_of.call(array, item);
    }

    function insert_at(items, idx, item) {
        items.splice(idx, 0, item);
        return items;
    }

    function last(list) {
        return list[dec(count1(list))];
    }

    function list() {
        var args = arguments;
        return args.length > 0 ? __slice(args) : [];
    }

    /**
     * Returns a list from its arguments, without falsee values
     */
    function list_compact() {
        var result = [],
            len = arguments.length,
            k = -1;
        while (++k < len) {
            if (!!arguments[k]) {
                result.push(arg);
            }
        }
        return result;
    }

    function log_pipe(val) {
        console.log.apply(console, val);
        return val;
    }

    function next(arr, item) {
        return arr[index_of(item, arr) + 1];
    }

    function prev(arr, item) {
        return arr[index_of(item, arr) - 1];
    }

    function type_of(mixed) {
        return typeof mixed === 'undefined' ? 'undefined' : _typeof(mixed);
    }

    function type_of2(val) {
        return to_string.call(val);
    }

    /**
     * @signature arr
     * @signature criterion, arr
     */
    function sort(criterion, arr) {
        switch (arguments.length) {
            case 1:
                return criterion.sort();
            case 2:
                if (2 > arr.length) {
                    return slice(arr);
                }
                switch (type_of(criterion)) {
                    case "string":
                        return sort_prop(criterion, arr);
                    case "array":
                        return sort_multi(criterion, arr);
                    case "function":
                        return sort_fn(criterion, arr);
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
        return pluck('val', sort_suitable_arr.sort(compare_fn));
    }

    function _suit_sort(prop, obj) {
        return {
            val: obj,
            criteria: obj[prop]
        };
    }

    function _compare_numeric(obj1, obj2) {
        return obj1.criteria - obj2.criteria;
    }

    var native_locale_compare = String.prototype.localeCompare;

    function _compare_string(obj1, obj2) {
        return native_locale_compare.call(obj1.criteria, obj2.criteria);
    }

    function sort_multi(props_arr, arr) {}
    function sort_fn(compare_fn, arr) {
        return arr.sort(compare_fn);
    }

    function map(mapper, coll) {
        switch (arguments.length) {
            case 0:
            case 1:
                throw new Error("`map` doesn't have a signature of that arity (0 or 1)");
            case 2:
                switch (typeof mapper === 'undefined' ? 'undefined' : _typeof(mapper)) {
                    case 'function':
                        return map2(mapper, coll);
                    case 'string':
                        return pluck(mapper, coll);
                    case 'object':
                        return o_map(mapper, coll);
                }
                break;
            case 3:
                return map3(mapper, coll, arguments[2]);
            default:
                return mapn(mapper, rest(arguments));
        }
    }

    function _async_mapper(err_fn, map_fn, accumulator, report_arr, item, idx) {
        return map_fn(item, function (err, res) {
            if (err) {
                err_fn(err);
                return;
            }
            accumulator[idx] = res;
            report_arr[idx] = true;
        });
    }

    /**
     * Does asynchronous map of a coll
     * @param {function} map_fn(object: item, onresult: function(err, res))
     * @param {array} items
     * @param {function(err, res)} on_res
     */
    function map_async(map_fn, items, on_res) {
        var len = items.length,
            help_arr = repeat(len, false),
            res_arr = make_array(len);
        var int_id = set_interval(2, function () {
            if (every(help_arr)) {
                clearInterval(int_id);
                return on_res(null, res_arr);
            }
        });
        function err_fn(err) {
            clearInterval(int_id);
            return on_res(err);
        }
        return each_idx2(partial(_async_mapper, err_fn, map_fn, res_arr, help_arr), items);
    }

    /**
     * Special array creation helper.
     * V8 recommends to create small arrays fixed size, and large arrays with dynamic size
     */
    function make_array(len) {
        return len > THRESHOLD_LARGE_ARRAY_SIZE && [] || new Array(len);
    }

    function map2(fn, arr) {
        var i = -1,
            len = arr.length,
            result = make_array(len);
        while (++i < len) {
            result[i] = fn(arr[i]);
        }
        return result;
    }

    function map3(fn, arr1, arr2) {
        var length_of_shortest = Math.min(arr1.length, arr2.length),
            i = -1,
            result = make_array(length_of_shortest);
        while (++i < length_of_shortest) {
            result[i] = fn(arr1[i], arr2[i]);
        }
        return result;
    }

    function mapn(fn, arrs) {
        console.log('mapn', fn, arrs);
        var shortest_len = apply(Math.min, map2(count1, arrs)),
            i = -1,
            local_pluck = pluck,
            local_apply = apply,
            result = make_array(shortest_len);
        while (++i < shortest_len) {
            result[i] = local_apply(fn, local_pluck(i, arrs));
        }
        return result;
    }

    function prelast(array) {
        return array[count1(array) - 2];
    }

    function push(arr, item) {
        arr.push(item);
        return arr;
    }

    function push_all(arr, items_to_push_arr) {
        arr.push.apply(arr, items_to_push_arr);
        return arr;
    }

    /**
     * Classic reduce, with two signatures
     * (fn, arr), (fn, initial_value, arr)
     */
    function reduce(fn, val, array) {
        var idx = -1;
        if (!array && is_array_like(val)) {
            array = val;
            val = fn(first(array), second(array));
            idx = 1;
        }
        var len = array.length;
        while (++idx < len && (!val || val.constructor !== ReducedClass)) {
            val = fn(val, array[idx]);
        }
        if (val && val.constructor === ReducedClass) {
            return val.val;
        } else {
            return val;
        }
    }

    /**
     * Reduce right
     */
    function reducer(fn, val, arr) {
        var idx = -1;
        if (!arr && is_array(val)) {
            arr = val;
            val = fn(last(arr), prelast(arr));
            idx = count1(arr) - 2;
        } else {
            idx = count1(arr);
        }
        while (--idx > -1) {
            val = fn(val, arr[idx]);
        }
        return val;
    }

    function reject(some_criteria, array) {
        switch (typeof some_criteria === 'undefined' ? 'undefined' : _typeof(some_criteria)) {
            case "string":
                return reject_prop(some_criteria, array);
            case "function":
                return reject_fn(some_criteria, array);
            case "object":
                switch (count1(keys(some_criteria))) {
                    case 0:
                        throw Errors.NO_KEY_VALUE_PAIR_IN_HASH;
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
    }

    function reject_fn(fn, array) {
        var results = [];
        for (var k = -1, len = array.length; ++k < len;) {
            if (!fn(array[k])) {
                results.push(array[k]);
            }
        }
        return results;
    }

    function reject_prop(prop_name, array) {
        return filter_fn(function (x) {
            return !x[prop_name];
        }, array);
    }

    function reject_obj_1kv(one_kv_pair_object, array) {
        var _read_1kv3 = read_1kv(one_kv_pair_object),
            _read_1kv4 = _slicedToArray(_read_1kv3, 2),
            key = _read_1kv4[0],
            val = _read_1kv4[1];

        return filter_fn(function (x) {
            return x[key] !== val;
        }, array);
    }

    function reject_obj_2kv(two_kv_pairs_object, array) {
        var _keys4 = keys(obj),
            _keys5 = _slicedToArray(_keys4, 2),
            key1 = _keys5[0],
            key2 = _keys5[1],
            _ref2 = [obj[key1], obj[key2]],
            val1 = _ref2[0],
            val2 = _ref2[1];

        return filter_fn(function (x) {
            return item[key1] !== val1 || item[key2] !== val2;
        }, array);
    }

    function reject_obj(object, array) {
        return filter_fn(function (item) {
            return !o_match(object, item);
        }, array);
    }

    function remap(fn, arr) {
        switch (arguments.length) {
            case 2:
                return remap2(fn, arr);
            case 3:
                return remap3(fn, arguments[1], arguments[2]);
        }
    }

    function remap2(fn, arr) {
        for (var k = -1, len = arr.length; ++k < len;) {
            arr[k] = fn(arr[k]);
        }
        return arr;
    }

    function remap3(fn, prop, arr) {
        var item;
        for (var k = -1, len = arr.length; ++k < len;) {
            item = arr[k];
            item[prop] = fn(item[prop]);
        }
        return arr;
    }

    function remove(item, arr) {
        var idx = index_of(item, arr);
        return idx > -1 && remove_at(idx, arr);
    }

    function remove_at(idx, arr) {
        return splice(arr, idx, 1);
    }

    function repeat(times, value) {
        var array = make_array(times);
        while (--times > -1) {
            array[times] = value;
        }
        return array;
    }

    function repeatf(times, fn) {
        var array = make_array(times);
        while (--times > -1) {
            array[times] = fn();
        }
        return array;
    }

    function rest(arr) {
        return _slice(arr, 1);
    }

    function reverse(arr) {
        var len = arr.length,
            i = 0,
            j = len,
            res = new Array(len);
        while (--j > -1) {
            res[i] = arr[j];
            i += 1;
        }
        return res;
    }

    var splice = bind(Function.prototype.call, Array.prototype.splice);

    function second(array) {
        return array[1];
    }

    function take(items_number_to_take, array_like) {
        return slice(array_like, 0, items_number_to_take);
    }

    function third(arr) {
        return arr[2];
    }

    function union(arr1, arr2) {
        return arr1.concat(difference_sets(arr2, arr1));
    }

    function unshift(arr, item) {
        arr.unshift(item);
        return arr;
    }

    function without(item, arr) {
        remove(item, arr);
        return arr;
    }

    function invoke(method_name, coll) {
        switch (arguments.length) {
            case 2:
                return invoke0(method_name, coll);
            case 3:
                return invoke1(method_name, coll, arguments[2]);
            default:
                return invoken.apply(null, arguments);
        }
    }

    function invoke0(method_name, arr) {
        var len = arr.length,
            results = make_array(len),
            i = -1;
        while (++i < len) {
            results[i] = arr[i][method_name]();
        }
        return results;
    }

    function invoke1(method_name, arg, arr) {
        var len = arr.length,
            results = make_array(len),
            i = -1;
        while (++i < len) {
            results[i] = arr[i][method_name](arg);
        }
        return results;
    }

    function invoken(method_name, arg1, arr) {
        var fn_args = arguments,
            fn_args_len = fn_args.length,
            args = 3 < fn_args_len ? _slice(fn_args, 1, fn_args_len - 1) : [arg1],
            arr = fn_args[fn_args_len - 1],
            len = arr.length,
            results = make_array(len),
            i = -1,
            item;
        while (++i < len) {
            item = arr[i];
            results[i] = item[method_name].apply(item, args);
        }
        return results;
    }

    function invokem(method_name, arr) {
        switch (arguments.length) {
            case 2:
                return invokem0(method_name, arr);
            case 3:
                return invokem1(method_name, arr, arguments[2]);
            default:
                return invokemn.apply(null, arguments);
        }
    }

    function invokem0(method_name, arr) {
        var i = -1,
            len = arr.length;
        while (++i < len) {
            arr[i][method_name]();
        }
    }

    function invokem1(method_name, arg, arr) {
        var i = -1,
            len = arr.length;
        while (++i < len) {
            arr[i][method_name](arg);
        }
    }

    function invokemn(method_name, arg1, arr) {
        var fn_args = arguments,
            fn_args_len = fn_args.length,
            args = 3 < fn_args_len ? _slice(fn_args, 1, fn_args_len - 1) : [arg1],
            arr = fn_args[fn_args_len - 1],
            len = arr.length,
            i = -1;
        while (++i < len) {
            arr[i][method_name].apply(arr[i], args);
        }
    }

    function pluck(key, coll) {
        var len = coll.length,
            result = make_array(len),
            i = -1;
        while (++i < len) {
            result[i] = coll[i][key];
        }
        return result;
    }

    /**
     * Writes a property `prop_name` of `dst_coll` to `dst_coll` objects
     * from `src_coll` values
     */
    function write(dst_coll, prop_name, src_coll) {
        var idx = dst_coll.length;
        while (--idx > -1) {
            dst_coll[idx][prop_name] = src_coll[idx];
        }
        return dst_coll;
    }

    function unique(prop, array) {
        if (array) {
            return unique_by_prop(prop, array);
        } else {
            array = prop;
            if (is_empty(array)) {
                return [];
            } else if (is_number(array[0]) || is_string(array[0])) {
                return unique_plain(array);
            } else {
                throw Error("only propped uniq and plain number or string uniqueing supported");
            }
        }
    }

    /**
     * Returns a set of elements compared on equality by prop value
     * Works only for atomic values, like string or numeric ids
     */
    function unique_by_prop(prop_name, arr) {
        var help_hash = {},
            out = [];
        each2(function (item) {
            var prop_val = item[prop_name];
            if (help_hash[prop_val] === void 0) {
                help_hash[prop_val] = true;
                out.push(item);
            }
        }, arr);
        return out;
    }

    /**
     * Faster unique for atomic values
     */
    function unique_plain(arr) {
        var help_hash = {},
            out = [];
        each2(function (val) {
            if (help_hash[val] === void 0) {
                help_hash[val] = true;
                out.push(val);
            }
        }, arr);
        return out;
    }

    /**
     * Returns a function that will operate as function of keys of the object
     * @param {object} o
     */
    function wrap_invoke_obj(o) {
        return function (key) {
            return o[key];
        };
    }

    /**
     * Assigns multiple objects to `dst`
     */
    function assign(dst, sources) {
        dst = dst == null ? {} : dst;
        return reduce(assign_one, dst, rest(arguments));
    }

    /**
     * Assigns only selected keys
     */
    function assign_keys(keys, dst, src) {
        var i = -1,
            l = keys.length,
            key;
        while (++i < l) {
            key = keys[i];
            if (void 0 !== src[key]) {
                dst[key] = src[key];
            }
        }
        return dst;
    }

    function assign_one(dst, src) {
        var keys = keys(src),
            i = -1,
            l = keys.length;
        while (++i < l) {
            dst[keys[i]] = src[keys[i]];
        }
        return dst;
    }

    function clone(data) {
        if (is_object(data)) {
            if (is_array(data)) {
                return __slice(data);
            } else {
                return clone_obj(data);
            }
        } else {
            throw Errors.UNEXPECTED_TYPE;
        }
    }

    function cloneassign(dst, var_src) {
        return reduce(assign_one, clonedeep(dst), drop(1, arguments));
    }

    function clonedeep(src) {
        var dst = is_array(src) && [] || {}; // destination object or array
        return _clonedeep(src, dst, [dst], // destination stack
        [src] // source object stack
        );
    }

    /**
     * Shallow clone for object
     */
    function clone_obj(obj) {
        return assign_one({}, obj);
    }

    function _clonedeep(src, dst, stack_dst, stack_src) {
        var child_dst, key, val, val_idx;
        for (key in src) {
            val = src[key];
            if (is_atomic(val)) {
                dst[key] = val;
            } else if (is_date(val)) {
                dst[key] = new Date(val.getTime());
            } else {
                val_idx = index_of(val, stack_src);
                if (val_idx === -1) {
                    dst[key] = child_dst = is_array(val) && [] || {};
                    stack_src.push(val);
                    stack_dst.push(child_dst);
                    _clonedeep(val, child_dst, stack_dst, stack_src);
                } else {
                    dst[key] = stack_dst[val_idx];
                }
            }
        }
        return dst;
    }

    function _clonedeep2(src) {
        var dst = is_array(src) ? [] : {},
            cur_src = src,
            cur_dst = dst,
            stack_src = [src],
            stack_dst = [dst],
            stack_act = [],
            cur_keys = is_array(cur_src) ? range(cur_src.length) : reverse(keys(cur_src)),
            cur_key_idx = cur_keys.length;
        //
        while (--cur_key_idx > -1) {
            var key = cur_keys[cur_key_idx],
                val = cur_src[key];
            if (is_atomic(val)) {
                cur_dst[key] = val;
            } else if (is_date(val)) {
                cur_dst[key] = new Date(val.getTime());
            } else {
                var val_idx = index_of(val, stack_src);
                if (val_idx < 0) {
                    var child_dst = is_array(val) && [] || {};
                    cur_dst[key] = child_dst;
                    stack_act.push([cur_src, cur_dst, cur_keys, cur_key_idx]);
                    cur_src = val;
                    cur_dst = child_dst;
                    cur_keys = is_array(cur_src) ? range(cur_src.length) : reverse(keys(cur_src));
                    cur_key_idx = cur_keys.length;
                    stack_src.push(cur_src);
                    stack_dst.push(cur_dst);
                } else {
                    cur_dst[key] = stack_dst[val_idx];
                }
            }
            while (0 === cur_key_idx && stack_act.length > 0) {
                var _stack_act$pop = stack_act.pop();

                var _stack_act$pop2 = _slicedToArray(_stack_act$pop, 4);

                cur_src = _stack_act$pop2[0];
                cur_dst = _stack_act$pop2[1];
                cur_keys = _stack_act$pop2[2];
                cur_key_idx = _stack_act$pop2[3];
            }
        }
        return dst;
    }

    function create(ctor, arg) {
        return new ctor(arg);
    }

    function defaults(dst) {
        if (dst == null) {
            dst = {};
        }
        return reduce(defaults2, dst, rest(arguments));
    }

    function defaults2(dst, src) {
        for_own(function (key, value) {
            if (dst[key] === void 0) {
                dst[key] = value;
            }
        }, src);
        return dst;
    }

    function difference(o1, o2) {
        if (is_object(o1) && is_object(o2)) {
            if (is_array(o1) && is_array(o2)) {
                return difference_sets(o1, o2);
            } else {
                return difference_objs_vals(o1, o2);
            }
        } else {
            throw new TypeError("Tried to find difference between not objects");
        }
    }

    /**
     * Calculate an object with keys and values that differ between obj
     */
    function difference_objs_vals(o1, o2) {
        var o1_keys = keys(o1),
            idx = o1_keys.length,
            res = {};
        while (--idx > -1) {
            var key = o1_keys[idx],
                val1 = o1[key],
                val2 = o2[key];
            if (val2 !== void 0 && !equal2(val1, val2)) {
                res[key] = val1;
            }
        }
        return res;
    }

    function difference_sets(set_a, set_b, contains_fn) {
        if (contains_fn == null) {
            contains_fn = contains;
        }
        return a_reject(set_a, function (item) {
            return contains_fn(item, set_b);
        });
    }

    function set_symmetric_difference(set_a, set_b, contains_fn) {
        return [difference_sets(set_a, set_b, contains_fn), difference_sets(set_b, set_a, contains_fn)];
    }

    /**
     * Variadic equality checker
     * @signature vals...
     */
    function equal() {
        var args_length = arguments.length,
            all_args_equal = true;
        while (all_args_equal && --args_length > 0) {
            all_args_equal = equal_r(arguments[args_length], arguments[args_length - 1]);
        }
        return all_args_equal;
    }

    /**
     * Shallow equality check for objects and arrays
     */
    function equal2(o1, o2) {
        if (o1 == null || o1 == false) {
            // special falsee trick from CoffeeScript
            return o1 === o2;
        } else if (is_object(o1) && is_object(o2)) {
            if (is_array(o1) && is_array(o2)) {
                return equal_array(o1, o2);
            } else if (is_date(o1)) {
                return o1.valueOf() === o2.valueOf();
            } else {
                return equal_object(o1, o2);
            }
        } else {
            return o1 === o2;
        }
    }

    /**
     * Recursive loop-free equality checker
     */
    function equal_r(o1, o2) {
        if (!is_mergeable(o1) || !is_mergeable(o2) || o1 === o2) {
            return o1 === o2;
        }
        //
        var call_stack = [],
            src_stack = [],
            cur_o1 = o1,
            cur_o2 = o2,
            cur_keys = keys(cur_o1),
            cur_key_idx = cur_keys.length;
        //
        if (!equal_array_str(cur_keys, keys(cur_o2))) {
            return false;
        }
        //
        while (--cur_key_idx > -1) {
            var key = cur_keys[cur_key_idx],
                val_o1 = cur_o1[key],
                val_o2 = cur_o2[key];
            //
            if (!hasOwnProperty.call(cur_o2, key)) {
                return false;
            } else if (not_mergeable(val_o1) && val_o1 !== val_o2) {
                return false;
            } else if (index_of(val_o1, src_stack) === -1) {
                call_stack.push([cur_o1, cur_o2, cur_keys, cur_key_idx]);
                src_stack.push(val_o1);
                //
                cur_o1 = val_o1;
                cur_o2 = val_o2;
                cur_keys = keys(cur_o1);
                cur_key_idx = cur_o1.length;
                //
                if (!equal_array_str(cur_keys, keys(cur_o2))) {
                    return false;
                }
            }
            //
            while (0 === cur_key_idx && 0 !== call_stack.length) {
                var call_data = call_stack.pop();
                cur_o1 = call_data[0];
                cur_o2 = call_data[1];
                cur_keys = call_data[2];
                cur_key_idx = call_data[3];
            }
        }
        //
        return true;
    }

    function equal_array(arr1, arr2) {
        var len1 = arr1.length,
            len2 = arr2.length;
        return 0 === len1 && 0 === len2 || len1 === len2 && equal_array_start(arr1, arr2);
    }

    function equal_array_str(arr1, arr2) {
        var len1 = arr1.length,
            len2 = arr2.length;
        if (0 === len1 && 0 === len2) {
            return true;
        } else if (len1 !== len2) {
            return false;
        } else {
            arr1.sort();
            arr2.sort();
            return equal_array_start(arr1, arr2);
        }
    }

    function equal_array_start(arr1, arr2) {
        return reduce(and_r, true, map(equal_val, arr1, arr2));
    }

    /**
     * Tests two objects for shallow equality
     */
    function equal_object(o1, o2) {
        var keys1 = keys(o1),
            keys2 = keys(o2);
        if (!(keys1.length === keys2.length && equal_set(keys1, keys2))) {
            return false;
        }
        var vals1 = o_map(o1, keys1),
            vals2 = o_map(o2, keys1);
        return equal_array_start(vals1, vals2);
    }

    function equal_set(keyset1, keyset2) {
        var _set_symmetric_differ = set_symmetric_difference(keyset1, keyset2),
            _set_symmetric_differ2 = _slicedToArray(_set_symmetric_differ, 2),
            diff1 = _set_symmetric_differ2[0],
            diff2 = _set_symmetric_differ2[1];

        return is_empty(diff1) && is_empty(diff2);
    }

    function equal_val(v1, v2) {
        return v1 === v2;
    }

    function extend(extended, extension) {
        return assign(Object.create(extended), extension);
    }

    function flatten_path(prop, obj, opts) {
        opts = opts == null ? { include_root: false } : opts;
        //
        var res = opts.include_root && [obj] || [];
        while (obj = obj[prop]) {
            res.push(obj);
        }
        return res;
    }

    function flattenp(key, root, arg1) {
        var include_root = (arg1 != null ? arg1 : {
            include_root: true
        }).include_root;
        var accumulator = include_root && [root] || [];
        return flattenp_recursive(key, root, accumulator);
    }

    /**
     * Takes a key, an object and accumulator and recursively walks down the path
     * to collect accumulator
     * @param {string} key
     * @param {object} root
     * @param {array} accumulator
     */
    function flattenp_recursive(key, root, accumulator) {
        push_all(accumulator, root[key]);
        if (root[key]) {
            each2(function (son) {
                flattenp_recursive(key, son, accumulator);
            }, root[key]);
        }
        return accumulator;
    }

    function for_own(fn, obj) {
        each2(function (key) {
            fn(key, obj[key]);
        }, keys(obj));
    }

    function index_by(index_prop, list_to_index, accumulator) {
        accumulator = accumulator || {};
        var idx = list_to_index.length;
        while (--idx > -1) {
            accumulator[item[index_prop]] = list_to_index[idx];
        }
        return accumulator;
    }

    /**
     * Returns new collection where each element is interposed with separator
     */
    function interpose(sep, coll) {
        var coll_len = coll.length,
            seps_count = coll_len - 1,
            new_len = coll_len + seps_count,
            new_res = make_array(new_len),
            i_coll = -1,
            i_res = 0;
        while (++i_coll < coll_len) {
            new_res[i_res] = coll[i_coll];
            if (i_res + 1 < new_len) {
                new_res[i_res + 1] = sep;
            }
            i_res += 2;
        }
        return new_res;
    }

    /**
     * Returns a new set which will be an instersection of set1 and set2
     * @param {array} set1
     * @param {array} set2
     * @param {function} contains_fn
     */
    function intersection(set1, set2, contains_fn) {
        contains_fn = contains_fn || contains;
        return filter_fn(function (item) {
            return contains_fn(item, set2);
        }, set1);
    }

    /**
     * Inverses object
     * Designed for plain <string -> string> objects.
     * inverse_object({a: 1, b: 2}) // yields {'1': 'a', '2': 'b'}
     */
    function inverse_object(obj) {
        var res = {},
            _keys = keys(obj),
            i = _keys.length;
        while (--i > -1) {
            res[obj[_keys[i]]] = _keys[i];
        }
        return res;
    }

    function keys(hash) {
        return Object.keys(hash);
    }

    function merge(dst, src) {
        var call_stack = [],
            src_stack = [],
            cur_dst = dst,
            cur_src = src,
            cur_keys = keys(src),
            cur_key_idx = cur_keys.length;
        //
        while (--cur_key_idx > -1) {
            var key = cur_keys[cur_key_idx],
                val = cur_src[key];
            if (!hasOwnProperty.call(cur_dst, key) || not_mergeable(val)) {
                cur_dst[key] = val;
                if (is_mergeable(val)) {
                    src_stack.push(val);
                }
            } else if (index_of(val, src_stack) === -1) {
                call_stack.push([cur_dst, cur_src, cur_keys, cur_key_idx]);
                src_stack.push(val);
                //
                cur_dst = cur_dst[key];
                cur_src = cur_src[key];
                cur_keys = keys(cur_src);
                cur_key_idx = cur_keys.length;
            }
            //
            while (0 === cur_key_idx && 0 !== call_stack.length) {
                var call_data = call_stack.pop();
                cur_dst = call_data[0];
                cur_src = call_data[1];
                cur_keys = call_data[2];
                cur_key_idx = call_data[3];
            }
        }
        return dst;
    }

    function merge_with(fn, o1, o2) {
        var res = {},
            keyset = unique(cat(keys(o1), keys(o2))),
            idx = keyset.length;
        while (--idx > -1) {
            var key = keyset[idx],
                v1 = o1[key],
                v2 = o2[key];
            if (v1 !== void 0 && v2 !== void 0) {
                res[key] = fn(v1, v2);
            } else {
                res[key] = v1 || v2;
            }
        }
        return res;
    }

    function omit(obj, props) {
        return omit_all(obj, rest(arguments));
    }

    function omit_all(obj, props_arr) {
        var desired_keys = difference_sets(keys(obj), props_arr);
        return pick_all(obj, desired_keys);
    }

    function o_for_own(obj, fn) {
        return for_own(fn, obj);
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
            results[i] = hash[keys_list[i]];
        }
        return results;
    }

    /**
     * Tests the subject if its properties match each prop of criteria_obj.
     *
     */
    function o_match(criteria_obj, subject) {
        var keys = keys(criteria_obj),
            len = keys.length;
        var i = -1;
        while (++i < len) {
            if (subject[keys[i]] !== criteria_obj[keys[i]]) {
                return false;
            }
        }
        return true;
    }

    function o_set(obj, key, val) {
        return obj[key] = val;
    }

    function pull(key, hash) {
        var val = hash[key];
        delete hash[key];
        return val;
    }

    /**
     * @param {object} obj
     * @param {...string} props
     */
    function pick(obj, props) {
        return pick_all(obj, rest(arguments));
    }

    /**
     * @param {object} obj
     * @param {array<string>} props
     */
    function pick_all(obj, props) {
        var res = {},
            idx = props.length,
            prop;
        while (--idx > -1) {
            prop = props[idx];
            if (obj[prop] !== void 0) {
                res[prop] = obj[prop];
            }
        }
        return res;
    }

    function transform(fn, obj, keys) {
        return keys ? transform3(fn, obj, keys) : transform2(fn, obj);
    }

    function transform2(fn, obj) {
        var key, val;
        for (key in obj) {
            val = obj[key];
            obj[key] = fn(val);
        }
        return obj;
    }

    function transform3(fn, obj, keys) {
        each2(function (key) {
            obj[key] = fn(obj[key]);
        }, keys);
        return obj;
    }

    function update_in(obj, key, update_fn) {
        var val = obj[key];
        if (val !== void 0) {
            obj[key] = update_fn(val);
        }
        return obj;
    }

    function vals(hash) {
        return o_map(hash, keys(hash));
    }

    function zip_obj(keys, vals) {
        var obj = {};
        each3(partial(o_set, obj), keys, vals);
        return obj;
    }

    function format(template_str) {
        var args = rest(arguments);
        return template_str.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' && args[number] || match;
        });
    }

    function head(chars_to_take, str) {
        return str.substr(0, chars_to_take);
    }

    function match(regexp, source_str) {
        return source_str.match(regexp);
    }

    function matches(regexp, str) {
        if ('string' === type_of(regexp)) {
            return mk_regexp(regexp).test(str);
        } else {
            return regexp.test(str);
        }
    }

    function comma() {
        return str_join(',', __slice(arguments));
    }

    function space() {
        return str_join(' ', __slice(arguments));
    }

    function str() {
        return str_join('', __slice(arguments));
    }

    function str_breplace(map, str) {
        var regex = mk_regexp(str_join('|', keys(map)), 'ig');
        return str.replace(regex, function (seq) {
            return map[seq] || seq;
        });
    }

    function str_join(join_string, array_to_join) {
        return array_to_join.join(join_string);
    }

    /**
     * Joins an array of lines to single string
     * @param {array<string>} lines
     * @return {string}
     */
    function str_join_lines(lines) {
        return lines.join('\n');
    }

    function str_split(split_str, string_to_split) {
        return string_to_split.split(split_str);
    }

    /**
     * Splits a string by line breaks
     * @param {string} string
     * @return {array<string>}
     */
    function str_split_lines(string) {
        return string.split('\n');
    }

    function tail(chars_to_drop, str) {
        return str.substr(chars_to_drop);
    }

    function trim(str) {
        return str.trim();
    }

    function dec(num) {
        return num - 1;
    }

    function inc(num) {
        return num + 1;
    }

    function mk_regexp(rx_str, rx_settings) {
        rx_settings = rx_settings || "";
        return new RegExp(rx_str, rx_settings);
    }

    function range(start_idx, end_idx, step) {
        switch (arguments.length) {
            case 1:
                end_idx = start_idx;
                start_idx = 0;
                step = 1;
                break;
            case 2:
                step = 1;
                break;
            default:
                break;
        }
        var length = Math.ceil(Math.abs(end_idx - start_idx) / step),
            array = new Array(length),
            i = -1;
        start_idx -= step;
        while (++i < length) {
            array[i] = start_idx += step;
        }
        return array;
    }

    function read_1kv(obj_with_1kv_pair) {
        var key = keys(obj_with_1kv_pair)[0];
        return [key, obj_with_1kv_pair[key]];
    }

    /**
     * Recursively walks over coll and applies the `fn`
     * @param fn {function} function that operates on the node.
     *  signature: son, parent, son_idx, depth
     * @param parent {hash} a tree whose children lie in the children
     *  list (i.e. ordered collection).
     * @param depth: indicates depth of recursion
     */
    function recurse(fn, parent, depth) {
        depth = depth == null ? 1 : depth + 1;
        var children = parent.children,
            len = children.length,
            i = -1,
            k = -1;
        while (++i < len) {
            fn(children[i], parent, i, depth);
        }
        while (++k < len) {
            recurse(fn, children[k], depth);
        }
        return parent;
    }

    function sum2(a, b) {
        return a + b;
    }

    function sumn() {
        var res = 0,
            i = arguments.length;
        while (--i > -1) {
            res += arguments[i];
        }
        return res;
    }

    function a_sum(nums_array) {
        return reduce(sum2, 0, nums_array);
    }

    function set(prop_name, val, hash) {
        hash[prop_name] = val;
    }

    /**
     * Raw measurement for function execution time
     * @return {int} milliseconds for `fn` execution
     */
    function time(fn) {
        var time_start = Date.now();
        fn();
        return Date.now() - time_start;
    }

    var toStringTester = Object.prototype.toString;

    var ToStringFootprints = {
        REGEXP: '[object RegExp]'
    };

    function is_regexp(mixedValue) {
        return ToStringFootprints.REGEXP === toStringTester.call(mixedValue);
    }
    var not_regexp = complement(is_regexp);

    function once(fn) {
        var run = false;
        return function () {
            if (run) {
                return;
            }
            run = true;
            //
            fn.call(this, arguments);
        };
    }

    /**
     * Returns new function that will invoke the original function with a delay every time.
     * Delayed function will return its `timeout_id`
     */
    function delayed(ms, payloadFunction) {
        return function () {
            var args = __slice(arguments),
                _this = this;
            return setTimeout(function () {
                payloadFunction.apply(_this, args);
            }, ms);
        };
    }

    function matches(matched_str, regexp_or_str) {
        if (not_regexp(regexp_or_str)) {
            regexp_or_str = new RegExp(regexp_or_str);
        }
        return regexp_or_str.test(matched_str);
    }

    // Aliases
    var select_keys = pick_all,
        clonedeep2 = _clonedeep2,
        concat = cat,
        detect = find,
        diff = difference,
        fastbind = bind,
        re_filter = filter_re,
        index_by_id = partial(index_by, 'id'),
        interval = set_interval,
        magic = no_operation,
        // drop
    noop = no_operation,
        pt = partial,
        ptr = partialr,
        pipeline = flow,
        pluck_id = partial(pluck, 'id'),
        set_difference = difference_sets,
        str_drop = tail,
        str_take = head,
        sum = a_sum;

    exports.a_contains = a_contains;
    exports.a_each = a_each;
    exports.a_each_idx = a_each_idx;
    exports.a_filter = a_filter;
    exports.a_find_index = a_find_index;
    exports.a_index_of = a_index_of;
    exports.a_map = a_map;
    exports.a_reduce = a_reduce;
    exports.a_reject = a_reject;
    exports.a_sum = a_sum;
    exports.and2 = and2;
    exports.add2 = add2;
    exports.any = any;
    exports.assign = assign;
    exports.assign_keys = assign_keys;
    exports.apply = apply;
    exports.bind = bind;
    exports.bind_all = bind_all;
    exports.butlast = butlast;
    exports.cat = cat;
    exports.check_keys = check_keys;
    exports.clone = clone;
    exports.cloneassign = cloneassign;
    exports.clonedeep = clonedeep;
    exports.clonedeep2 = clonedeep2;
    exports.comma = comma;
    exports.compact = compact;
    exports.compose = compose;
    exports.complement = complement;
    exports.concat = concat;
    exports.contains = contains;
    exports.count = count;
    exports.create = create;
    exports.delayed = delayed;
    exports.debug_wrap = debug_wrap;
    exports.debounce = debounce;
    exports.dec = dec;
    exports.defaults = defaults;
    exports.delay = delay;
    exports.detect = detect;
    exports.diff = diff;
    exports.difference = difference;
    exports.difference_sets = difference_sets;
    exports.drop = drop;
    exports.drop_last = drop_last;
    exports.each = each;
    exports.each_idx = each_idx;
    exports.equal = equal;
    exports.equal_array_start = equal_array_start;
    exports.equal_val = equal_val;
    exports.equal_set = equal_set;
    exports.every = every;
    exports.extend = extend;
    exports.fastbind = fastbind;
    exports.first = first;
    exports.filter = filter;
    exports.filter_fn = filter_fn;
    exports.filter_obj = filter_obj;
    exports.filter_obj_1kv = filter_obj_1kv;
    exports.filter_obj_2kv = filter_obj_2kv;
    exports.filter_prop = filter_prop;
    exports.filter_re = filter_re;
    exports.find = find;
    exports.find_index = find_index;
    exports.find_index_fn = find_index_fn;
    exports.find_index_prop = find_index_prop;
    exports.find_index_obj_1kv = find_index_obj_1kv;
    exports.find_index_obj_2kv = find_index_obj_2kv;
    exports.find_index_obj = find_index_obj;
    exports.find_index_last = find_index_last;
    exports.flatten = flatten;
    exports.flattenp = flattenp;
    exports.flatten_path = flatten_path;
    exports.flow = flow;
    exports.for_own = for_own;
    exports.format = format;
    exports.head = head;
    exports.inverse_object = inverse_object;
    exports.inc = inc;
    exports.index_by = index_by;
    exports.index_by_id = index_by_id;
    exports.index_of = index_of;
    exports.insert_at = insert_at;
    exports.intersection = intersection;
    exports.interpose = interpose;
    exports.interval = interval;
    exports.invoke = invoke;
    exports.invokem = invokem;
    exports.is_array = is_array;
    exports.is_arguments = is_arguments;
    exports.is_boolean = is_boolean;
    exports.is_date = is_date;
    exports.is_defined = is_defined;
    exports.is_empty = is_empty;
    exports.is_empty$ = is_empty$;
    exports.is_even = is_even;
    exports.is_function = is_function;
    exports.is_mergeable = is_mergeable;
    exports.is_number = is_number;
    exports.is_integer = is_integer;
    exports.is_object = is_object;
    exports.is_plain_object = is_plain_object;
    exports.is_string = is_string;
    exports.is_subset = is_subset;
    exports.is_zero = is_zero;
    exports.keys = keys;
    exports.last = last;
    exports.list = list;
    exports.list_compact = list_compact;
    exports.log_pipe = log_pipe;
    exports.map = map;
    exports.map_async = map_async;
    exports.magic = magic;
    exports.match = match;
    exports.matches = matches;
    exports.merge = merge;
    exports.merge_with = merge_with;
    exports.mk_regexp = mk_regexp;
    exports.multicall = multicall;
    exports.next = next;
    exports.no_operation = no_operation;
    exports.noop = noop;
    exports.not_array = not_array;
    exports.not_boolean = not_boolean;
    exports.not_contains = not_contains;
    exports.not_date = not_date;
    exports.not_defined = not_defined;
    exports.not_empty = not_empty;
    exports.not_empty$ = not_empty$;
    exports.not_function = not_function;
    exports.not_number = not_number;
    exports.not_object = not_object;
    exports.not_string = not_string;
    exports.not_subset = not_subset;
    exports.not_zero = not_zero;
    exports.omit = omit;
    exports.omit_all = omit_all;
    exports.once = once;
    exports.o_for_own = o_for_own;
    exports.o_map = o_map;
    exports.o_match = o_match;
    exports.partial = partial;
    exports.pbind = pbind;
    exports.periodically = periodically;
    exports.pt = pt;
    exports.ptr = ptr;
    exports.partialr = partialr;
    exports.pick = pick;
    exports.pick_all = pick_all;
    exports.pipeline = pipeline;
    exports.pluck = pluck;
    exports.pluck_id = pluck_id;
    exports.prev = prev;
    exports.pull = pull;
    exports.push = push;
    exports.push_all = push_all;
    exports.range = range;
    exports.recurse = recurse;
    exports.reduce = reduce;
    exports.Reduced = Reduced;
    exports.reducer = reducer;
    exports.reject = reject;
    exports.reject_fn = reject_fn;
    exports.reject_obj = reject_obj;
    exports.reject_obj_1kv = reject_obj_1kv;
    exports.reject_obj_2kv = reject_obj_2kv;
    exports.reject_prop = reject_prop;
    exports.remap = remap;
    exports.remove = remove;
    exports.remove_at = remove_at;
    exports.repeat = repeat;
    exports.repeatf = repeatf;
    exports.rest = rest;
    exports.reverse = reverse;
    exports.second = second;
    exports.set = set;
    exports.set_difference = set_difference;
    exports.set_symmetric_difference = set_symmetric_difference;
    exports.slice = slice;
    exports.sort = sort;
    exports.space = space;
    exports.splice = splice;
    exports.str = str;
    exports.str_breplace = str_breplace;
    exports.str_drop = str_drop;
    exports.str_join = str_join;
    exports.str_join_lines = str_join_lines;
    exports.str_split = str_split;
    exports.str_split_lines = str_split_lines;
    exports.str_take = str_take;
    exports.sum2 = sum2;
    exports.sum = sum;
    exports.sumn = sumn;
    exports.take = take;
    exports.tail = tail;
    exports.third = third;
    exports.throttle = throttle;
    exports.time = time;
    exports.transform = transform;
    exports.trim = trim;
    exports.update_in = update_in;
    exports.union = union;
    exports.unique = unique;
    exports.unshift = unshift;
    exports.vals = vals;
    exports.without = without;
    exports.write = write;
    exports.zip_obj = zip_obj;
});
