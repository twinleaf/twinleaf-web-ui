(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/jquery/dist/jquery.js
  var require_jquery = __commonJS({
    "node_modules/jquery/dist/jquery.js"(exports, module) {
      (function(global, factory) {
        "use strict";
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        } else {
          factory(global);
        }
      })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
        "use strict";
        var arr = [];
        var getProto = Object.getPrototypeOf;
        var slice = arr.slice;
        var flat = arr.flat ? function(array) {
          return arr.flat.call(array);
        } : function(array) {
          return arr.concat.apply([], array);
        };
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction2(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document2 = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc2) {
          doc2 = doc2 || document2;
          var i, val, script = doc2.createElement("script");
          script.text = code;
          if (node) {
            for (i in preservedScriptAttributes) {
              val = node[i] || node.getAttribute && node.getAttribute(i);
              if (val) {
                script.setAttribute(i, val);
              }
            }
          }
          doc2.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version = "3.6.0", jQuery = function(selector, context) {
          return new jQuery.fn.init(selector, context);
        };
        jQuery.fn = jQuery.prototype = {
          jquery: version,
          constructor: jQuery,
          length: 0,
          toArray: function() {
            return slice.call(this);
          },
          get: function(num) {
            if (num == null) {
              return slice.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          each: function(callback) {
            return jQuery.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
              return callback.call(elem, i, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return (i + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return i % 2;
            }));
          },
          eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          push,
          sort: arr.sort,
          splice: arr.splice
        };
        jQuery.extend = jQuery.fn.extend = function() {
          var options, name, src, copy2, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
          }
          if (typeof target !== "object" && !isFunction(target)) {
            target = {};
          }
          if (i === length) {
            target = this;
            i--;
          }
          for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
              for (name in options) {
                copy2 = options[name];
                if (name === "__proto__" || target === copy2) {
                  continue;
                }
                if (deep && copy2 && (jQuery.isPlainObject(copy2) || (copyIsArray = Array.isArray(copy2)))) {
                  src = target[name];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name] = jQuery.extend(deep, clone, copy2);
                } else if (copy2 !== void 0) {
                  target[name] = copy2;
                }
              }
            }
          }
          return target;
        };
        jQuery.extend({
          expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
              return false;
            }
            return true;
          },
          globalEval: function(code, options, doc2) {
            DOMEval(code, { nonce: options && options.nonce }, doc2);
          },
          each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          makeArray: function(arr2, results) {
            var ret = results || [];
            if (arr2 != null) {
              if (isArrayLike(Object(arr2))) {
                jQuery.merge(ret, typeof arr2 === "string" ? [arr2] : arr2);
              } else {
                push.call(ret, arr2);
              }
            }
            return ret;
          },
          inArray: function(elem, arr2, i) {
            return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
          },
          merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
              first[i++] = second[j];
            }
            first.length = i;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
              callbackInverse = !callback(elems[i], i);
              if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
              }
            }
            return matches;
          },
          map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          guid: 1,
          support
        });
        if (typeof Symbol === "function") {
          jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
        }
        jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        });
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type = toType(obj);
          if (isFunction(obj) || isWindow(obj)) {
            return false;
          }
          return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        var Sizzle = function(window3) {
          var i, support2, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document3, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + 1 * new Date(), preferredDoc = window3.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
            }
            return 0;
          }, hasOwn2 = {}.hasOwnProperty, arr2 = [], pop = arr2.pop, pushNative = arr2.push, push2 = arr2.push, slice2 = arr2.slice, indexOf2 = function(list, elem) {
            var i2 = 0, len = list.length;
            for (; i2 < len; i2++) {
              if (list[i2] === elem) {
                return i2;
              }
            }
            return -1;
          }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rtrim2 = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            "ID": new RegExp("^#(" + identifier + ")"),
            "CLASS": new RegExp("^\\.(" + identifier + ")"),
            "TAG": new RegExp("^(" + identifier + "|[*])"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "bool": new RegExp("^(?:" + booleans + ")$", "i"),
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
          }, rhtml2 = /HTML$/i, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
            var high = "0x" + escape.slice(1) - 65536;
            return nonHex ? nonHex : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
          }, rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, fcssescape = function(ch, asCodePoint) {
            if (asCodePoint) {
              if (ch === "\0") {
                return "\uFFFD";
              }
              return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
            }
            return "\\" + ch;
          }, unloadHandler = function() {
            setDocument();
          }, inDisabledFieldset = addCombinator(function(elem) {
            return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
          }, { dir: "parentNode", next: "legend" });
          try {
            push2.apply(arr2 = slice2.call(preferredDoc.childNodes), preferredDoc.childNodes);
            arr2[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push2 = {
              apply: arr2.length ? function(target, els) {
                pushNative.apply(target, slice2.call(els));
              } : function(target, els) {
                var j = target.length, i2 = 0;
                while (target[j++] = els[i2++]) {
                }
                target.length = j - 1;
              }
            };
          }
          function Sizzle2(selector, context, results, seed) {
            var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
            results = results || [];
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
              return results;
            }
            if (!seed) {
              setDocument(context);
              context = context || document3;
              if (documentIsHTML) {
                if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                  if (m = match[1]) {
                    if (nodeType === 9) {
                      if (elem = context.getElementById(m)) {
                        if (elem.id === m) {
                          results.push(elem);
                          return results;
                        }
                      } else {
                        return results;
                      }
                    } else {
                      if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {
                        results.push(elem);
                        return results;
                      }
                    }
                  } else if (match[2]) {
                    push2.apply(results, context.getElementsByTagName(selector));
                    return results;
                  } else if ((m = match[3]) && support2.getElementsByClassName && context.getElementsByClassName) {
                    push2.apply(results, context.getElementsByClassName(m));
                    return results;
                  }
                }
                if (support2.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (nodeType !== 1 || context.nodeName.toLowerCase() !== "object")) {
                  newSelector = selector;
                  newContext = context;
                  if (nodeType === 1 && (rdescend.test(selector) || rcombinators.test(selector))) {
                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                    if (newContext !== context || !support2.scope) {
                      if (nid = context.getAttribute("id")) {
                        nid = nid.replace(rcssescape, fcssescape);
                      } else {
                        context.setAttribute("id", nid = expando);
                      }
                    }
                    groups = tokenize(selector);
                    i2 = groups.length;
                    while (i2--) {
                      groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                    }
                    newSelector = groups.join(",");
                  }
                  try {
                    push2.apply(results, newContext.querySelectorAll(newSelector));
                    return results;
                  } catch (qsaError) {
                    nonnativeSelectorCache(selector, true);
                  } finally {
                    if (nid === expando) {
                      context.removeAttribute("id");
                    }
                  }
                }
              }
            }
            return select(selector.replace(rtrim2, "$1"), context, results, seed);
          }
          function createCache() {
            var keys = [];
            function cache(key, value) {
              if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
              }
              return cache[key + " "] = value;
            }
            return cache;
          }
          function markFunction(fn) {
            fn[expando] = true;
            return fn;
          }
          function assert(fn) {
            var el = document3.createElement("fieldset");
            try {
              return !!fn(el);
            } catch (e) {
              return false;
            } finally {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el = null;
            }
          }
          function addHandle(attrs, handler) {
            var arr3 = attrs.split("|"), i2 = arr3.length;
            while (i2--) {
              Expr.attrHandle[arr3[i2]] = handler;
            }
          }
          function siblingCheck(a, b) {
            var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;
            if (diff) {
              return diff;
            }
            if (cur) {
              while (cur = cur.nextSibling) {
                if (cur === b) {
                  return -1;
                }
              }
            }
            return a ? 1 : -1;
          }
          function createInputPseudo(type) {
            return function(elem) {
              var name = elem.nodeName.toLowerCase();
              return name === "input" && elem.type === type;
            };
          }
          function createButtonPseudo(type) {
            return function(elem) {
              var name = elem.nodeName.toLowerCase();
              return (name === "input" || name === "button") && elem.type === type;
            };
          }
          function createDisabledPseudo(disabled) {
            return function(elem) {
              if ("form" in elem) {
                if (elem.parentNode && elem.disabled === false) {
                  if ("label" in elem) {
                    if ("label" in elem.parentNode) {
                      return elem.parentNode.disabled === disabled;
                    } else {
                      return elem.disabled === disabled;
                    }
                  }
                  return elem.isDisabled === disabled || elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
              } else if ("label" in elem) {
                return elem.disabled === disabled;
              }
              return false;
            };
          }
          function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
              argument = +argument;
              return markFunction(function(seed, matches2) {
                var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
                while (i2--) {
                  if (seed[j = matchIndexes[i2]]) {
                    seed[j] = !(matches2[j] = seed[j]);
                  }
                }
              });
            });
          }
          function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
          }
          support2 = Sizzle2.support = {};
          isXML = Sizzle2.isXML = function(elem) {
            var namespace = elem && elem.namespaceURI, docElem2 = elem && (elem.ownerDocument || elem).documentElement;
            return !rhtml2.test(namespace || docElem2 && docElem2.nodeName || "HTML");
          };
          setDocument = Sizzle2.setDocument = function(node) {
            var hasCompare, subWindow, doc2 = node ? node.ownerDocument || node : preferredDoc;
            if (doc2 == document3 || doc2.nodeType !== 9 || !doc2.documentElement) {
              return document3;
            }
            document3 = doc2;
            docElem = document3.documentElement;
            documentIsHTML = !isXML(document3);
            if (preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
              if (subWindow.addEventListener) {
                subWindow.addEventListener("unload", unloadHandler, false);
              } else if (subWindow.attachEvent) {
                subWindow.attachEvent("onunload", unloadHandler);
              }
            }
            support2.scope = assert(function(el) {
              docElem.appendChild(el).appendChild(document3.createElement("div"));
              return typeof el.querySelectorAll !== "undefined" && !el.querySelectorAll(":scope fieldset div").length;
            });
            support2.attributes = assert(function(el) {
              el.className = "i";
              return !el.getAttribute("className");
            });
            support2.getElementsByTagName = assert(function(el) {
              el.appendChild(document3.createComment(""));
              return !el.getElementsByTagName("*").length;
            });
            support2.getElementsByClassName = rnative.test(document3.getElementsByClassName);
            support2.getById = assert(function(el) {
              docElem.appendChild(el).id = expando;
              return !document3.getElementsByName || !document3.getElementsByName(expando).length;
            });
            if (support2.getById) {
              Expr.filter["ID"] = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
              Expr.find["ID"] = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var elem = context.getElementById(id);
                  return elem ? [elem] : [];
                }
              };
            } else {
              Expr.filter["ID"] = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node2 && node2.value === attrId;
                };
              };
              Expr.find["ID"] = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var node2, i2, elems, elem = context.getElementById(id);
                  if (elem) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                    elems = context.getElementsByName(id);
                    i2 = 0;
                    while (elem = elems[i2++]) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id) {
                        return [elem];
                      }
                    }
                  }
                  return [];
                }
              };
            }
            Expr.find["TAG"] = support2.getElementsByTagName ? function(tag, context) {
              if (typeof context.getElementsByTagName !== "undefined") {
                return context.getElementsByTagName(tag);
              } else if (support2.qsa) {
                return context.querySelectorAll(tag);
              }
            } : function(tag, context) {
              var elem, tmp = [], i2 = 0, results = context.getElementsByTagName(tag);
              if (tag === "*") {
                while (elem = results[i2++]) {
                  if (elem.nodeType === 1) {
                    tmp.push(elem);
                  }
                }
                return tmp;
              }
              return results;
            };
            Expr.find["CLASS"] = support2.getElementsByClassName && function(className, context) {
              if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                return context.getElementsByClassName(className);
              }
            };
            rbuggyMatches = [];
            rbuggyQSA = [];
            if (support2.qsa = rnative.test(document3.querySelectorAll)) {
              assert(function(el) {
                var input;
                docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a><select id='" + expando + "-\r\\' msallowcapture=''><option selected=''></option></select>";
                if (el.querySelectorAll("[msallowcapture^='']").length) {
                  rbuggyQSA.push("[*^$]=" + whitespace + `*(?:''|"")`);
                }
                if (!el.querySelectorAll("[selected]").length) {
                  rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                }
                if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                  rbuggyQSA.push("~=");
                }
                input = document3.createElement("input");
                input.setAttribute("name", "");
                el.appendChild(input);
                if (!el.querySelectorAll("[name='']").length) {
                  rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
                }
                if (!el.querySelectorAll(":checked").length) {
                  rbuggyQSA.push(":checked");
                }
                if (!el.querySelectorAll("a#" + expando + "+*").length) {
                  rbuggyQSA.push(".#.+[+~]");
                }
                el.querySelectorAll("\\\f");
                rbuggyQSA.push("[\\r\\n\\f]");
              });
              assert(function(el) {
                el.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var input = document3.createElement("input");
                input.setAttribute("type", "hidden");
                el.appendChild(input).setAttribute("name", "D");
                if (el.querySelectorAll("[name=d]").length) {
                  rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                }
                if (el.querySelectorAll(":enabled").length !== 2) {
                  rbuggyQSA.push(":enabled", ":disabled");
                }
                docElem.appendChild(el).disabled = true;
                if (el.querySelectorAll(":disabled").length !== 2) {
                  rbuggyQSA.push(":enabled", ":disabled");
                }
                el.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
              });
            }
            if (support2.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
              assert(function(el) {
                support2.disconnectedMatch = matches.call(el, "*");
                matches.call(el, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
              });
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
            hasCompare = rnative.test(docElem.compareDocumentPosition);
            contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
              var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
              return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function(a, b) {
              if (b) {
                while (b = b.parentNode) {
                  if (b === a) {
                    return true;
                  }
                }
              }
              return false;
            };
            sortOrder = hasCompare ? function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
              if (compare) {
                return compare;
              }
              compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
              if (compare & 1 || !support2.sortDetached && b.compareDocumentPosition(a) === compare) {
                if (a == document3 || a.ownerDocument == preferredDoc && contains(preferredDoc, a)) {
                  return -1;
                }
                if (b == document3 || b.ownerDocument == preferredDoc && contains(preferredDoc, b)) {
                  return 1;
                }
                return sortInput ? indexOf2(sortInput, a) - indexOf2(sortInput, b) : 0;
              }
              return compare & 4 ? -1 : 1;
            } : function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var cur, i2 = 0, aup = a.parentNode, bup = b.parentNode, ap = [a], bp = [b];
              if (!aup || !bup) {
                return a == document3 ? -1 : b == document3 ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf2(sortInput, a) - indexOf2(sortInput, b) : 0;
              } else if (aup === bup) {
                return siblingCheck(a, b);
              }
              cur = a;
              while (cur = cur.parentNode) {
                ap.unshift(cur);
              }
              cur = b;
              while (cur = cur.parentNode) {
                bp.unshift(cur);
              }
              while (ap[i2] === bp[i2]) {
                i2++;
              }
              return i2 ? siblingCheck(ap[i2], bp[i2]) : ap[i2] == preferredDoc ? -1 : bp[i2] == preferredDoc ? 1 : 0;
            };
            return document3;
          };
          Sizzle2.matches = function(expr, elements) {
            return Sizzle2(expr, null, null, elements);
          };
          Sizzle2.matchesSelector = function(elem, expr) {
            setDocument(elem);
            if (support2.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
              try {
                var ret = matches.call(elem, expr);
                if (ret || support2.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
                nonnativeSelectorCache(expr, true);
              }
            }
            return Sizzle2(expr, document3, null, [elem]).length > 0;
          };
          Sizzle2.contains = function(context, elem) {
            if ((context.ownerDocument || context) != document3) {
              setDocument(context);
            }
            return contains(context, elem);
          };
          Sizzle2.attr = function(elem, name) {
            if ((elem.ownerDocument || elem) != document3) {
              setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn2.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
            return val !== void 0 ? val : support2.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
          };
          Sizzle2.escape = function(sel) {
            return (sel + "").replace(rcssescape, fcssescape);
          };
          Sizzle2.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };
          Sizzle2.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i2 = 0;
            hasDuplicate = !support2.detectDuplicates;
            sortInput = !support2.sortStable && results.slice(0);
            results.sort(sortOrder);
            if (hasDuplicate) {
              while (elem = results[i2++]) {
                if (elem === results[i2]) {
                  j = duplicates.push(i2);
                }
              }
              while (j--) {
                results.splice(duplicates[j], 1);
              }
            }
            sortInput = null;
            return results;
          };
          getText = Sizzle2.getText = function(elem) {
            var node, ret = "", i2 = 0, nodeType = elem.nodeType;
            if (!nodeType) {
              while (node = elem[i2++]) {
                ret += getText(node);
              }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
              if (typeof elem.textContent === "string") {
                return elem.textContent;
              } else {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  ret += getText(elem);
                }
              }
            } else if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            return ret;
          };
          Expr = Sizzle2.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: true },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: true },
              "~": { dir: "previousSibling" }
            },
            preFilter: {
              "ATTR": function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
              },
              "CHILD": function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                  if (!match[3]) {
                    Sizzle2.error(match[0]);
                  }
                  match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                  match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                  Sizzle2.error(match[0]);
                }
                return match;
              },
              "PSEUDO": function(match) {
                var excess, unquoted = !match[6] && match[2];
                if (matchExpr["CHILD"].test(match[0])) {
                  return null;
                }
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";
                } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
              }
            },
            filter: {
              "TAG": function(nodeNameSelector) {
                var nodeName2 = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ? function() {
                  return true;
                } : function(elem) {
                  return elem.nodeName && elem.nodeName.toLowerCase() === nodeName2;
                };
              },
              "CLASS": function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                  return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                });
              },
              "ATTR": function(name, operator, check) {
                return function(elem) {
                  var result = Sizzle2.attr(elem, name);
                  if (result == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }
                  result += "";
                  return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                };
              },
              "CHILD": function(type, what, _argument, first, last) {
                var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? function(elem) {
                  return !!elem.parentNode;
                } : function(elem, _context, xml) {
                  var cache, uniqueCache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                  if (parent) {
                    if (simple) {
                      while (dir2) {
                        node = elem;
                        while (node = node[dir2]) {
                          if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                            return false;
                          }
                        }
                        start = dir2 = type === "only" && !start && "nextSibling";
                      }
                      return true;
                    }
                    start = [forward ? parent.firstChild : parent.lastChild];
                    if (forward && useCache) {
                      node = parent;
                      outerCache = node[expando] || (node[expando] = {});
                      uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                      cache = uniqueCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex && cache[2];
                      node = nodeIndex && parent.childNodes[nodeIndex];
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if (node.nodeType === 1 && ++diff && node === elem) {
                          uniqueCache[type] = [dirruns, nodeIndex, diff];
                          break;
                        }
                      }
                    } else {
                      if (useCache) {
                        node = elem;
                        outerCache = node[expando] || (node[expando] = {});
                        uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                        cache = uniqueCache[type] || [];
                        nodeIndex = cache[0] === dirruns && cache[1];
                        diff = nodeIndex;
                      }
                      if (diff === false) {
                        while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                          if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                            if (useCache) {
                              outerCache = node[expando] || (node[expando] = {});
                              uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});
                              uniqueCache[type] = [dirruns, diff];
                            }
                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }
                    }
                    diff -= last;
                    return diff === first || diff % first === 0 && diff / first >= 0;
                  }
                };
              },
              "PSEUDO": function(pseudo, argument) {
                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle2.error("unsupported pseudo: " + pseudo);
                if (fn[expando]) {
                  return fn(argument);
                }
                if (fn.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                    var idx, matched = fn(seed, argument), i2 = matched.length;
                    while (i2--) {
                      idx = indexOf2(seed, matched[i2]);
                      seed[idx] = !(matches2[idx] = matched[i2]);
                    }
                  }) : function(elem) {
                    return fn(elem, 0, args);
                  };
                }
                return fn;
              }
            },
            pseudos: {
              "not": markFunction(function(selector) {
                var input = [], results = [], matcher = compile(selector.replace(rtrim2, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                  var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                  while (i2--) {
                    if (elem = unmatched[i2]) {
                      seed[i2] = !(matches2[i2] = elem);
                    }
                  }
                }) : function(elem, _context, xml) {
                  input[0] = elem;
                  matcher(input, null, xml, results);
                  input[0] = null;
                  return !results.pop();
                };
              }),
              "has": markFunction(function(selector) {
                return function(elem) {
                  return Sizzle2(selector, elem).length > 0;
                };
              }),
              "contains": markFunction(function(text) {
                text = text.replace(runescape, funescape);
                return function(elem) {
                  return (elem.textContent || getText(elem)).indexOf(text) > -1;
                };
              }),
              "lang": markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                  Sizzle2.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                  var elemLang;
                  do {
                    if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),
              "target": function(elem) {
                var hash = window3.location && window3.location.hash;
                return hash && hash.slice(1) === elem.id;
              },
              "root": function(elem) {
                return elem === docElem;
              },
              "focus": function(elem) {
                return elem === document3.activeElement && (!document3.hasFocus || document3.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
              },
              "enabled": createDisabledPseudo(false),
              "disabled": createDisabledPseudo(true),
              "checked": function(elem) {
                var nodeName2 = elem.nodeName.toLowerCase();
                return nodeName2 === "input" && !!elem.checked || nodeName2 === "option" && !!elem.selected;
              },
              "selected": function(elem) {
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
              },
              "empty": function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },
              "parent": function(elem) {
                return !Expr.pseudos["empty"](elem);
              },
              "header": function(elem) {
                return rheader.test(elem.nodeName);
              },
              "input": function(elem) {
                return rinputs.test(elem.nodeName);
              },
              "button": function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
              },
              "text": function(elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
              },
              "first": createPositionalPseudo(function() {
                return [0];
              }),
              "last": createPositionalPseudo(function(_matchIndexes, length) {
                return [length - 1];
              }),
              "eq": createPositionalPseudo(function(_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),
              "even": createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 0;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              "odd": createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 1;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              "lt": createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2 = argument < 0 ? argument + length : argument > length ? length : argument;
                for (; --i2 >= 0; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              "gt": createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2 = argument < 0 ? argument + length : argument;
                for (; ++i2 < length; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              })
            }
          };
          Expr.pseudos["nth"] = Expr.pseudos["eq"];
          for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
          }
          for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
          }
          function setFilters() {
          }
          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();
          tokenize = Sizzle2.tokenize = function(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
              }
              matched = false;
              if (match = rcombinators.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type: match[0].replace(rtrim2, " ")
                });
                soFar = soFar.slice(matched.length);
              }
              for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }
              if (!matched) {
                break;
              }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle2.error(selector) : tokenCache(selector, groups).slice(0);
          };
          function toSelector(tokens) {
            var i2 = 0, len = tokens.length, selector = "";
            for (; i2 < len; i2++) {
              selector += tokens[i2].value;
            }
            return selector;
          }
          function addCombinator(matcher, combinator, base) {
            var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
            return combinator.first ? function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            } : function(elem, context, xml) {
              var oldCache, uniqueCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});
                    if (skip && skip === elem.nodeName.toLowerCase()) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      uniqueCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            };
          }
          function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
              var i2 = matchers.length;
              while (i2--) {
                if (!matchers[i2](elem, context, xml)) {
                  return false;
                }
              }
              return true;
            } : matchers[0];
          }
          function multipleContexts(selector, contexts, results) {
            var i2 = 0, len = contexts.length;
            for (; i2 < len; i2++) {
              Sizzle2(selector, contexts[i2], results);
            }
            return results;
          }
          function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
            for (; i2 < len; i2++) {
              if (elem = unmatched[i2]) {
                if (!filter || filter(elem, context, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map.push(i2);
                  }
                }
              }
            }
            return newUnmatched;
          }
          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
              var temp, i2, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
              if (matcher) {
                matcher(matcherIn, matcherOut, context, xml);
              }
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                i2 = temp.length;
                while (i2--) {
                  if (elem = temp[i2]) {
                    matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                  }
                }
              }
              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    temp = [];
                    i2 = matcherOut.length;
                    while (i2--) {
                      if (elem = matcherOut[i2]) {
                        temp.push(matcherIn[i2] = elem);
                      }
                    }
                    postFinder(null, matcherOut = [], temp, xml);
                  }
                  i2 = matcherOut.length;
                  while (i2--) {
                    if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf2(seed, elem) : preMap[i2]) > -1) {
                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }
              } else {
                matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push2.apply(results, matcherOut);
                }
              }
            });
          }
          function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
              return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
              return indexOf2(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [function(elem, context, xml) {
              var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
              checkContext = null;
              return ret;
            }];
            for (; i2 < len; i2++) {
              if (matcher = Expr.relative[tokens[i2].type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
                if (matcher[expando]) {
                  j = ++i2;
                  for (; j < len; j++) {
                    if (Expr.relative[tokens[j].type]) {
                      break;
                    }
                  }
                  return setMatcher(i2 > 1 && elementMatcher(matchers), i2 > 1 && toSelector(tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })).replace(rtrim2, "$1"), matcher, i2 < j && matcherFromTokens(tokens.slice(i2, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
              }
            }
            return elementMatcher(matchers);
          }
          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
              var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
              if (outermost) {
                outermostContext = context == document3 || context || outermost;
              }
              for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
                if (byElement && elem) {
                  j = 0;
                  if (!context && elem.ownerDocument != document3) {
                    setDocument(elem);
                    xml = !documentIsHTML;
                  }
                  while (matcher = elementMatchers[j++]) {
                    if (matcher(elem, context || document3, xml)) {
                      results.push(elem);
                      break;
                    }
                  }
                  if (outermost) {
                    dirruns = dirrunsUnique;
                  }
                }
                if (bySet) {
                  if (elem = !matcher && elem) {
                    matchedCount--;
                  }
                  if (seed) {
                    unmatched.push(elem);
                  }
                }
              }
              matchedCount += i2;
              if (bySet && i2 !== matchedCount) {
                j = 0;
                while (matcher = setMatchers[j++]) {
                  matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                  if (matchedCount > 0) {
                    while (i2--) {
                      if (!(unmatched[i2] || setMatched[i2])) {
                        setMatched[i2] = pop.call(results);
                      }
                    }
                  }
                  setMatched = condense(setMatched);
                }
                push2.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                  Sizzle2.uniqueSort(results);
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
              }
              return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
          }
          compile = Sizzle2.compile = function(selector, match) {
            var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
              if (!match) {
                match = tokenize(selector);
              }
              i2 = match.length;
              while (i2--) {
                cached = matcherFromTokens(match[i2]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }
              cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
              cached.selector = selector;
            }
            return cached;
          };
          select = Sizzle2.select = function(selector, context, results, seed) {
            var i2, tokens, token, type, find, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                if (!context) {
                  return results;
                } else if (compiled) {
                  context = context.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
              }
              i2 = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
              while (i2--) {
                token = tokens[i2];
                if (Expr.relative[type = token.type]) {
                  break;
                }
                if (find = Expr.find[type]) {
                  if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
                    tokens.splice(i2, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push2.apply(results, seed);
                      return results;
                    }
                    break;
                  }
                }
              }
            }
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
            return results;
          };
          support2.sortStable = expando.split("").sort(sortOrder).join("") === expando;
          support2.detectDuplicates = !!hasDuplicate;
          setDocument();
          support2.sortDetached = assert(function(el) {
            return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
          });
          if (!assert(function(el) {
            el.innerHTML = "<a href='#'></a>";
            return el.firstChild.getAttribute("href") === "#";
          })) {
            addHandle("type|href|height|width", function(elem, name, isXML2) {
              if (!isXML2) {
                return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
              }
            });
          }
          if (!support2.attributes || !assert(function(el) {
            el.innerHTML = "<input/>";
            el.firstChild.setAttribute("value", "");
            return el.firstChild.getAttribute("value") === "";
          })) {
            addHandle("value", function(elem, _name, isXML2) {
              if (!isXML2 && elem.nodeName.toLowerCase() === "input") {
                return elem.defaultValue;
              }
            });
          }
          if (!assert(function(el) {
            return el.getAttribute("disabled") == null;
          })) {
            addHandle(booleans, function(elem, name, isXML2) {
              var val;
              if (!isXML2) {
                return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
              }
            });
          }
          return Sizzle2;
        }(window2);
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;
        jQuery.escapeSelector = Sizzle.escape;
        var dir = function(elem, dir2, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir2]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery.expr.match.needsContext;
        function nodeName(elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
              return !!qualifier.call(elem, i, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery.grep(elements, function(elem) {
              return indexOf.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery.filter(qualifier, elements, not);
        }
        jQuery.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery.fn.extend({
          find: function(selector) {
            var i, ret, len = this.length, self2 = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) {
                  if (jQuery.contains(self2[i], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i = 0; i < len; i++) {
              jQuery.find(selector, self2[i], ret);
            }
            return len > 1 ? jQuery.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root = root || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
              if (match[1]) {
                context = context instanceof jQuery ? context[0] : context;
                jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document2, true));
                if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                  for (match in context) {
                    if (isFunction(this[match])) {
                      this[match](context[match]);
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document2.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context || context.jquery) {
              return (context || root).find(selector);
            } else {
              return this.constructor(context).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction(selector)) {
            return root.ready !== void 0 ? root.ready(selector) : selector(jQuery);
          }
          return jQuery.makeArray(selector, this);
        };
        init.prototype = jQuery.fn;
        rootjQuery = jQuery(document2);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery.fn.extend({
          has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
              var i = 0;
              for (; i < l; i++) {
                if (jQuery.contains(this, targets[i])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
          },
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf.call(jQuery(elem), this[0]);
            }
            return indexOf.call(this, elem.jquery ? elem[0] : elem);
          },
          add: function(selector, context) {
            return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
          },
          addBack: function(selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
          }
        });
        function sibling(cur, dir2) {
          while ((cur = cur[dir2]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && getProto(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery.merge([], elem.childNodes);
          }
        }, function(name, fn) {
          jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name]) {
                jQuery.uniqueSort(matched);
              }
              if (rparentsprev.test(name)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery.each(options.match(rnothtmlwhite) || [], function(_2, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
          var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
              memory = queue.shift();
              while (++firingIndex < list.length) {
                if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list = [];
              } else {
                list = "";
              }
            }
          }, self2 = {
            add: function() {
              if (list) {
                if (memory && !firing) {
                  firingIndex = list.length - 1;
                  queue.push(memory);
                }
                (function add(args) {
                  jQuery.each(args, function(_2, arg) {
                    if (isFunction(arg)) {
                      if (!options.unique || !self2.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            remove: function() {
              jQuery.each(arguments, function(_2, arg) {
                var index;
                while ((index = jQuery.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            has: function(fn) {
              return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
            },
            empty: function() {
              if (list) {
                list = [];
              }
              return this;
            },
            disable: function() {
              locked = queue = [];
              list = memory = "";
              return this;
            },
            disabled: function() {
              return !list;
            },
            lock: function() {
              locked = queue = [];
              if (!memory && !firing) {
                list = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            fireWith: function(context, args) {
              if (!locked) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                queue.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            fire: function() {
              self2.fireWith(this, arguments);
              return this;
            },
            fired: function() {
              return !!fired;
            }
          };
          return self2;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
          var method;
          try {
            if (value && isFunction(method = value.promise)) {
              method.call(value).done(resolve).fail(reject);
            } else if (value && isFunction(method = value.then)) {
              method.call(value, resolve, reject);
            } else {
              resolve.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery.extend({
          Deferred: function(func) {
            var tuples = [
              [
                "notify",
                "progress",
                jQuery.Callbacks("memory"),
                jQuery.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn) {
                return promise.then(null, fn);
              },
              pipe: function() {
                var fns = arguments;
                return jQuery.Deferred(function(newDefer) {
                  jQuery.each(tuples, function(_i, tuple) {
                    var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn && fn.apply(this, arguments);
                      if (returned && isFunction(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction(then)) {
                        if (special) {
                          then.call(returned, resolve(maxDepth, deferred2, Identity, special), resolve(maxDepth, deferred2, Thrower, special));
                        } else {
                          maxDepth++;
                          then.call(returned, resolve(maxDepth, deferred2, Identity, special), resolve(maxDepth, deferred2, Thrower, special), resolve(maxDepth, deferred2, Identity, deferred2.notifyWith));
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery.Deferred.exceptionHook) {
                          jQuery.Deferred.exceptionHook(e, process.stackTrace);
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process();
                    } else {
                      if (jQuery.Deferred.getStackHook) {
                        process.stackTrace = jQuery.Deferred.getStackHook();
                      }
                      window2.setTimeout(process);
                    }
                  };
                }
                return jQuery.Deferred(function(newDefer) {
                  tuples[0][3].add(resolve(0, newDefer, isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));
                  tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity));
                  tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
                }).promise();
              },
              promise: function(obj) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery.each(tuples, function(i, tuple) {
              var list = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list.add;
              if (stateString) {
                list.add(function() {
                  state = stateString;
                }, tuples[3 - i][2].disable, tuples[3 - i][3].disable, tuples[0][2].lock, tuples[0][3].lock);
              }
              list.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          when: function(singleValue) {
            var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
              return function(value) {
                resolveContexts[i2] = this;
                resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(singleValue, primary.done(updateFunc(i)).resolve, primary.reject, !remaining);
              if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
                return primary.then();
              }
            }
            while (i--) {
              adoptValue(resolveValues[i], updateFunc(i), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery.Deferred.exceptionHook = function(error, stack) {
          if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
            window2.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
          }
        };
        jQuery.readyException = function(error) {
          window2.setTimeout(function() {
            throw error;
          });
        };
        var readyList = jQuery.Deferred();
        jQuery.fn.ready = function(fn) {
          readyList.then(fn).catch(function(error) {
            jQuery.readyException(error);
          });
          return this;
        };
        jQuery.extend({
          isReady: false,
          readyWait: 1,
          ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
              return;
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document2, [jQuery]);
          }
        });
        jQuery.ready.then = readyList.then;
        function completed() {
          document2.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery.ready();
        }
        if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
          window2.setTimeout(jQuery.ready);
        } else {
          document2.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
          var i = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i in key) {
              access(elems, fn, i, key[i], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn.call(elems, value);
                fn = null;
              } else {
                bulk = fn;
                fn = function(elem, _key, value2) {
                  return bulk.call(jQuery(elem), value2);
                };
              }
            }
            if (fn) {
              for (; i < len; i++) {
                fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn.call(elems);
          }
          return len ? fn(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data2, value) {
            var prop, cache = this.cache(owner);
            if (typeof data2 === "string") {
              cache[camelCase(data2)] = value;
            } else {
              for (prop in data2) {
                cache[camelCase(prop)] = data2[prop];
              }
            }
            return cache;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : owner[this.expando] && owner[this.expando][camelCase(key)];
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i, cache = owner[this.expando];
            if (cache === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
              }
              i = key.length;
              while (i--) {
                delete cache[key[i]];
              }
            }
            if (key === void 0 || jQuery.isEmptyObject(cache)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache = owner[this.expando];
            return cache !== void 0 && !jQuery.isEmptyObject(cache);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data2) {
          if (data2 === "true") {
            return true;
          }
          if (data2 === "false") {
            return false;
          }
          if (data2 === "null") {
            return null;
          }
          if (data2 === +data2 + "") {
            return +data2;
          }
          if (rbrace.test(data2)) {
            return JSON.parse(data2);
          }
          return data2;
        }
        function dataAttr(elem, key, data2) {
          var name;
          if (data2 === void 0 && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data2 = elem.getAttribute(name);
            if (typeof data2 === "string") {
              try {
                data2 = getData(data2);
              } catch (e) {
              }
              dataUser.set(elem, key, data2);
            } else {
              data2 = void 0;
            }
          }
          return data2;
        }
        jQuery.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name, data2) {
            return dataUser.access(elem, name, data2);
          },
          removeData: function(elem, name) {
            dataUser.remove(elem, name);
          },
          _data: function(elem, name, data2) {
            return dataPriv.access(elem, name, data2);
          },
          _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
          }
        });
        jQuery.fn.extend({
          data: function(key, value) {
            var i, name, data2, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data2 = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i = attrs.length;
                  while (i--) {
                    if (attrs[i]) {
                      name = attrs[i].name;
                      if (name.indexOf("data-") === 0) {
                        name = camelCase(name.slice(5));
                        dataAttr(elem, name, data2[name]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data2;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data3;
              if (elem && value2 === void 0) {
                data3 = dataUser.get(elem, key);
                if (data3 !== void 0) {
                  return data3;
                }
                data3 = dataAttr(elem, key);
                if (data3 !== void 0) {
                  return data3;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery.extend({
          queue: function(elem, type, data2) {
            var queue;
            if (elem) {
              type = (type || "fx") + "queue";
              queue = dataPriv.get(elem, type);
              if (data2) {
                if (!queue || Array.isArray(data2)) {
                  queue = dataPriv.access(elem, type, jQuery.makeArray(data2));
                } else {
                  queue.push(data2);
                }
              }
              return queue || [];
            }
          },
          dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
              jQuery.dequeue(elem, type);
            };
            if (fn === "inprogress") {
              fn = queue.shift();
              startLength--;
            }
            if (fn) {
              if (type === "fx") {
                queue.unshift("inprogress");
              }
              delete hooks.stop;
              fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type + "queue", key]);
              })
            });
          }
        });
        jQuery.fn.extend({
          queue: function(type, data2) {
            var setter = 2;
            if (typeof type !== "string") {
              data2 = type;
              type = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery.queue(this[0], type);
            }
            return data2 === void 0 ? this : this.each(function() {
              var queue = jQuery.queue(this, type, data2);
              jQuery._queueHooks(this, type);
              if (type === "fx" && queue[0] !== "inprogress") {
                jQuery.dequeue(this, type);
              }
            });
          },
          dequeue: function(type) {
            return this.each(function() {
              jQuery.dequeue(this, type);
            });
          },
          clearQueue: function(type) {
            return this.queue(type || "fx", []);
          },
          promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
              if (!--count) {
                defer.resolveWith(elements, [elements]);
              }
            };
            if (typeof type !== "string") {
              obj = type;
              type = void 0;
            }
            type = type || "fx";
            while (i--) {
              tmp = dataPriv.get(elements[i], type + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
              }
            }
            resolve();
            return defer.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document2.documentElement;
        var isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && isAttached(elem) && jQuery.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery.css(elem, prop, "");
          }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit) {
            initial = initial / 2;
            unit = unit || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery.style(elem, prop, initialInUnit + unit);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc2 = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc2.body.appendChild(doc2.createElement(nodeName2));
          display = jQuery.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery(this).show();
              } else {
                jQuery(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context, tag) {
          var ret;
          if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag || "*");
          } else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag || "*");
          } else {
            ret = [];
          }
          if (tag === void 0 || tag && nodeName(context, tag)) {
            return jQuery.merge([context], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i = 0, l = elems.length;
          for (; i < l; i++) {
            dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts, selection, ignored) {
          var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
          for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }
                jQuery.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i = 0;
          while (elem = nodes[i++]) {
            if (selection && jQuery.inArray(elem, selection) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts) {
              j = 0;
              while (elem = tmp[j++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function expectSync(elem, type) {
          return elem === safeActiveElement() === (type === "focus");
        }
        function safeActiveElement() {
          try {
            return document2.activeElement;
          } catch (err) {
          }
        }
        function on2(elem, types, selector, data2, fn, one) {
          var origFn, type;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data2 = data2 || selector;
              selector = void 0;
            }
            for (type in types) {
              on2(elem, type, selector, data2, types[type], one);
            }
            return elem;
          }
          if (data2 == null && fn == null) {
            fn = selector;
            data2 = selector = void 0;
          } else if (fn == null) {
            if (typeof selector === "string") {
              fn = data2;
              data2 = void 0;
            } else {
              fn = data2;
              data2 = selector;
              selector = void 0;
            }
          }
          if (fn === false) {
            fn = returnFalse;
          } else if (!fn) {
            return elem;
          }
          if (one === 1) {
            origFn = fn;
            fn = function(event) {
              jQuery().off(event);
              return origFn.apply(this, arguments);
            };
            fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
          }
          return elem.each(function() {
            jQuery.event.add(this, types, fn, data2, selector);
          });
        }
        jQuery.event = {
          global: {},
          add: function(elem, types, handler, data2, selector) {
            var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
              events = elemData.events = Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              special = jQuery.event.special[type] || {};
              handleObj = jQuery.extend({
                type,
                origType,
                data: data2,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events[type])) {
                handlers = events[type] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data2, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery.event.global[type] = true;
            }
          },
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                for (type in events) {
                  jQuery.event.remove(elem, type + types[t], handler, selector, true);
                }
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              handlers = events[type] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j = handlers.length;
              while (j--) {
                handleObj = handlers[j];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events[type];
              }
            }
            if (jQuery.isEmptyObject(events)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            for (i = 1; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j = 0;
              while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name, hook) {
            Object.defineProperty(jQuery.Event.prototype, name, {
              enumerable: true,
              configurable: true,
              get: isFunction(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
          },
          special: {
            load: {
              noBubble: true
            },
            click: {
              setup: function(data2) {
                var el = this || data2;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", returnTrue);
                }
                return false;
              },
              trigger: function(data2) {
                var el = this || data2;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type, expectSync2) {
          if (!expectSync2) {
            if (dataPriv.get(el, type) === void 0) {
              jQuery.event.add(el, type, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type, false);
          jQuery.event.add(el, type, {
            namespace: false,
            handler: function(event) {
              var notAsync, result, saved = dataPriv.get(this, type);
              if (event.isTrigger & 1 && this[type]) {
                if (!saved.length) {
                  saved = slice.call(arguments);
                  dataPriv.set(this, type, saved);
                  notAsync = expectSync2(this, type);
                  this[type]();
                  result = dataPriv.get(this, type);
                  if (saved !== result || notAsync) {
                    dataPriv.set(this, type, false);
                  } else {
                    result = {};
                  }
                  if (saved !== result) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result && result.value;
                  }
                } else if ((jQuery.event.special[type] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved.length) {
                dataPriv.set(this, type, {
                  value: jQuery.event.trigger(jQuery.extend(saved[0], jQuery.Event.prototype), saved.slice(1), this)
                });
                event.stopImmediatePropagation();
              }
            }
          });
        }
        jQuery.removeEvent = function(elem, type, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
          }
        };
        jQuery.Event = function(src, props) {
          if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery.expando] = true;
        };
        jQuery.Event.prototype = {
          constructor: jQuery.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery.event.addProp);
        jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
          jQuery.event.special[type] = {
            setup: function() {
              leverageNative(this, type, expectSync);
              return false;
            },
            trigger: function() {
              leverageNative(this, type);
              return true;
            },
            _default: function() {
              return true;
            },
            delegateType
          };
        });
        jQuery.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery.fn.extend({
          on: function(types, selector, data2, fn) {
            return on2(this, types, selector, data2, fn);
          },
          one: function(types, selector, data2, fn) {
            return on2(this, types, selector, data2, fn, 1);
          },
          off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
              return this;
            }
            if (typeof types === "object") {
              for (type in types) {
                this.off(type, selector, types[type]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn = selector;
              selector = void 0;
            }
            if (fn === false) {
              fn = returnFalse;
            }
            return this.each(function() {
              jQuery.event.remove(this, types, fn, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        function manipulationTarget(elem, content) {
          if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
            return jQuery(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i, l, type, pdataOld, udataOld, udataCur, events;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events = pdataOld.events;
            if (events) {
              dataPriv.remove(dest, "handle events");
              for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                  jQuery.event.add(dest, type, events[type][i]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts, hasScripts, node, doc2, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self2 = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self2.html());
              }
              domManip(self2, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts = jQuery.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;
              for (; i < l; i++) {
                node = fragment;
                if (i !== iNoClone) {
                  node = jQuery.clone(node, true, true);
                  if (hasScripts) {
                    jQuery.merge(scripts, getAll(node, "script"));
                  }
                }
                callback.call(collection[i], node, i);
              }
              if (hasScripts) {
                doc2 = scripts[scripts.length - 1].ownerDocument;
                jQuery.map(scripts, restoreScript);
                for (i = 0; i < hasScripts; i++) {
                  node = scripts[i];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc2, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery._evalUrl && !node.noModule) {
                        jQuery._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc2);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc2);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove(elem, selector, keepData) {
          var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
          for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
              jQuery.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery.extend({
          htmlPrefilter: function(html) {
            return html;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data2, elem, type, special = jQuery.event.special, i = 0;
            for (; (elem = elems[i]) !== void 0; i++) {
              if (acceptData(elem)) {
                if (data2 = elem[dataPriv.expando]) {
                  if (data2.events) {
                    for (type in data2.events) {
                      if (special[type]) {
                        jQuery.event.remove(elem, type);
                      } else {
                        jQuery.removeEvent(elem, type, data2.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery.fn.extend({
          detach: function(selector) {
            return remove(this, selector, true);
          },
          remove: function(selector) {
            return remove(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery.htmlPrefilter(value2);
                try {
                  for (; i < l; i++) {
                    elem = this[i] || {};
                    if (elem.nodeType === 1) {
                      jQuery.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery.inArray(this, ignored) < 0) {
                jQuery.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name, original) {
          jQuery.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) {
              elems = i === last ? this : this.clone(true);
              jQuery(insert[i])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name, old = {};
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.call(elem);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document2.createElement("table");
                tr = document2.createElement("tr");
                trChild = document2.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name, computed) {
          var width, minWidth, maxWidth, ret, style = elem.style;
          computed = computed || getStyles(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery.style(elem, name);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
              width = style.width;
              minWidth = style.minWidth;
              maxWidth = style.maxWidth;
              style.minWidth = style.maxWidth = style.width = ret;
              ret = computed.width;
              style.width = width;
              style.minWidth = minWidth;
              style.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? ret + "" : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
        function vendorPropName(name) {
          var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
          while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
              return name;
            }
          }
        }
        function finalPropName(name) {
          var final = jQuery.cssProps[name] || vendorProps[name];
          if (final) {
            return final;
          }
          if (name in emptyStyle) {
            return name;
          }
          return vendorProps[name] = vendorPropName(name) || name;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, rcustomProp = /^--/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches = rcssNum.exec(value);
          return matches ? Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i < 4; i += 2) {
            if (box === "margin") {
              delta += jQuery.css(elem, box + cssExpand[i], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              if (box !== "padding") {
                delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              } else {
                extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5)) || 0;
          }
          return delta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || !support.reliableTrDimensions() && nodeName(elem, "tr") || val === "auto" || !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && elem.getClientRects().length) {
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(elem, dimension, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles, val) + "px";
        }
        jQuery.extend({
          cssHooks: {
            opacity: {
              get: function(elem, computed) {
                if (computed) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "gridArea": true,
            "gridColumn": true,
            "gridColumnEnd": true,
            "gridColumnStart": true,
            "gridRow": true,
            "gridRowEnd": true,
            "gridRowStart": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
          },
          cssProps: {},
          style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== void 0) {
              type = typeof value;
              if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                type = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style.setProperty(name, value);
                } else {
                  style[name] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style[name];
            }
          },
          css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
              val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery.each(["height", "width"], function(_i, dimension) {
          jQuery.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
              if (computed) {
                return rdisplayswap.test(jQuery.css(elem, "display")) && (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(elem, dimension, extra, isBorderBox, styles) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5);
              }
              if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        });
        jQuery.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i < 4; i++) {
                expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery.fn.extend({
          css: function(name, value) {
            return access(this, function(elem, name2, value2) {
              var styles, len, map = {}, i = 0;
              if (Array.isArray(name2)) {
                styles = getStyles(elem);
                len = name2.length;
                for (; i < len; i++) {
                  map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
                }
                return map;
              }
              return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
            }, name, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end, easing) {
          return new Tween.prototype.init(elem, options, prop, end, easing);
        }
        jQuery.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result = jQuery.css(tween.elem, tween.prop, "");
              return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
              if (jQuery.fx.step[tween.prop]) {
                jQuery.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery.easing = {
          linear: function(p) {
            return p;
          },
          swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery.fx = Tween.prototype.init;
        jQuery.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document2.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery.fx.interval);
            }
            jQuery.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type, includeWidth) {
          var which, i = 0, attrs = { height: type };
          includeWidth = includeWidth ? 1 : 0;
          for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts2) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts2.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
          }
          propTween = !jQuery.isEmptyObject(props);
          if (!propTween && jQuery.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts2.overflow = [style.overflow, style.overflowX, style.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style.display = "inline-block";
              }
            }
          }
          if (opts2.overflow) {
            style.overflow = "hidden";
            anim.always(function() {
              style.overflow = opts2.overflow[0];
              style.overflowX = opts2.overflow[1];
              style.overflowY = opts2.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name, easing, value, hooks;
          for (index in props) {
            name = camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name) {
              props[name] = value;
              delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
              specialEasing: {},
              easing: jQuery.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
              var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
              if (isFunction(result.stop)) {
                jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
              }
              return result;
            }
          }
          jQuery.map(props, createTween, animation);
          if (isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery.fx.timer(jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          }));
          return animation;
        }
        jQuery.Animation = jQuery.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery.speed = function(speed, easing, fn) {
          var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction(easing) && easing
          };
          if (jQuery.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery.fx.speeds) {
                opt.duration = jQuery.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery.extend({}, prop), optall);
              if (empty || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type;
              type = void 0;
            }
            if (clearQueue) {
              this.queue(type || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data2 = dataPriv.get(this);
              if (index) {
                if (data2[index] && data2[index].stop) {
                  stopQueue(data2[index]);
                }
              } else {
                for (index in data2) {
                  if (data2[index] && data2[index].stop && rrun.test(index)) {
                    stopQueue(data2[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery.dequeue(this, type);
              }
            });
          },
          finish: function(type) {
            if (type !== false) {
              type = type || "fx";
            }
            return this.each(function() {
              var index, data2 = dataPriv.get(this), queue = data2[type + "queue"], hooks = data2[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
              data2.finish = true;
              jQuery.queue(this, type, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue[index] && queue[index].finish) {
                  queue[index].finish.call(this);
                }
              }
              delete data2.finish;
            });
          }
        });
        jQuery.each(["toggle", "show", "hide"], function(_i, name) {
          var cssFn = jQuery.fn[name];
          jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
          };
        });
        jQuery.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name, props) {
          jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery.timers = [];
        jQuery.fx.tick = function() {
          var timer, i = 0, timers = jQuery.timers;
          fxNow = Date.now();
          for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
              timers.splice(i--, 1);
            }
          }
          if (!timers.length) {
            jQuery.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery.fx.timer = function(timer) {
          jQuery.timers.push(timer);
          jQuery.fx.start();
        };
        jQuery.fx.interval = 13;
        jQuery.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery.fx.stop = function() {
          inProgress = null;
        };
        jQuery.fx.speeds = {
          slow: 600,
          fast: 200,
          _default: 400
        };
        jQuery.fn.delay = function(time, type) {
          time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
          type = type || "fx";
          return this.queue(type, function(next, hooks) {
            var timeout = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout);
            };
          });
        };
        (function() {
          var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document2.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
          attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
          },
          removeAttr: function(name) {
            return this.each(function() {
              jQuery.removeAttr(this, name);
            });
          }
        });
        jQuery.extend({
          attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery.removeAttr(elem, name);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            ret = jQuery.find.attr(elem, name);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name = attrNames[i++]) {
                elem.removeAttribute(name);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name) {
            if (value === false) {
              jQuery.removeAttr(elem, name);
            } else {
              elem.setAttribute(name, name);
            }
            return name;
          }
        };
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
          var getter = attrHandle[name] || jQuery.find.attr;
          attrHandle[name] = function(elem, name2, isXML) {
            var ret, handle, lowercaseName = name2.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery.fn.extend({
          prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
          },
          removeProp: function(name) {
            return this.each(function() {
              delete this[jQuery.propFix[name] || name];
            });
          }
        });
        jQuery.extend({
          prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              name = jQuery.propFix[name] || name;
              hooks = jQuery.propHooks[name];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              return elem[name] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            return elem[name];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery.fn.extend({
          addClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) {
              return this.each(function(j2) {
                jQuery(this).addClass(value.call(this, j2, getClass(this)));
              });
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j = 0;
                  while (clazz = classes[j++]) {
                    if (cur.indexOf(" " + clazz + " ") < 0) {
                      cur += clazz + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          removeClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue, i = 0;
            if (isFunction(value)) {
              return this.each(function(j2) {
                jQuery(this).removeClass(value.call(this, j2, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classes = classesToArray(value);
            if (classes.length) {
              while (elem = this[i++]) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  j = 0;
                  while (clazz = classes[j++]) {
                    while (cur.indexOf(" " + clazz + " ") > -1) {
                      cur = cur.replace(" " + clazz + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    elem.setAttribute("class", finalValue);
                  }
                }
              }
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var type = typeof value, isValidValue = type === "string" || Array.isArray(value);
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (isFunction(value)) {
              return this.each(function(i) {
                jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
              });
            }
            return this.each(function() {
              var className, i, self2, classNames;
              if (isValidValue) {
                i = 0;
                self2 = jQuery(this);
                classNames = classesToArray(value);
                while (className = classNames[i++]) {
                  if (self2.hasClass(className)) {
                    self2.removeClass(className);
                  } else {
                    self2.addClass(className);
                  }
                }
              } else if (value === void 0 || type === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i = 0;
            className = " " + selector + " ";
            while (elem = this[i++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction(value);
            return this.each(function(i) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i, jQuery(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery.find.attr(elem, "value");
                return val != null ? val : stripAndCollapse(jQuery.text(elem));
              }
            },
            select: {
              get: function(elem) {
                var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max2 = one ? index + 1 : options.length;
                if (index < 0) {
                  i = max2;
                } else {
                  i = one ? index : 0;
                }
                for (; i < max2; i++) {
                  option = options[i];
                  if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery(option).val();
                    if (one) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                while (i--) {
                  option = options[i];
                  if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery.each(["radio", "checkbox"], function() {
          jQuery.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        support.focusin = "onfocusin" in window2;
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery.extend(jQuery.event, {
          trigger: function(event, data2, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document2;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
              return;
            }
            if (type.indexOf(".") > -1) {
              namespaces = type.split(".");
              type = namespaces.shift();
              namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data2 = data2 == null ? [event] : jQuery.makeArray(data2, [event]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data2) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type;
              if (!rfocusMorph.test(bubbleType + type)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document2)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i > 1 ? bubbleType : special.bindType || type;
              handle = (dataPriv.get(cur, "events") || Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data2);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data2);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data2) === false) && acceptData(elem)) {
                if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery.event.triggered = type;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type, stopPropagationCallback);
                  }
                  elem[type]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type, stopPropagationCallback);
                  }
                  jQuery.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          simulate: function(type, elem, event) {
            var e = jQuery.extend(new jQuery.Event(), event, {
              type,
              isSimulated: true
            });
            jQuery.event.trigger(e, null, elem);
          }
        });
        jQuery.fn.extend({
          trigger: function(type, data2) {
            return this.each(function() {
              jQuery.event.trigger(type, data2, this);
            });
          },
          triggerHandler: function(type, data2) {
            var elem = this[0];
            if (elem) {
              return jQuery.event.trigger(type, data2, elem, true);
            }
          }
        });
        if (!support.focusin) {
          jQuery.each({ focus: "focusin", blur: "focusout" }, function(orig, fix) {
            var handler = function(event) {
              jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
            };
            jQuery.event.special[fix] = {
              setup: function() {
                var doc2 = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc2, fix);
                if (!attaches) {
                  doc2.addEventListener(orig, handler, true);
                }
                dataPriv.access(doc2, fix, (attaches || 0) + 1);
              },
              teardown: function() {
                var doc2 = this.ownerDocument || this.document || this, attaches = dataPriv.access(doc2, fix) - 1;
                if (!attaches) {
                  doc2.removeEventListener(orig, handler, true);
                  dataPriv.remove(doc2, fix);
                } else {
                  dataPriv.access(doc2, fix, attaches);
                }
              }
            };
          });
        }
        var location = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery.parseXML = function(data2) {
          var xml, parserErrorElem;
          if (!data2 || typeof data2 !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data2, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data2));
          }
          return xml;
        };
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add) {
          var name;
          if (Array.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
              if (traditional || rbracket.test(prefix)) {
                add(prefix, v);
              } else {
                buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
              buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
          } else {
            add(prefix, obj);
          }
        }
        jQuery.param = function(a, traditional) {
          var prefix, s = [], add = function(key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function() {
              add(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add);
            }
          }
          return s.join("&");
        };
        jQuery.fn.extend({
          serialize: function() {
            return jQuery.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery.prop(this, "elements");
              return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
              var type = this.type;
              return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(_i, elem) {
              var val = jQuery(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
        originAnchor.href = location.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) {
              while (dataType = dataTypes[i++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_2, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type in contents) {
              if (contents[type] && contents[type].test(ct)) {
                dataTypes.unshift(type);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type in responses) {
              if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                finalDataType = type;
                break;
              }
              if (!firstDataType) {
                firstDataType = type;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery.extend({
          active: 0,
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            converters: {
              "* text": String,
              "text html": true,
              "text json": JSON.parse,
              "text xml": jQuery.parseXML
            },
            flatOptions: {
              url: true,
              context: true
            }
          },
          ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              setRequestHeader: function(name, value) {
                if (completed2 == null) {
                  name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },
              overrideMimeType: function(type) {
                if (completed2 == null) {
                  s.mimeType = type;
                }
                return this;
              },
              statusCode: function(map) {
                var code;
                if (map) {
                  if (completed2) {
                    jqXHR.always(map[jqXHR.status]);
                  } else {
                    for (code in map) {
                      statusCode[code] = [statusCode[code], map[code]];
                    }
                  }
                }
                return this;
              },
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document2.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery.event && s.global;
            if (fireGlobals && jQuery.active++ === 0) {
              jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
              }
              if (jQuery.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) {
              jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error = response.error;
                  isSuccess = !error;
                }
              } else {
                error = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery.active) {
                  jQuery.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data2, callback) {
            return jQuery.get(url, data2, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
          }
        });
        jQuery.each(["get", "post"], function(_i, method) {
          jQuery[method] = function(url, data2, callback, type) {
            if (isFunction(data2)) {
              type = type || callback;
              callback = data2;
              data2 = void 0;
            }
            return jQuery.ajax(jQuery.extend({
              url,
              type: method,
              dataType: type,
              data: data2,
              success: callback
            }, jQuery.isPlainObject(url) && url));
          };
        });
        jQuery.ajaxPrefilter(function(s) {
          var i;
          for (i in s.headers) {
            if (i.toLowerCase() === "content-type") {
              s.contentType = s.headers[i] || "";
            }
          }
        });
        jQuery._evalUrl = function(url, options, doc2) {
          return jQuery.ajax({
            url,
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery.globalEval(response, options, doc2);
            }
          });
        };
        jQuery.fn.extend({
          wrapAll: function(html) {
            var wrap;
            if (this[0]) {
              if (isFunction(html)) {
                html = html.call(this[0]);
              }
              wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html) {
            if (isFunction(html)) {
              return this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
              });
            }
            return this.each(function() {
              var self2 = jQuery(this), contents = self2.contents();
              if (contents.length) {
                contents.wrapAll(html);
              } else {
                self2.append(html);
              }
            });
          },
          wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i) {
              jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery.expr.pseudos.hidden = function(elem) {
          return !jQuery.expr.pseudos.visible(elem);
        };
        jQuery.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          0: 200,
          1223: 204
        }, xhrSupported = jQuery.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i, xhr = options.xhr();
                xhr.open(options.type, options.url, options.async, options.username, options.password);
                if (options.xhrFields) {
                  for (i in options.xhrFields) {
                    xhr[i] = options.xhrFields[i];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i in headers) {
                  xhr.setRequestHeader(i, headers[i]);
                }
                callback = function(type) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type === "abort") {
                        xhr.abort();
                      } else if (type === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(xhr.status, xhr.statusText);
                        }
                      } else {
                        complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery.globalEval(text);
              return text;
            }
          }
        });
        jQuery.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_2, complete) {
                script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document2.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = function() {
          var body = document2.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        }();
        jQuery.parseHTML = function(data2, context, keepScripts) {
          if (typeof data2 !== "string") {
            return [];
          }
          if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
          }
          var base, parsed, scripts;
          if (!context) {
            if (support.createHTMLDocument) {
              context = document2.implementation.createHTMLDocument("");
              base = context.createElement("base");
              base.href = document2.location.href;
              context.head.appendChild(base);
            } else {
              context = document2;
            }
          }
          parsed = rsingleTag.exec(data2);
          scripts = !keepScripts && [];
          if (parsed) {
            return [context.createElement(parsed[1])];
          }
          parsed = buildFragment([data2], context, scripts);
          if (scripts && scripts.length) {
            jQuery(scripts).remove();
          }
          return jQuery.merge([], parsed.childNodes);
        };
        jQuery.fn.load = function(url, params, callback) {
          var selector, type, response, self2 = this, off2 = url.indexOf(" ");
          if (off2 > -1) {
            selector = stripAndCollapse(url.slice(off2));
            url = url.slice(0, off2);
          }
          if (isFunction(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type = "POST";
          }
          if (self2.length > 0) {
            jQuery.ajax({
              url,
              type: type || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self2.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
            }).always(callback && function(jqXHR, status) {
              self2.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery.expr.pseudos.animated = function(elem) {
          return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
          }).length;
        };
        jQuery.offset = {
          setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction(options)) {
              options = options.call(elem, i, jQuery.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery.fn.extend({
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
              });
            }
            var rect2, win2, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect2 = elem.getBoundingClientRect();
            win2 = elem.ownerDocument.defaultView;
            return {
              top: rect2.top + win2.pageYOffset,
              left: rect2.left + win2.pageXOffset
            };
          },
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset, doc2, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery.css(elem, "position") === "fixed") {
              offset = elem.getBoundingClientRect();
            } else {
              offset = this.offset();
              doc2 = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc2.documentElement;
              while (offsetParent && (offsetParent === doc2.body || offsetParent === doc2.documentElement) && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery(offsetParent).offset();
                parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
              left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
          },
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top = prop === "pageYOffset";
          jQuery.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win2;
              if (isWindow(elem)) {
                win2 = elem;
              } else if (elem.nodeType === 9) {
                win2 = elem.defaultView;
              }
              if (val2 === void 0) {
                return win2 ? win2[prop] : elem[method2];
              }
              if (win2) {
                win2.scrollTo(!top ? val2 : win2.pageXOffset, top ? val2 : win2.pageYOffset);
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery.each(["top", "left"], function(_i, prop) {
          jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          });
        });
        jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
          jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
          }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type2, value2) {
                var doc2;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
                }
                if (elem.nodeType === 9) {
                  doc2 = elem.documentElement;
                  return Math.max(elem.body["scroll" + name], doc2["scroll" + name], elem.body["offset" + name], doc2["offset" + name], doc2["client" + name]);
                }
                return value2 === void 0 ? jQuery.css(elem, type2, extra) : jQuery.style(elem, type2, value2, extra);
              }, type, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type) {
          jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
          };
        });
        jQuery.fn.extend({
          bind: function(types, data2, fn) {
            return this.on(types, null, data2, fn);
          },
          unbind: function(types, fn) {
            return this.off(types, null, fn);
          },
          delegate: function(selector, types, data2, fn) {
            return this.on(types, selector, data2, fn);
          },
          undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
          },
          hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
          }
        });
        jQuery.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(_i, name) {
          jQuery.fn[name] = function(data2, fn) {
            return arguments.length > 0 ? this.on(name, null, data2, fn) : this.trigger(name);
          };
        });
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        jQuery.proxy = function(fn, context) {
          var tmp, args, proxy;
          if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
          }
          if (!isFunction(fn)) {
            return void 0;
          }
          args = slice.call(arguments, 2);
          proxy = function() {
            return fn.apply(context || this, args.concat(slice.call(arguments)));
          };
          proxy.guid = fn.guid = fn.guid || jQuery.guid++;
          return proxy;
        };
        jQuery.holdReady = function(hold) {
          if (hold) {
            jQuery.readyWait++;
          } else {
            jQuery.ready(true);
          }
        };
        jQuery.isArray = Array.isArray;
        jQuery.parseJSON = JSON.parse;
        jQuery.nodeName = nodeName;
        jQuery.isFunction = isFunction;
        jQuery.isWindow = isWindow;
        jQuery.camelCase = camelCase;
        jQuery.type = toType;
        jQuery.now = Date.now;
        jQuery.isNumeric = function(obj) {
          var type = jQuery.type(obj);
          return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
        };
        jQuery.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim, "");
        };
        if (typeof define === "function" && define.amd) {
          define("jquery", [], function() {
            return jQuery;
          });
        }
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery.noConflict = function(deep) {
          if (window2.$ === jQuery) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery) {
            window2.jQuery = _jQuery;
          }
          return jQuery;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery;
        }
        return jQuery;
      });
    }
  });

  // node_modules/semantic-ui-tab/index.js
  var require_semantic_ui_tab = __commonJS({
    "node_modules/semantic-ui-tab/index.js"(exports, module) {
      (function($2, window2, document2, undefined2) {
        "use strict";
        window2 = typeof window2 != "undefined" && window2.Math == Math ? window2 : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
        var _module = module;
        module.exports = function(parameters) {
          var $allModules = $2.isFunction(this) ? $2(window2) : $2(this), moduleSelector = $allModules.selector || "", time = new Date().getTime(), performance = [], query2 = arguments[0], methodInvoked = typeof query2 == "string", queryArguments = [].slice.call(arguments, 1), initializedHistory = false, returnedValue;
          $allModules.each(function() {
            var settings = $2.isPlainObject(parameters) ? $2.extend(true, {}, _module.exports.settings, parameters) : $2.extend({}, _module.exports.settings), className = settings.className, metadata = settings.metadata, selector = settings.selector, error = settings.error, eventNamespace = "." + settings.namespace, moduleNamespace = "module-" + settings.namespace, $module = $2(this), $context, $tabs, cache = {}, firstLoad = true, recursionDepth = 0, element = this, instance = $module.data(moduleNamespace), activeTabPath, parameterArray, module2, historyEvent;
            module2 = {
              initialize: function() {
                module2.debug("Initializing tab menu item", $module);
                module2.fix.callbacks();
                module2.determineTabs();
                module2.debug("Determining tabs", settings.context, $tabs);
                if (settings.auto) {
                  module2.set.auto();
                }
                module2.bind.events();
                if (settings.history && !initializedHistory) {
                  module2.initializeHistory();
                  initializedHistory = true;
                }
                module2.instantiate();
              },
              instantiate: function() {
                module2.verbose("Storing instance of module", module2);
                instance = module2;
                $module.data(moduleNamespace, module2);
              },
              destroy: function() {
                module2.debug("Destroying tabs", $module);
                $module.removeData(moduleNamespace).off(eventNamespace);
              },
              bind: {
                events: function() {
                  if (!$2.isWindow(element)) {
                    module2.debug("Attaching tab activation events to element", $module);
                    $module.on("click" + eventNamespace, module2.event.click);
                  }
                }
              },
              determineTabs: function() {
                var $reference;
                if (settings.context === "parent") {
                  if ($module.closest(selector.ui).length > 0) {
                    $reference = $module.closest(selector.ui);
                    module2.verbose("Using closest UI element as parent", $reference);
                  } else {
                    $reference = $module;
                  }
                  $context = $reference.parent();
                  module2.verbose("Determined parent element for creating context", $context);
                } else if (settings.context) {
                  $context = $2(settings.context);
                  module2.verbose("Using selector for tab context", settings.context, $context);
                } else {
                  $context = $2("body");
                }
                if (settings.childrenOnly) {
                  $tabs = $context.children(selector.tabs);
                  module2.debug("Searching tab context children for tabs", $context, $tabs);
                } else {
                  $tabs = $context.find(selector.tabs);
                  module2.debug("Searching tab context for tabs", $context, $tabs);
                }
              },
              fix: {
                callbacks: function() {
                  if ($2.isPlainObject(parameters) && (parameters.onTabLoad || parameters.onTabInit)) {
                    if (parameters.onTabLoad) {
                      parameters.onLoad = parameters.onTabLoad;
                      delete parameters.onTabLoad;
                      module2.error(error.legacyLoad, parameters.onLoad);
                    }
                    if (parameters.onTabInit) {
                      parameters.onFirstLoad = parameters.onTabInit;
                      delete parameters.onTabInit;
                      module2.error(error.legacyInit, parameters.onFirstLoad);
                    }
                    settings = $2.extend(true, {}, _module.exports.settings, parameters);
                  }
                }
              },
              initializeHistory: function() {
                module2.debug("Initializing page state");
                if ($2.address === undefined2) {
                  module2.error(error.state);
                  return false;
                } else {
                  if (settings.historyType == "state") {
                    module2.debug("Using HTML5 to manage state");
                    if (settings.path !== false) {
                      $2.address.history(true).state(settings.path);
                    } else {
                      module2.error(error.path);
                      return false;
                    }
                  }
                  $2.address.bind("change", module2.event.history.change);
                }
              },
              event: {
                click: function(event) {
                  var tabPath = $2(this).data(metadata.tab);
                  if (tabPath !== undefined2) {
                    if (settings.history) {
                      module2.verbose("Updating page state", event);
                      $2.address.value(tabPath);
                    } else {
                      module2.verbose("Changing tab", event);
                      module2.changeTab(tabPath);
                    }
                    event.preventDefault();
                  } else {
                    module2.debug("No tab specified");
                  }
                },
                history: {
                  change: function(event) {
                    var tabPath = event.pathNames.join("/") || module2.get.initialPath(), pageTitle = settings.templates.determineTitle(tabPath) || false;
                    module2.performance.display();
                    module2.debug("History change event", tabPath, event);
                    historyEvent = event;
                    if (tabPath !== undefined2) {
                      module2.changeTab(tabPath);
                    }
                    if (pageTitle) {
                      $2.address.title(pageTitle);
                    }
                  }
                }
              },
              refresh: function() {
                if (activeTabPath) {
                  module2.debug("Refreshing tab", activeTabPath);
                  module2.changeTab(activeTabPath);
                }
              },
              cache: {
                read: function(cacheKey) {
                  return cacheKey !== undefined2 ? cache[cacheKey] : false;
                },
                add: function(cacheKey, content) {
                  cacheKey = cacheKey || activeTabPath;
                  module2.debug("Adding cached content for", cacheKey);
                  cache[cacheKey] = content;
                },
                remove: function(cacheKey) {
                  cacheKey = cacheKey || activeTabPath;
                  module2.debug("Removing cached content for", cacheKey);
                  delete cache[cacheKey];
                }
              },
              set: {
                auto: function() {
                  var url = typeof settings.path == "string" ? settings.path.replace(/\/$/, "") + "/{$tab}" : "/{$tab}";
                  module2.verbose("Setting up automatic tab retrieval from server", url);
                  if ($2.isPlainObject(settings.apiSettings)) {
                    settings.apiSettings.url = url;
                  } else {
                    settings.apiSettings = {
                      url
                    };
                  }
                },
                loading: function(tabPath) {
                  var $tab = module2.get.tabElement(tabPath), isLoading = $tab.hasClass(className.loading);
                  if (!isLoading) {
                    module2.verbose("Setting loading state for", $tab);
                    $tab.addClass(className.loading).siblings($tabs).removeClass(className.active + " " + className.loading);
                    if ($tab.length > 0) {
                      settings.onRequest.call($tab[0], tabPath);
                    }
                  }
                },
                state: function(state) {
                  $2.address.value(state);
                }
              },
              changeTab: function(tabPath) {
                var pushStateAvailable = window2.history && window2.history.pushState, shouldIgnoreLoad = pushStateAvailable && settings.ignoreFirstLoad && firstLoad, remoteContent = settings.auto || $2.isPlainObject(settings.apiSettings), pathArray = remoteContent && !shouldIgnoreLoad ? module2.utilities.pathToArray(tabPath) : module2.get.defaultPathArray(tabPath);
                tabPath = module2.utilities.arrayToPath(pathArray);
                $2.each(pathArray, function(index, tab) {
                  var currentPathArray = pathArray.slice(0, index + 1), currentPath = module2.utilities.arrayToPath(currentPathArray), isTab = module2.is.tab(currentPath), isLastIndex = index + 1 == pathArray.length, $tab = module2.get.tabElement(currentPath), $anchor, nextPathArray, nextPath, isLastTab;
                  module2.verbose("Looking for tab", tab);
                  if (isTab) {
                    module2.verbose("Tab was found", tab);
                    activeTabPath = currentPath;
                    parameterArray = module2.utilities.filterArray(pathArray, currentPathArray);
                    if (isLastIndex) {
                      isLastTab = true;
                    } else {
                      nextPathArray = pathArray.slice(0, index + 2);
                      nextPath = module2.utilities.arrayToPath(nextPathArray);
                      isLastTab = !module2.is.tab(nextPath);
                      if (isLastTab) {
                        module2.verbose("Tab parameters found", nextPathArray);
                      }
                    }
                    if (isLastTab && remoteContent) {
                      if (!shouldIgnoreLoad) {
                        module2.activate.navigation(currentPath);
                        module2.fetch.content(currentPath, tabPath);
                      } else {
                        module2.debug("Ignoring remote content on first tab load", currentPath);
                        firstLoad = false;
                        module2.cache.add(tabPath, $tab.html());
                        module2.activate.all(currentPath);
                        settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                        settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                      }
                      return false;
                    } else {
                      module2.debug("Opened local tab", currentPath);
                      module2.activate.all(currentPath);
                      if (!module2.cache.read(currentPath)) {
                        module2.cache.add(currentPath, true);
                        module2.debug("First time tab loaded calling tab init");
                        settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                      }
                      settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                    }
                  } else if (tabPath.search("/") == -1 && tabPath !== "") {
                    $anchor = $2("#" + tabPath + ', a[name="' + tabPath + '"]');
                    currentPath = $anchor.closest("[data-tab]").data(metadata.tab);
                    $tab = module2.get.tabElement(currentPath);
                    if ($anchor && $anchor.length > 0 && currentPath) {
                      module2.debug("Anchor link used, opening parent tab", $tab, $anchor);
                      if (!$tab.hasClass(className.active)) {
                        setTimeout(function() {
                          module2.scrollTo($anchor);
                        }, 0);
                      }
                      module2.activate.all(currentPath);
                      if (!module2.cache.read(currentPath)) {
                        module2.cache.add(currentPath, true);
                        module2.debug("First time tab loaded calling tab init");
                        settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                      }
                      settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                      return false;
                    }
                  } else {
                    module2.error(error.missingTab, $module, $context, currentPath);
                    return false;
                  }
                });
              },
              scrollTo: function($element) {
                var scrollOffset = $element && $element.length > 0 ? $element.offset().top : false;
                if (scrollOffset !== false) {
                  module2.debug("Forcing scroll to an in-page link in a hidden tab", scrollOffset, $element);
                  $2(document2).scrollTop(scrollOffset);
                }
              },
              update: {
                content: function(tabPath, html, evaluateScripts) {
                  var $tab = module2.get.tabElement(tabPath), tab = $tab[0];
                  evaluateScripts = evaluateScripts !== undefined2 ? evaluateScripts : settings.evaluateScripts;
                  if (typeof settings.cacheType == "string" && settings.cacheType.toLowerCase() == "dom" && typeof html !== "string") {
                    $tab.empty().append($2(html).clone(true));
                  } else {
                    if (evaluateScripts) {
                      module2.debug("Updating HTML and evaluating inline scripts", tabPath, html);
                      $tab.html(html);
                    } else {
                      module2.debug("Updating HTML", tabPath, html);
                      tab.innerHTML = html;
                    }
                  }
                }
              },
              fetch: {
                content: function(tabPath, fullTabPath) {
                  var $tab = module2.get.tabElement(tabPath), apiSettings = {
                    dataType: "html",
                    encodeParameters: false,
                    on: "now",
                    cache: settings.alwaysRefresh,
                    headers: {
                      "X-Remote": true
                    },
                    onSuccess: function(response) {
                      if (settings.cacheType == "response") {
                        module2.cache.add(fullTabPath, response);
                      }
                      module2.update.content(tabPath, response);
                      if (tabPath == activeTabPath) {
                        module2.debug("Content loaded", tabPath);
                        module2.activate.tab(tabPath);
                      } else {
                        module2.debug("Content loaded in background", tabPath);
                      }
                      settings.onFirstLoad.call($tab[0], tabPath, parameterArray, historyEvent);
                      settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);
                      if (settings.loadOnce) {
                        module2.cache.add(fullTabPath, true);
                      } else if (typeof settings.cacheType == "string" && settings.cacheType.toLowerCase() == "dom" && $tab.children().length > 0) {
                        setTimeout(function() {
                          var $clone = $tab.children().clone(true);
                          $clone = $clone.not("script");
                          module2.cache.add(fullTabPath, $clone);
                        }, 0);
                      } else {
                        module2.cache.add(fullTabPath, $tab.html());
                      }
                    },
                    urlData: {
                      tab: fullTabPath
                    }
                  }, request = $tab.api("get request") || false, existingRequest = request && request.state() === "pending", requestSettings, cachedContent;
                  fullTabPath = fullTabPath || tabPath;
                  cachedContent = module2.cache.read(fullTabPath);
                  if (settings.cache && cachedContent) {
                    module2.activate.tab(tabPath);
                    module2.debug("Adding cached content", fullTabPath);
                    if (!settings.loadOnce) {
                      if (settings.evaluateScripts == "once") {
                        module2.update.content(tabPath, cachedContent, false);
                      } else {
                        module2.update.content(tabPath, cachedContent);
                      }
                    }
                    settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);
                  } else if (existingRequest) {
                    module2.set.loading(tabPath);
                    module2.debug("Content is already loading", fullTabPath);
                  } else if ($2.api !== undefined2) {
                    requestSettings = $2.extend(true, {}, settings.apiSettings, apiSettings);
                    module2.debug("Retrieving remote content", fullTabPath, requestSettings);
                    module2.set.loading(tabPath);
                    $tab.api(requestSettings);
                  } else {
                    module2.error(error.api);
                  }
                }
              },
              activate: {
                all: function(tabPath) {
                  module2.activate.tab(tabPath);
                  module2.activate.navigation(tabPath);
                },
                tab: function(tabPath) {
                  var $tab = module2.get.tabElement(tabPath), $deactiveTabs = settings.deactivate == "siblings" ? $tab.siblings($tabs) : $tabs.not($tab), isActive = $tab.hasClass(className.active);
                  module2.verbose("Showing tab content for", $tab);
                  if (!isActive) {
                    $tab.addClass(className.active);
                    $deactiveTabs.removeClass(className.active + " " + className.loading);
                    if ($tab.length > 0) {
                      settings.onVisible.call($tab[0], tabPath);
                    }
                  }
                },
                navigation: function(tabPath) {
                  var $navigation = module2.get.navElement(tabPath), $deactiveNavigation = settings.deactivate == "siblings" ? $navigation.siblings($allModules) : $allModules.not($navigation), isActive = $navigation.hasClass(className.active);
                  module2.verbose("Activating tab navigation for", $navigation, tabPath);
                  if (!isActive) {
                    $navigation.addClass(className.active);
                    $deactiveNavigation.removeClass(className.active + " " + className.loading);
                  }
                }
              },
              deactivate: {
                all: function() {
                  module2.deactivate.navigation();
                  module2.deactivate.tabs();
                },
                navigation: function() {
                  $allModules.removeClass(className.active);
                },
                tabs: function() {
                  $tabs.removeClass(className.active + " " + className.loading);
                }
              },
              is: {
                tab: function(tabName) {
                  return tabName !== undefined2 ? module2.get.tabElement(tabName).length > 0 : false;
                }
              },
              get: {
                initialPath: function() {
                  return $allModules.eq(0).data(metadata.tab) || $tabs.eq(0).data(metadata.tab);
                },
                path: function() {
                  return $2.address.value();
                },
                defaultPathArray: function(tabPath) {
                  return module2.utilities.pathToArray(module2.get.defaultPath(tabPath));
                },
                defaultPath: function(tabPath) {
                  var $defaultNav = $allModules.filter("[data-" + metadata.tab + '^="' + tabPath + '/"]').eq(0), defaultTab = $defaultNav.data(metadata.tab) || false;
                  if (defaultTab) {
                    module2.debug("Found default tab", defaultTab);
                    if (recursionDepth < settings.maxDepth) {
                      recursionDepth++;
                      return module2.get.defaultPath(defaultTab);
                    }
                    module2.error(error.recursion);
                  } else {
                    module2.debug("No default tabs found for", tabPath, $tabs);
                  }
                  recursionDepth = 0;
                  return tabPath;
                },
                navElement: function(tabPath) {
                  tabPath = tabPath || activeTabPath;
                  return $allModules.filter("[data-" + metadata.tab + '="' + tabPath + '"]');
                },
                tabElement: function(tabPath) {
                  var $fullPathTab, $simplePathTab, tabPathArray, lastTab;
                  tabPath = tabPath || activeTabPath;
                  tabPathArray = module2.utilities.pathToArray(tabPath);
                  lastTab = module2.utilities.last(tabPathArray);
                  $fullPathTab = $tabs.filter("[data-" + metadata.tab + '="' + tabPath + '"]');
                  $simplePathTab = $tabs.filter("[data-" + metadata.tab + '="' + lastTab + '"]');
                  return $fullPathTab.length > 0 ? $fullPathTab : $simplePathTab;
                },
                tab: function() {
                  return activeTabPath;
                }
              },
              utilities: {
                filterArray: function(keepArray, removeArray) {
                  return $2.grep(keepArray, function(keepValue) {
                    return $2.inArray(keepValue, removeArray) == -1;
                  });
                },
                last: function(array) {
                  return $2.isArray(array) ? array[array.length - 1] : false;
                },
                pathToArray: function(pathName) {
                  if (pathName === undefined2) {
                    pathName = activeTabPath;
                  }
                  return typeof pathName == "string" ? pathName.split("/") : [pathName];
                },
                arrayToPath: function(pathArray) {
                  return $2.isArray(pathArray) ? pathArray.join("/") : false;
                }
              },
              setting: function(name, value) {
                module2.debug("Changing setting", name, value);
                if ($2.isPlainObject(name)) {
                  $2.extend(true, settings, name);
                } else if (value !== undefined2) {
                  if ($2.isPlainObject(settings[name])) {
                    $2.extend(true, settings[name], value);
                  } else {
                    settings[name] = value;
                  }
                } else {
                  return settings[name];
                }
              },
              internal: function(name, value) {
                if ($2.isPlainObject(name)) {
                  $2.extend(true, module2, name);
                } else if (value !== undefined2) {
                  module2[name] = value;
                } else {
                  return module2[name];
                }
              },
              debug: function() {
                if (!settings.silent && settings.debug) {
                  if (settings.performance) {
                    module2.performance.log(arguments);
                  } else {
                    module2.debug = Function.prototype.bind.call(console.info, console, settings.name + ":");
                    module2.debug.apply(console, arguments);
                  }
                }
              },
              verbose: function() {
                if (!settings.silent && settings.verbose && settings.debug) {
                  if (settings.performance) {
                    module2.performance.log(arguments);
                  } else {
                    module2.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":");
                    module2.verbose.apply(console, arguments);
                  }
                }
              },
              error: function() {
                if (!settings.silent) {
                  module2.error = Function.prototype.bind.call(console.error, console, settings.name + ":");
                  module2.error.apply(console, arguments);
                }
              },
              performance: {
                log: function(message) {
                  var currentTime, executionTime, previousTime;
                  if (settings.performance) {
                    currentTime = new Date().getTime();
                    previousTime = time || currentTime;
                    executionTime = currentTime - previousTime;
                    time = currentTime;
                    performance.push({
                      "Name": message[0],
                      "Arguments": [].slice.call(message, 1) || "",
                      "Element": element,
                      "Execution Time": executionTime
                    });
                  }
                  clearTimeout(module2.performance.timer);
                  module2.performance.timer = setTimeout(module2.performance.display, 500);
                },
                display: function() {
                  var title = settings.name + ":", totalTime = 0;
                  time = false;
                  clearTimeout(module2.performance.timer);
                  $2.each(performance, function(index, data2) {
                    totalTime += data2["Execution Time"];
                  });
                  title += " " + totalTime + "ms";
                  if (moduleSelector) {
                    title += " '" + moduleSelector + "'";
                  }
                  if ((console.group !== undefined2 || console.table !== undefined2) && performance.length > 0) {
                    console.groupCollapsed(title);
                    if (console.table) {
                      console.table(performance);
                    } else {
                      $2.each(performance, function(index, data2) {
                        console.log(data2["Name"] + ": " + data2["Execution Time"] + "ms");
                      });
                    }
                    console.groupEnd();
                  }
                  performance = [];
                }
              },
              invoke: function(query3, passedArguments, context) {
                var object = instance, maxDepth, found, response;
                passedArguments = passedArguments || queryArguments;
                context = element || context;
                if (typeof query3 == "string" && object !== undefined2) {
                  query3 = query3.split(/[\. ]/);
                  maxDepth = query3.length - 1;
                  $2.each(query3, function(depth, value) {
                    var camelCaseValue = depth != maxDepth ? value + query3[depth + 1].charAt(0).toUpperCase() + query3[depth + 1].slice(1) : query3;
                    if ($2.isPlainObject(object[camelCaseValue]) && depth != maxDepth) {
                      object = object[camelCaseValue];
                    } else if (object[camelCaseValue] !== undefined2) {
                      found = object[camelCaseValue];
                      return false;
                    } else if ($2.isPlainObject(object[value]) && depth != maxDepth) {
                      object = object[value];
                    } else if (object[value] !== undefined2) {
                      found = object[value];
                      return false;
                    } else {
                      module2.error(error.method, query3);
                      return false;
                    }
                  });
                }
                if ($2.isFunction(found)) {
                  response = found.apply(context, passedArguments);
                } else if (found !== undefined2) {
                  response = found;
                }
                if ($2.isArray(returnedValue)) {
                  returnedValue.push(response);
                } else if (returnedValue !== undefined2) {
                  returnedValue = [returnedValue, response];
                } else if (response !== undefined2) {
                  returnedValue = response;
                }
                return found;
              }
            };
            if (methodInvoked) {
              if (instance === undefined2) {
                module2.initialize();
              }
              module2.invoke(query2);
            } else {
              if (instance !== undefined2) {
                instance.invoke("destroy");
              }
              module2.initialize();
            }
          });
          return returnedValue !== undefined2 ? returnedValue : this;
        };
        $2.tab = function() {
          $2(window2).tab.apply(this, arguments);
        };
        _module.exports.settings = {
          name: "Tab",
          namespace: "tab",
          silent: false,
          debug: false,
          verbose: false,
          performance: true,
          auto: false,
          history: false,
          historyType: "hash",
          path: false,
          context: false,
          childrenOnly: false,
          maxDepth: 25,
          deactivate: "siblings",
          alwaysRefresh: false,
          cache: true,
          loadOnce: false,
          cacheType: "response",
          ignoreFirstLoad: false,
          apiSettings: false,
          evaluateScripts: "once",
          onFirstLoad: function(tabPath, parameterArray, historyEvent) {
          },
          onLoad: function(tabPath, parameterArray, historyEvent) {
          },
          onVisible: function(tabPath, parameterArray, historyEvent) {
          },
          onRequest: function(tabPath, parameterArray, historyEvent) {
          },
          templates: {
            determineTitle: function(tabArray) {
            }
          },
          error: {
            api: "You attempted to load content without API module",
            method: "The method you called is not defined",
            missingTab: "Activated tab cannot be found. Tabs are case-sensitive.",
            noContent: "The tab you specified is missing a content url.",
            path: "History enabled, but no path was specified",
            recursion: "Max recursive depth reached",
            legacyInit: "onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.",
            legacyLoad: "onTabLoad has been renamed to onLoad in 2.0. Please adjust your code",
            state: "History requires Asual's Address library <https://github.com/asual/jquery-address>"
          },
          metadata: {
            tab: "tab",
            loaded: "loaded",
            promise: "promise"
          },
          className: {
            loading: "loading",
            active: "active"
          },
          selector: {
            tabs: ".ui.tab",
            ui: ".ui"
          }
        };
      })(require_jquery(), window, document);
    }
  });

  // node_modules/uplot/dist/uPlot.esm.js
  var FEAT_TIME = true;
  function closestIdx(num, arr, lo, hi) {
    let mid;
    lo = lo || 0;
    hi = hi || arr.length - 1;
    let bitwise = hi <= 2147483647;
    while (hi - lo > 1) {
      mid = bitwise ? lo + hi >> 1 : floor((lo + hi) / 2);
      if (arr[mid] < num)
        lo = mid;
      else
        hi = mid;
    }
    if (num - arr[lo] <= arr[hi] - num)
      return lo;
    return hi;
  }
  function nonNullIdx(data2, _i0, _i1, dir) {
    for (let i = dir == 1 ? _i0 : _i1; i >= _i0 && i <= _i1; i += dir) {
      if (data2[i] != null)
        return i;
    }
    return -1;
  }
  function getMinMax(data2, _i0, _i1, sorted) {
    let _min = inf;
    let _max = -inf;
    if (sorted == 1) {
      _min = data2[_i0];
      _max = data2[_i1];
    } else if (sorted == -1) {
      _min = data2[_i1];
      _max = data2[_i0];
    } else {
      for (let i = _i0; i <= _i1; i++) {
        if (data2[i] != null) {
          _min = min(_min, data2[i]);
          _max = max(_max, data2[i]);
        }
      }
    }
    return [_min, _max];
  }
  function getMinMaxLog(data2, _i0, _i1) {
    let _min = inf;
    let _max = -inf;
    for (let i = _i0; i <= _i1; i++) {
      if (data2[i] > 0) {
        _min = min(_min, data2[i]);
        _max = max(_max, data2[i]);
      }
    }
    return [
      _min == inf ? 1 : _min,
      _max == -inf ? 10 : _max
    ];
  }
  var _fixedTuple = [0, 0];
  function fixIncr(minIncr, maxIncr, minExp, maxExp) {
    _fixedTuple[0] = minExp < 0 ? roundDec(minIncr, -minExp) : minIncr;
    _fixedTuple[1] = maxExp < 0 ? roundDec(maxIncr, -maxExp) : maxIncr;
    return _fixedTuple;
  }
  function rangeLog(min2, max2, base, fullMags) {
    let minSign = sign(min2);
    let logFn = base == 10 ? log10 : log2;
    if (min2 == max2) {
      if (minSign == -1) {
        min2 *= base;
        max2 /= base;
      } else {
        min2 /= base;
        max2 *= base;
      }
    }
    let minExp, maxExp, minMaxIncrs;
    if (fullMags) {
      minExp = floor(logFn(min2));
      maxExp = ceil(logFn(max2));
      minMaxIncrs = fixIncr(pow(base, minExp), pow(base, maxExp), minExp, maxExp);
      min2 = minMaxIncrs[0];
      max2 = minMaxIncrs[1];
    } else {
      minExp = floor(logFn(abs(min2)));
      maxExp = floor(logFn(abs(max2)));
      minMaxIncrs = fixIncr(pow(base, minExp), pow(base, maxExp), minExp, maxExp);
      min2 = incrRoundDn(min2, minMaxIncrs[0]);
      max2 = incrRoundUp(max2, minMaxIncrs[1]);
    }
    return [min2, max2];
  }
  function rangeAsinh(min2, max2, base, fullMags) {
    let minMax = rangeLog(min2, max2, base, fullMags);
    if (min2 == 0)
      minMax[0] = 0;
    if (max2 == 0)
      minMax[1] = 0;
    return minMax;
  }
  var rangePad = 0.1;
  var autoRangePart = {
    mode: 3,
    pad: rangePad
  };
  var _eqRangePart = {
    pad: 0,
    soft: null,
    mode: 0
  };
  var _eqRange = {
    min: _eqRangePart,
    max: _eqRangePart
  };
  function rangeNum(_min, _max, mult, extra) {
    if (isObj(mult))
      return _rangeNum(_min, _max, mult);
    _eqRangePart.pad = mult;
    _eqRangePart.soft = extra ? 0 : null;
    _eqRangePart.mode = extra ? 3 : 0;
    return _rangeNum(_min, _max, _eqRange);
  }
  function ifNull(lh, rh) {
    return lh == null ? rh : lh;
  }
  function hasData(data2, idx0, idx1) {
    idx0 = ifNull(idx0, 0);
    idx1 = ifNull(idx1, data2.length - 1);
    while (idx0 <= idx1) {
      if (data2[idx0] != null)
        return true;
      idx0++;
    }
    return false;
  }
  function _rangeNum(_min, _max, cfg) {
    let cmin = cfg.min;
    let cmax = cfg.max;
    let padMin = ifNull(cmin.pad, 0);
    let padMax = ifNull(cmax.pad, 0);
    let hardMin = ifNull(cmin.hard, -inf);
    let hardMax = ifNull(cmax.hard, inf);
    let softMin = ifNull(cmin.soft, inf);
    let softMax = ifNull(cmax.soft, -inf);
    let softMinMode = ifNull(cmin.mode, 0);
    let softMaxMode = ifNull(cmax.mode, 0);
    let delta = _max - _min;
    if (delta < 1e-9) {
      delta = 0;
      if (_min == 0 || _max == 0) {
        delta = 1e-9;
        if (softMinMode == 2 && softMin != inf)
          padMin = 0;
        if (softMaxMode == 2 && softMax != -inf)
          padMax = 0;
      }
    }
    let nonZeroDelta = delta || abs(_max) || 1e3;
    let mag = log10(nonZeroDelta);
    let base = pow(10, floor(mag));
    let _padMin = nonZeroDelta * (delta == 0 ? _min == 0 ? 0.1 : 1 : padMin);
    let _newMin = roundDec(incrRoundDn(_min - _padMin, base / 10), 9);
    let _softMin = _min >= softMin && (softMinMode == 1 || softMinMode == 3 && _newMin <= softMin || softMinMode == 2 && _newMin >= softMin) ? softMin : inf;
    let minLim = max(hardMin, _newMin < _softMin && _min >= _softMin ? _softMin : min(_softMin, _newMin));
    let _padMax = nonZeroDelta * (delta == 0 ? _max == 0 ? 0.1 : 1 : padMax);
    let _newMax = roundDec(incrRoundUp(_max + _padMax, base / 10), 9);
    let _softMax = _max <= softMax && (softMaxMode == 1 || softMaxMode == 3 && _newMax >= softMax || softMaxMode == 2 && _newMax <= softMax) ? softMax : -inf;
    let maxLim = min(hardMax, _newMax > _softMax && _max <= _softMax ? _softMax : max(_softMax, _newMax));
    if (minLim == maxLim && minLim == 0)
      maxLim = 100;
    return [minLim, maxLim];
  }
  var fmtNum = new Intl.NumberFormat(navigator.language).format;
  var M = Math;
  var PI = M.PI;
  var abs = M.abs;
  var floor = M.floor;
  var round = M.round;
  var ceil = M.ceil;
  var min = M.min;
  var max = M.max;
  var pow = M.pow;
  var sign = M.sign;
  var log10 = M.log10;
  var log2 = M.log2;
  var sinh = (v, linthresh = 1) => M.sinh(v) * linthresh;
  var asinh = (v, linthresh = 1) => M.asinh(v / linthresh);
  var inf = Infinity;
  function numIntDigits(x) {
    return (log10((x ^ x >> 31) - (x >> 31)) | 0) + 1;
  }
  function incrRound(num, incr) {
    return round(num / incr) * incr;
  }
  function clamp(num, _min, _max) {
    return min(max(num, _min), _max);
  }
  function fnOrSelf(v) {
    return typeof v == "function" ? v : () => v;
  }
  var retArg0 = (_0) => _0;
  var retArg1 = (_0, _1) => _1;
  var retNull = (_2) => null;
  var retTrue = (_2) => true;
  var retEq = (a, b) => a == b;
  function incrRoundUp(num, incr) {
    return ceil(num / incr) * incr;
  }
  function incrRoundDn(num, incr) {
    return floor(num / incr) * incr;
  }
  function roundDec(val, dec) {
    return round(val * (dec = 10 ** dec)) / dec;
  }
  var fixedDec = /* @__PURE__ */ new Map();
  function guessDec(num) {
    return (("" + num).split(".")[1] || "").length;
  }
  function genIncrs(base, minExp, maxExp, mults) {
    let incrs = [];
    let multDec = mults.map(guessDec);
    for (let exp = minExp; exp < maxExp; exp++) {
      let expa = abs(exp);
      let mag = roundDec(pow(base, exp), expa);
      for (let i = 0; i < mults.length; i++) {
        let _incr = mults[i] * mag;
        let dec = (_incr >= 0 && exp >= 0 ? 0 : expa) + (exp >= multDec[i] ? 0 : multDec[i]);
        let incr = roundDec(_incr, dec);
        incrs.push(incr);
        fixedDec.set(incr, dec);
      }
    }
    return incrs;
  }
  var EMPTY_OBJ = {};
  var EMPTY_ARR = [];
  var nullNullTuple = [null, null];
  var isArr = Array.isArray;
  function isStr(v) {
    return typeof v == "string";
  }
  function isObj(v) {
    let is = false;
    if (v != null) {
      let c = v.constructor;
      is = c == null || c == Object;
    }
    return is;
  }
  function fastIsObj(v) {
    return v != null && typeof v == "object";
  }
  function copy(o, _isObj = isObj) {
    let out;
    if (isArr(o)) {
      let val = o.find((v) => v != null);
      if (isArr(val) || _isObj(val)) {
        out = Array(o.length);
        for (let i = 0; i < o.length; i++)
          out[i] = copy(o[i], _isObj);
      } else
        out = o.slice();
    } else if (_isObj(o)) {
      out = {};
      for (let k in o)
        out[k] = copy(o[k], _isObj);
    } else
      out = o;
    return out;
  }
  function assign(targ) {
    let args = arguments;
    for (let i = 1; i < args.length; i++) {
      let src = args[i];
      for (let key in src) {
        if (isObj(targ[key]))
          assign(targ[key], copy(src[key]));
        else
          targ[key] = copy(src[key]);
      }
    }
    return targ;
  }
  var NULL_REMOVE = 0;
  var NULL_RETAIN = 1;
  var NULL_EXPAND = 2;
  function nullExpand(yVals, nullIdxs, alignedLen) {
    for (let i = 0, xi, lastNullIdx = -1; i < nullIdxs.length; i++) {
      let nullIdx = nullIdxs[i];
      if (nullIdx > lastNullIdx) {
        xi = nullIdx - 1;
        while (xi >= 0 && yVals[xi] == null)
          yVals[xi--] = null;
        xi = nullIdx + 1;
        while (xi < alignedLen && yVals[xi] == null)
          yVals[lastNullIdx = xi++] = null;
      }
    }
  }
  function join(tables, nullModes) {
    let xVals = /* @__PURE__ */ new Set();
    for (let ti = 0; ti < tables.length; ti++) {
      let t = tables[ti];
      let xs = t[0];
      let len = xs.length;
      for (let i = 0; i < len; i++)
        xVals.add(xs[i]);
    }
    let data2 = [Array.from(xVals).sort((a, b) => a - b)];
    let alignedLen = data2[0].length;
    let xIdxs = /* @__PURE__ */ new Map();
    for (let i = 0; i < alignedLen; i++)
      xIdxs.set(data2[0][i], i);
    for (let ti = 0; ti < tables.length; ti++) {
      let t = tables[ti];
      let xs = t[0];
      for (let si = 1; si < t.length; si++) {
        let ys = t[si];
        let yVals = Array(alignedLen).fill(void 0);
        let nullMode = nullModes ? nullModes[ti][si] : NULL_RETAIN;
        let nullIdxs = [];
        for (let i = 0; i < ys.length; i++) {
          let yVal = ys[i];
          let alignedIdx = xIdxs.get(xs[i]);
          if (yVal === null) {
            if (nullMode != NULL_REMOVE) {
              yVals[alignedIdx] = yVal;
              if (nullMode == NULL_EXPAND)
                nullIdxs.push(alignedIdx);
            }
          } else
            yVals[alignedIdx] = yVal;
        }
        nullExpand(yVals, nullIdxs, alignedLen);
        data2.push(yVals);
      }
    }
    return data2;
  }
  var microTask = typeof queueMicrotask == "undefined" ? (fn) => Promise.resolve().then(fn) : queueMicrotask;
  var WIDTH = "width";
  var HEIGHT = "height";
  var TOP = "top";
  var BOTTOM = "bottom";
  var LEFT = "left";
  var RIGHT = "right";
  var hexBlack = "#000";
  var transparent = hexBlack + "0";
  var mousemove = "mousemove";
  var mousedown = "mousedown";
  var mouseup = "mouseup";
  var mouseenter = "mouseenter";
  var mouseleave = "mouseleave";
  var dblclick = "dblclick";
  var resize = "resize";
  var scroll = "scroll";
  var change = "change";
  var dppxchange = "dppxchange";
  var pre = "u-";
  var UPLOT = "uplot";
  var ORI_HZ = pre + "hz";
  var ORI_VT = pre + "vt";
  var TITLE = pre + "title";
  var WRAP = pre + "wrap";
  var UNDER = pre + "under";
  var OVER = pre + "over";
  var AXIS = pre + "axis";
  var OFF = pre + "off";
  var SELECT = pre + "select";
  var CURSOR_X = pre + "cursor-x";
  var CURSOR_Y = pre + "cursor-y";
  var CURSOR_PT = pre + "cursor-pt";
  var LEGEND = pre + "legend";
  var LEGEND_LIVE = pre + "live";
  var LEGEND_INLINE = pre + "inline";
  var LEGEND_THEAD = pre + "thead";
  var LEGEND_SERIES = pre + "series";
  var LEGEND_MARKER = pre + "marker";
  var LEGEND_LABEL = pre + "label";
  var LEGEND_VALUE = pre + "value";
  var doc = document;
  var win = window;
  var pxRatio;
  var query;
  function setPxRatio() {
    let _pxRatio = devicePixelRatio;
    if (pxRatio != _pxRatio) {
      pxRatio = _pxRatio;
      query && off(change, query, setPxRatio);
      query = matchMedia(`(min-resolution: ${pxRatio - 1e-3}dppx) and (max-resolution: ${pxRatio + 1e-3}dppx)`);
      on(change, query, setPxRatio);
      win.dispatchEvent(new CustomEvent(dppxchange));
    }
  }
  function addClass(el, c) {
    if (c != null) {
      let cl = el.classList;
      !cl.contains(c) && cl.add(c);
    }
  }
  function remClass(el, c) {
    let cl = el.classList;
    cl.contains(c) && cl.remove(c);
  }
  function setStylePx(el, name, value) {
    el.style[name] = value + "px";
  }
  function placeTag(tag, cls, targ, refEl) {
    let el = doc.createElement(tag);
    if (cls != null)
      addClass(el, cls);
    if (targ != null)
      targ.insertBefore(el, refEl);
    return el;
  }
  function placeDiv(cls, targ) {
    return placeTag("div", cls, targ);
  }
  var xformCache = /* @__PURE__ */ new WeakMap();
  function elTrans(el, xPos, yPos, xMax, yMax) {
    let xform = "translate(" + xPos + "px," + yPos + "px)";
    let xformOld = xformCache.get(el);
    if (xform != xformOld) {
      el.style.transform = xform;
      xformCache.set(el, xform);
      if (xPos < 0 || yPos < 0 || xPos > xMax || yPos > yMax)
        addClass(el, OFF);
      else
        remClass(el, OFF);
    }
  }
  var colorCache = /* @__PURE__ */ new WeakMap();
  function elColor(el, background, borderColor) {
    let newColor = background + borderColor;
    let oldColor = colorCache.get(el);
    if (newColor != oldColor) {
      colorCache.set(el, newColor);
      el.style.background = background;
      el.style.borderColor = borderColor;
    }
  }
  var sizeCache = /* @__PURE__ */ new WeakMap();
  function elSize(el, newWid, newHgt, centered) {
    let newSize = newWid + "" + newHgt;
    let oldSize = sizeCache.get(el);
    if (newSize != oldSize) {
      sizeCache.set(el, newSize);
      el.style.height = newHgt + "px";
      el.style.width = newWid + "px";
      el.style.marginLeft = centered ? -newWid / 2 + "px" : 0;
      el.style.marginTop = centered ? -newHgt / 2 + "px" : 0;
    }
  }
  var evOpts = { passive: true };
  var evOpts2 = assign({ capture: true }, evOpts);
  function on(ev, el, cb, capt) {
    el.addEventListener(ev, cb, capt ? evOpts2 : evOpts);
  }
  function off(ev, el, cb, capt) {
    el.removeEventListener(ev, cb, capt ? evOpts2 : evOpts);
  }
  setPxRatio();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  function slice3(str) {
    return str.slice(0, 3);
  }
  var days3 = days.map(slice3);
  var months3 = months.map(slice3);
  var engNames = {
    MMMM: months,
    MMM: months3,
    WWWW: days,
    WWW: days3
  };
  function zeroPad2(int) {
    return (int < 10 ? "0" : "") + int;
  }
  function zeroPad3(int) {
    return (int < 10 ? "00" : int < 100 ? "0" : "") + int;
  }
  var subs = {
    YYYY: (d) => d.getFullYear(),
    YY: (d) => (d.getFullYear() + "").slice(2),
    MMMM: (d, names) => names.MMMM[d.getMonth()],
    MMM: (d, names) => names.MMM[d.getMonth()],
    MM: (d) => zeroPad2(d.getMonth() + 1),
    M: (d) => d.getMonth() + 1,
    DD: (d) => zeroPad2(d.getDate()),
    D: (d) => d.getDate(),
    WWWW: (d, names) => names.WWWW[d.getDay()],
    WWW: (d, names) => names.WWW[d.getDay()],
    HH: (d) => zeroPad2(d.getHours()),
    H: (d) => d.getHours(),
    h: (d) => {
      let h = d.getHours();
      return h == 0 ? 12 : h > 12 ? h - 12 : h;
    },
    AA: (d) => d.getHours() >= 12 ? "PM" : "AM",
    aa: (d) => d.getHours() >= 12 ? "pm" : "am",
    a: (d) => d.getHours() >= 12 ? "p" : "a",
    mm: (d) => zeroPad2(d.getMinutes()),
    m: (d) => d.getMinutes(),
    ss: (d) => zeroPad2(d.getSeconds()),
    s: (d) => d.getSeconds(),
    fff: (d) => zeroPad3(d.getMilliseconds())
  };
  function fmtDate(tpl, names) {
    names = names || engNames;
    let parts = [];
    let R = /\{([a-z]+)\}|[^{]+/gi, m;
    while (m = R.exec(tpl))
      parts.push(m[0][0] == "{" ? subs[m[1]] : m[0]);
    return (d) => {
      let out = "";
      for (let i = 0; i < parts.length; i++)
        out += typeof parts[i] == "string" ? parts[i] : parts[i](d, names);
      return out;
    };
  }
  var localTz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  function tzDate(date, tz) {
    let date2;
    if (tz == "UTC" || tz == "Etc/UTC")
      date2 = new Date(+date + date.getTimezoneOffset() * 6e4);
    else if (tz == localTz)
      date2 = date;
    else {
      date2 = new Date(date.toLocaleString("en-US", { timeZone: tz }));
      date2.setMilliseconds(date.getMilliseconds());
    }
    return date2;
  }
  var onlyWhole = (v) => v % 1 == 0;
  var allMults = [1, 2, 2.5, 5];
  var decIncrs = genIncrs(10, -16, 0, allMults);
  var oneIncrs = genIncrs(10, 0, 16, allMults);
  var wholeIncrs = oneIncrs.filter(onlyWhole);
  var numIncrs = decIncrs.concat(oneIncrs);
  var NL = "\n";
  var yyyy = "{YYYY}";
  var NLyyyy = NL + yyyy;
  var md = "{M}/{D}";
  var NLmd = NL + md;
  var NLmdyy = NLmd + "/{YY}";
  var aa = "{aa}";
  var hmm = "{h}:{mm}";
  var hmmaa = hmm + aa;
  var NLhmmaa = NL + hmmaa;
  var ss = ":{ss}";
  var _ = null;
  function genTimeStuffs(ms) {
    let s = ms * 1e3, m = s * 60, h = m * 60, d = h * 24, mo = d * 30, y = d * 365;
    let subSecIncrs = ms == 1 ? genIncrs(10, 0, 3, allMults).filter(onlyWhole) : genIncrs(10, -3, 0, allMults);
    let timeIncrs = subSecIncrs.concat([
      s,
      s * 5,
      s * 10,
      s * 15,
      s * 30,
      m,
      m * 5,
      m * 10,
      m * 15,
      m * 30,
      h,
      h * 2,
      h * 3,
      h * 4,
      h * 6,
      h * 8,
      h * 12,
      d,
      d * 2,
      d * 3,
      d * 4,
      d * 5,
      d * 6,
      d * 7,
      d * 8,
      d * 9,
      d * 10,
      d * 15,
      mo,
      mo * 2,
      mo * 3,
      mo * 4,
      mo * 6,
      y,
      y * 2,
      y * 5,
      y * 10,
      y * 25,
      y * 50,
      y * 100
    ]);
    const _timeAxisStamps = [
      [y, yyyy, _, _, _, _, _, _, 1],
      [d * 28, "{MMM}", NLyyyy, _, _, _, _, _, 1],
      [d, md, NLyyyy, _, _, _, _, _, 1],
      [h, "{h}" + aa, NLmdyy, _, NLmd, _, _, _, 1],
      [m, hmmaa, NLmdyy, _, NLmd, _, _, _, 1],
      [s, ss, NLmdyy + " " + hmmaa, _, NLmd + " " + hmmaa, _, NLhmmaa, _, 1],
      [ms, ss + ".{fff}", NLmdyy + " " + hmmaa, _, NLmd + " " + hmmaa, _, NLhmmaa, _, 1]
    ];
    function timeAxisSplits(tzDate2) {
      return (self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace) => {
        let splits = [];
        let isYr = foundIncr >= y;
        let isMo = foundIncr >= mo && foundIncr < y;
        let minDate = tzDate2(scaleMin);
        let minDateTs = roundDec(minDate * ms, 3);
        let minMin = mkDate(minDate.getFullYear(), isYr ? 0 : minDate.getMonth(), isMo || isYr ? 1 : minDate.getDate());
        let minMinTs = roundDec(minMin * ms, 3);
        if (isMo || isYr) {
          let moIncr = isMo ? foundIncr / mo : 0;
          let yrIncr = isYr ? foundIncr / y : 0;
          let split = minDateTs == minMinTs ? minDateTs : roundDec(mkDate(minMin.getFullYear() + yrIncr, minMin.getMonth() + moIncr, 1) * ms, 3);
          let splitDate = new Date(round(split / ms));
          let baseYear = splitDate.getFullYear();
          let baseMonth = splitDate.getMonth();
          for (let i = 0; split <= scaleMax; i++) {
            let next = mkDate(baseYear + yrIncr * i, baseMonth + moIncr * i, 1);
            let offs = next - tzDate2(roundDec(next * ms, 3));
            split = roundDec((+next + offs) * ms, 3);
            if (split <= scaleMax)
              splits.push(split);
          }
        } else {
          let incr0 = foundIncr >= d ? d : foundIncr;
          let tzOffset = floor(scaleMin) - floor(minDateTs);
          let split = minMinTs + tzOffset + incrRoundUp(minDateTs - minMinTs, incr0);
          splits.push(split);
          let date0 = tzDate2(split);
          let prevHour = date0.getHours() + date0.getMinutes() / m + date0.getSeconds() / h;
          let incrHours = foundIncr / h;
          let minSpace = self2.axes[axisIdx]._space;
          let pctSpace = foundSpace / minSpace;
          while (1) {
            split = roundDec(split + foundIncr, ms == 1 ? 0 : 3);
            if (split > scaleMax)
              break;
            if (incrHours > 1) {
              let expectedHour = floor(roundDec(prevHour + incrHours, 6)) % 24;
              let splitDate = tzDate2(split);
              let actualHour = splitDate.getHours();
              let dstShift = actualHour - expectedHour;
              if (dstShift > 1)
                dstShift = -1;
              split -= dstShift * h;
              prevHour = (prevHour + incrHours) % 24;
              let prevSplit = splits[splits.length - 1];
              let pctIncr = roundDec((split - prevSplit) / foundIncr, 3);
              if (pctIncr * pctSpace >= 0.7)
                splits.push(split);
            } else
              splits.push(split);
          }
        }
        return splits;
      };
    }
    return [
      timeIncrs,
      _timeAxisStamps,
      timeAxisSplits
    ];
  }
  var [timeIncrsMs, _timeAxisStampsMs, timeAxisSplitsMs] = genTimeStuffs(1);
  var [timeIncrsS, _timeAxisStampsS, timeAxisSplitsS] = genTimeStuffs(1e-3);
  genIncrs(2, -53, 53, [1]);
  function timeAxisStamps(stampCfg, fmtDate2) {
    return stampCfg.map((s) => s.map((v, i) => i == 0 || i == 8 || v == null ? v : fmtDate2(i == 1 || s[8] == 0 ? v : s[1] + v)));
  }
  function timeAxisVals(tzDate2, stamps) {
    return (self2, splits, axisIdx, foundSpace, foundIncr) => {
      let s = stamps.find((s2) => foundIncr >= s2[0]) || stamps[stamps.length - 1];
      let prevYear;
      let prevMnth;
      let prevDate;
      let prevHour;
      let prevMins;
      let prevSecs;
      return splits.map((split) => {
        let date = tzDate2(split);
        let newYear = date.getFullYear();
        let newMnth = date.getMonth();
        let newDate = date.getDate();
        let newHour = date.getHours();
        let newMins = date.getMinutes();
        let newSecs = date.getSeconds();
        let stamp = newYear != prevYear && s[2] || newMnth != prevMnth && s[3] || newDate != prevDate && s[4] || newHour != prevHour && s[5] || newMins != prevMins && s[6] || newSecs != prevSecs && s[7] || s[1];
        prevYear = newYear;
        prevMnth = newMnth;
        prevDate = newDate;
        prevHour = newHour;
        prevMins = newMins;
        prevSecs = newSecs;
        return stamp(date);
      });
    };
  }
  function timeAxisVal(tzDate2, dateTpl) {
    let stamp = fmtDate(dateTpl);
    return (self2, splits, axisIdx, foundSpace, foundIncr) => splits.map((split) => stamp(tzDate2(split)));
  }
  function mkDate(y, m, d) {
    return new Date(y, m, d);
  }
  function timeSeriesStamp(stampCfg, fmtDate2) {
    return fmtDate2(stampCfg);
  }
  var _timeSeriesStamp = "{YYYY}-{MM}-{DD} {h}:{mm}{aa}";
  function timeSeriesVal(tzDate2, stamp) {
    return (self2, val) => stamp(tzDate2(val));
  }
  function legendStroke(self2, seriesIdx) {
    let s = self2.series[seriesIdx];
    return s.width ? s.stroke(self2, seriesIdx) : s.points.width ? s.points.stroke(self2, seriesIdx) : null;
  }
  function legendFill(self2, seriesIdx) {
    return self2.series[seriesIdx].fill(self2, seriesIdx);
  }
  var legendOpts = {
    show: true,
    live: true,
    isolate: false,
    markers: {
      show: true,
      width: 2,
      stroke: legendStroke,
      fill: legendFill,
      dash: "solid"
    },
    idx: null,
    idxs: null,
    values: []
  };
  function cursorPointShow(self2, si) {
    let o = self2.cursor.points;
    let pt = placeDiv();
    let size = o.size(self2, si);
    setStylePx(pt, WIDTH, size);
    setStylePx(pt, HEIGHT, size);
    let mar = size / -2;
    setStylePx(pt, "marginLeft", mar);
    setStylePx(pt, "marginTop", mar);
    let width = o.width(self2, si, size);
    width && setStylePx(pt, "borderWidth", width);
    return pt;
  }
  function cursorPointFill(self2, si) {
    let sp = self2.series[si].points;
    return sp._fill || sp._stroke;
  }
  function cursorPointStroke(self2, si) {
    let sp = self2.series[si].points;
    return sp._stroke || sp._fill;
  }
  function cursorPointSize(self2, si) {
    let sp = self2.series[si].points;
    return ptDia(sp.width, 1);
  }
  function dataIdx(self2, seriesIdx, cursorIdx) {
    return cursorIdx;
  }
  var moveTuple = [0, 0];
  function cursorMove(self2, mouseLeft1, mouseTop1) {
    moveTuple[0] = mouseLeft1;
    moveTuple[1] = mouseTop1;
    return moveTuple;
  }
  function filtBtn0(self2, targ, handle) {
    return (e) => {
      e.button == 0 && handle(e);
    };
  }
  function passThru(self2, targ, handle) {
    return handle;
  }
  var cursorOpts = {
    show: true,
    x: true,
    y: true,
    lock: false,
    move: cursorMove,
    points: {
      show: cursorPointShow,
      size: cursorPointSize,
      width: 0,
      stroke: cursorPointStroke,
      fill: cursorPointFill
    },
    bind: {
      mousedown: filtBtn0,
      mouseup: filtBtn0,
      click: filtBtn0,
      dblclick: filtBtn0,
      mousemove: passThru,
      mouseleave: passThru,
      mouseenter: passThru
    },
    drag: {
      setScale: true,
      x: true,
      y: false,
      dist: 0,
      uni: null,
      _x: false,
      _y: false
    },
    focus: {
      prox: -1
    },
    left: -10,
    top: -10,
    idx: null,
    dataIdx,
    idxs: null
  };
  var grid = {
    show: true,
    stroke: "rgba(0,0,0,0.07)",
    width: 2,
    filter: retArg1
  };
  var ticks = assign({}, grid, { size: 10 });
  var font = '12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
  var labelFont = "bold " + font;
  var lineMult = 1.5;
  var xAxisOpts = {
    show: true,
    scale: "x",
    stroke: hexBlack,
    space: 50,
    gap: 5,
    size: 50,
    labelGap: 0,
    labelSize: 30,
    labelFont,
    side: 2,
    grid,
    ticks,
    font,
    rotate: 0
  };
  var numSeriesLabel = "Value";
  var timeSeriesLabel = "Time";
  var xSeriesOpts = {
    show: true,
    scale: "x",
    auto: false,
    sorted: 1,
    min: inf,
    max: -inf,
    idxs: []
  };
  function numAxisVals(self2, splits, axisIdx, foundSpace, foundIncr) {
    return splits.map((v) => v == null ? "" : fmtNum(v));
  }
  function numAxisSplits(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
    let splits = [];
    let numDec = fixedDec.get(foundIncr) || 0;
    scaleMin = forceMin ? scaleMin : roundDec(incrRoundUp(scaleMin, foundIncr), numDec);
    for (let val = scaleMin; val <= scaleMax; val = roundDec(val + foundIncr, numDec))
      splits.push(Object.is(val, -0) ? 0 : val);
    return splits;
  }
  function logAxisSplits(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
    const splits = [];
    const logBase = self2.scales[self2.axes[axisIdx].scale].log;
    const logFn = logBase == 10 ? log10 : log2;
    const exp = floor(logFn(scaleMin));
    foundIncr = pow(logBase, exp);
    if (exp < 0)
      foundIncr = roundDec(foundIncr, -exp);
    let split = scaleMin;
    do {
      splits.push(split);
      split = roundDec(split + foundIncr, fixedDec.get(foundIncr));
      if (split >= foundIncr * logBase)
        foundIncr = split;
    } while (split <= scaleMax);
    return splits;
  }
  function asinhAxisSplits(self2, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
    let sc = self2.scales[self2.axes[axisIdx].scale];
    let linthresh = sc.asinh;
    let posSplits = scaleMax > linthresh ? logAxisSplits(self2, axisIdx, max(linthresh, scaleMin), scaleMax, foundIncr) : [linthresh];
    let zero = scaleMax >= 0 && scaleMin <= 0 ? [0] : [];
    let negSplits = scaleMin < -linthresh ? logAxisSplits(self2, axisIdx, max(linthresh, -scaleMax), -scaleMin, foundIncr) : [linthresh];
    return negSplits.reverse().map((v) => -v).concat(zero, posSplits);
  }
  var RE_ALL = /./;
  var RE_12357 = /[12357]/;
  var RE_125 = /[125]/;
  var RE_1 = /1/;
  function logAxisValsFilt(self2, splits, axisIdx, foundSpace, foundIncr) {
    let axis = self2.axes[axisIdx];
    let scaleKey = axis.scale;
    let sc = self2.scales[scaleKey];
    if (sc.distr == 3 && sc.log == 2)
      return splits;
    let valToPos = self2.valToPos;
    let minSpace = axis._space;
    let _10 = valToPos(10, scaleKey);
    let re = valToPos(9, scaleKey) - _10 >= minSpace ? RE_ALL : valToPos(7, scaleKey) - _10 >= minSpace ? RE_12357 : valToPos(5, scaleKey) - _10 >= minSpace ? RE_125 : RE_1;
    return splits.map((v) => sc.distr == 4 && v == 0 || re.test(v) ? v : null);
  }
  function numSeriesVal(self2, val) {
    return val == null ? "" : fmtNum(val);
  }
  var yAxisOpts = {
    show: true,
    scale: "y",
    stroke: hexBlack,
    space: 30,
    gap: 5,
    size: 50,
    labelGap: 0,
    labelSize: 30,
    labelFont,
    side: 3,
    grid,
    ticks,
    font,
    rotate: 0
  };
  function ptDia(width, mult) {
    let dia = 3 + (width || 1) * 2;
    return roundDec(dia * mult, 3);
  }
  function seriesPointsShow(self2, si) {
    let { scale, idxs } = self2.series[0];
    let xData = self2._data[0];
    let p0 = self2.valToPos(xData[idxs[0]], scale, true);
    let p1 = self2.valToPos(xData[idxs[1]], scale, true);
    let dim = abs(p1 - p0);
    let s = self2.series[si];
    let maxPts = dim / (s.points.space * pxRatio);
    return idxs[1] - idxs[0] <= maxPts;
  }
  function seriesFillTo(self2, seriesIdx, dataMin, dataMax) {
    let scale = self2.scales[self2.series[seriesIdx].scale];
    let isUpperBandEdge = self2.bands && self2.bands.some((b) => b.series[0] == seriesIdx);
    return scale.distr == 3 || isUpperBandEdge ? scale.min : 0;
  }
  var facet = {
    scale: null,
    auto: true,
    min: inf,
    max: -inf
  };
  var xySeriesOpts = {
    show: true,
    auto: true,
    sorted: 0,
    alpha: 1,
    facets: [
      assign({}, facet, { scale: "x" }),
      assign({}, facet, { scale: "y" })
    ]
  };
  var ySeriesOpts = {
    scale: "y",
    auto: true,
    sorted: 0,
    show: true,
    spanGaps: false,
    gaps: (self2, seriesIdx, idx0, idx1, nullGaps) => nullGaps,
    alpha: 1,
    points: {
      show: seriesPointsShow,
      filter: null
    },
    values: null,
    min: inf,
    max: -inf,
    idxs: [],
    path: null,
    clip: null
  };
  function clampScale(self2, val, scaleMin, scaleMax, scaleKey) {
    return scaleMin / 10;
  }
  var xScaleOpts = {
    time: FEAT_TIME,
    auto: true,
    distr: 1,
    log: 10,
    asinh: 1,
    min: null,
    max: null,
    dir: 1,
    ori: 0
  };
  var yScaleOpts = assign({}, xScaleOpts, {
    time: false,
    ori: 1
  });
  var syncs = {};
  function _sync(key, opts2) {
    let s = syncs[key];
    if (!s) {
      s = {
        key,
        plots: [],
        sub(plot) {
          s.plots.push(plot);
        },
        unsub(plot) {
          s.plots = s.plots.filter((c) => c != plot);
        },
        pub(type, self2, x, y, w, h, i) {
          for (let j = 0; j < s.plots.length; j++)
            s.plots[j] != self2 && s.plots[j].pub(type, self2, x, y, w, h, i);
        }
      };
      if (key != null)
        syncs[key] = s;
    }
    return s;
  }
  var BAND_CLIP_FILL = 1 << 0;
  var BAND_CLIP_STROKE = 1 << 1;
  function orient(u2, seriesIdx, cb) {
    const series = u2.series[seriesIdx];
    const scales2 = u2.scales;
    const bbox = u2.bbox;
    const scaleX = u2.mode == 2 ? scales2[series.facets[0].scale] : scales2[u2.series[0].scale];
    let dx = u2._data[0], dy = u2._data[seriesIdx], sx = scaleX, sy = u2.mode == 2 ? scales2[series.facets[1].scale] : scales2[series.scale], l = bbox.left, t = bbox.top, w = bbox.width, h = bbox.height, H = u2.valToPosH, V = u2.valToPosV;
    return sx.ori == 0 ? cb(series, dx, dy, sx, sy, H, V, l, t, w, h, moveToH, lineToH, rectH, arcH, bezierCurveToH) : cb(series, dx, dy, sx, sy, V, H, t, l, h, w, moveToV, lineToV, rectV, arcV, bezierCurveToV);
  }
  function clipBandLine(self2, seriesIdx, idx0, idx1, strokePath) {
    return orient(self2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
      let pxRound = series.pxRound;
      const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
      const lineTo = scaleX.ori == 0 ? lineToH : lineToV;
      let frIdx, toIdx;
      if (dir == 1) {
        frIdx = idx0;
        toIdx = idx1;
      } else {
        frIdx = idx1;
        toIdx = idx0;
      }
      let x0 = pxRound(valToPosX(dataX[frIdx], scaleX, xDim, xOff));
      let y0 = pxRound(valToPosY(dataY[frIdx], scaleY, yDim, yOff));
      let x1 = pxRound(valToPosX(dataX[toIdx], scaleX, xDim, xOff));
      let yLimit = pxRound(valToPosY(scaleY.max, scaleY, yDim, yOff));
      let clip = new Path2D(strokePath);
      lineTo(clip, x1, yLimit);
      lineTo(clip, x0, yLimit);
      lineTo(clip, x0, y0);
      return clip;
    });
  }
  function clipGaps(gaps, ori, plotLft, plotTop, plotWid, plotHgt) {
    let clip = null;
    if (gaps.length > 0) {
      clip = new Path2D();
      const rect2 = ori == 0 ? rectH : rectV;
      let prevGapEnd = plotLft;
      for (let i = 0; i < gaps.length; i++) {
        let g = gaps[i];
        if (g[1] > g[0]) {
          rect2(clip, prevGapEnd, plotTop, g[0] - prevGapEnd, plotTop + plotHgt);
          prevGapEnd = g[1];
        }
      }
      rect2(clip, prevGapEnd, plotTop, plotLft + plotWid - prevGapEnd, plotTop + plotHgt);
    }
    return clip;
  }
  function addGap(gaps, fromX, toX) {
    let prevGap = gaps[gaps.length - 1];
    if (prevGap && prevGap[0] == fromX)
      prevGap[1] = toX;
    else
      gaps.push([fromX, toX]);
  }
  function pxRoundGen(pxAlign) {
    return pxAlign == 0 ? retArg0 : pxAlign == 1 ? round : (v) => incrRound(v, pxAlign);
  }
  function rect(ori) {
    let moveTo = ori == 0 ? moveToH : moveToV;
    let arcTo = ori == 0 ? (p, x1, y1, x2, y2, r) => {
      p.arcTo(x1, y1, x2, y2, r);
    } : (p, y1, x1, y2, x2, r) => {
      p.arcTo(x1, y1, x2, y2, r);
    };
    let rect2 = ori == 0 ? (p, x, y, w, h) => {
      p.rect(x, y, w, h);
    } : (p, y, x, h, w) => {
      p.rect(x, y, w, h);
    };
    return (p, x, y, w, h, r = 0) => {
      if (r == 0)
        rect2(p, x, y, w, h);
      else {
        r = Math.min(r, w / 2, h / 2);
        moveTo(p, x + r, y);
        arcTo(p, x + w, y, x + w, y + h, r);
        arcTo(p, x + w, y + h, x, y + h, r);
        arcTo(p, x, y + h, x, y, r);
        arcTo(p, x, y, x + w, y, r);
        p.closePath();
      }
    };
  }
  var moveToH = (p, x, y) => {
    p.moveTo(x, y);
  };
  var moveToV = (p, y, x) => {
    p.moveTo(x, y);
  };
  var lineToH = (p, x, y) => {
    p.lineTo(x, y);
  };
  var lineToV = (p, y, x) => {
    p.lineTo(x, y);
  };
  var rectH = rect(0);
  var rectV = rect(1);
  var arcH = (p, x, y, r, startAngle, endAngle) => {
    p.arc(x, y, r, startAngle, endAngle);
  };
  var arcV = (p, y, x, r, startAngle, endAngle) => {
    p.arc(x, y, r, startAngle, endAngle);
  };
  var bezierCurveToH = (p, bp1x, bp1y, bp2x, bp2y, p2x, p2y) => {
    p.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y);
  };
  var bezierCurveToV = (p, bp1y, bp1x, bp2y, bp2x, p2y, p2x) => {
    p.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y);
  };
  function points(opts2) {
    return (u2, seriesIdx, idx0, idx1, filtIdxs) => {
      return orient(u2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
        let { pxRound, points: points2 } = series;
        let moveTo, arc;
        if (scaleX.ori == 0) {
          moveTo = moveToH;
          arc = arcH;
        } else {
          moveTo = moveToV;
          arc = arcV;
        }
        const width = roundDec(points2.width * pxRatio, 3);
        let rad = (points2.size - points2.width) / 2 * pxRatio;
        let dia = roundDec(rad * 2, 3);
        let fill = new Path2D();
        let clip = new Path2D();
        let { left: lft, top, width: wid, height: hgt } = u2.bbox;
        rectH(clip, lft - dia, top - dia, wid + dia * 2, hgt + dia * 2);
        const drawPoint = (pi) => {
          if (dataY[pi] != null) {
            let x = pxRound(valToPosX(dataX[pi], scaleX, xDim, xOff));
            let y = pxRound(valToPosY(dataY[pi], scaleY, yDim, yOff));
            moveTo(fill, x + rad, y);
            arc(fill, x, y, rad, 0, PI * 2);
          }
        };
        if (filtIdxs)
          filtIdxs.forEach(drawPoint);
        else {
          for (let pi = idx0; pi <= idx1; pi++)
            drawPoint(pi);
        }
        return {
          stroke: width > 0 ? fill : null,
          fill,
          clip,
          flags: BAND_CLIP_FILL | BAND_CLIP_STROKE
        };
      });
    };
  }
  function _drawAcc(lineTo) {
    return (stroke, accX, minY, maxY, inY, outY) => {
      if (minY != maxY) {
        if (inY != minY && outY != minY)
          lineTo(stroke, accX, minY);
        if (inY != maxY && outY != maxY)
          lineTo(stroke, accX, maxY);
        lineTo(stroke, accX, outY);
      }
    };
  }
  var drawAccH = _drawAcc(lineToH);
  var drawAccV = _drawAcc(lineToV);
  function linear() {
    return (u2, seriesIdx, idx0, idx1) => {
      return orient(u2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
        let pxRound = series.pxRound;
        let lineTo, drawAcc;
        if (scaleX.ori == 0) {
          lineTo = lineToH;
          drawAcc = drawAccH;
        } else {
          lineTo = lineToV;
          drawAcc = drawAccV;
        }
        const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
        const _paths = { stroke: new Path2D(), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
        const stroke = _paths.stroke;
        let minY = inf, maxY = -inf, inY, outY, outX, drawnAtX;
        let gaps = [];
        let accX = pxRound(valToPosX(dataX[dir == 1 ? idx0 : idx1], scaleX, xDim, xOff));
        let accGaps = false;
        let prevYNull = false;
        let lftIdx = nonNullIdx(dataY, idx0, idx1, 1 * dir);
        let rgtIdx = nonNullIdx(dataY, idx0, idx1, -1 * dir);
        let lftX = pxRound(valToPosX(dataX[lftIdx], scaleX, xDim, xOff));
        let rgtX = pxRound(valToPosX(dataX[rgtIdx], scaleX, xDim, xOff));
        if (lftX > xOff)
          addGap(gaps, xOff, lftX);
        for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
          let x = pxRound(valToPosX(dataX[i], scaleX, xDim, xOff));
          if (x == accX) {
            if (dataY[i] != null) {
              outY = pxRound(valToPosY(dataY[i], scaleY, yDim, yOff));
              if (minY == inf) {
                lineTo(stroke, x, outY);
                inY = outY;
              }
              minY = min(outY, minY);
              maxY = max(outY, maxY);
            } else if (dataY[i] === null)
              accGaps = prevYNull = true;
          } else {
            let _addGap = false;
            if (minY != inf) {
              drawAcc(stroke, accX, minY, maxY, inY, outY);
              outX = drawnAtX = accX;
            } else if (accGaps) {
              _addGap = true;
              accGaps = false;
            }
            if (dataY[i] != null) {
              outY = pxRound(valToPosY(dataY[i], scaleY, yDim, yOff));
              lineTo(stroke, x, outY);
              minY = maxY = inY = outY;
              if (prevYNull && x - accX > 1)
                _addGap = true;
              prevYNull = false;
            } else {
              minY = inf;
              maxY = -inf;
              if (dataY[i] === null) {
                accGaps = true;
                if (x - accX > 1)
                  _addGap = true;
              }
            }
            _addGap && addGap(gaps, outX, x);
            accX = x;
          }
        }
        if (minY != inf && minY != maxY && drawnAtX != accX)
          drawAcc(stroke, accX, minY, maxY, inY, outY);
        if (rgtX < xOff + xDim)
          addGap(gaps, rgtX, xOff + xDim);
        if (series.fill != null) {
          let fill = _paths.fill = new Path2D(stroke);
          let fillTo = pxRound(valToPosY(series.fillTo(u2, seriesIdx, series.min, series.max), scaleY, yDim, yOff));
          lineTo(fill, rgtX, fillTo);
          lineTo(fill, lftX, fillTo);
        }
        _paths.gaps = gaps = series.gaps(u2, seriesIdx, idx0, idx1, gaps);
        if (!series.spanGaps)
          _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
        if (u2.bands.length > 0) {
          _paths.band = clipBandLine(u2, seriesIdx, idx0, idx1, stroke);
        }
        return _paths;
      });
    };
  }
  function stepped(opts2) {
    const align = ifNull(opts2.align, 1);
    const ascDesc = ifNull(opts2.ascDesc, false);
    return (u2, seriesIdx, idx0, idx1) => {
      return orient(u2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
        let pxRound = series.pxRound;
        let lineTo = scaleX.ori == 0 ? lineToH : lineToV;
        const _paths = { stroke: new Path2D(), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
        const stroke = _paths.stroke;
        const _dir = 1 * scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
        idx0 = nonNullIdx(dataY, idx0, idx1, 1);
        idx1 = nonNullIdx(dataY, idx0, idx1, -1);
        let gaps = [];
        let inGap = false;
        let prevYPos = pxRound(valToPosY(dataY[_dir == 1 ? idx0 : idx1], scaleY, yDim, yOff));
        let firstXPos = pxRound(valToPosX(dataX[_dir == 1 ? idx0 : idx1], scaleX, xDim, xOff));
        let prevXPos = firstXPos;
        lineTo(stroke, firstXPos, prevYPos);
        for (let i = _dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += _dir) {
          let yVal1 = dataY[i];
          let x1 = pxRound(valToPosX(dataX[i], scaleX, xDim, xOff));
          if (yVal1 == null) {
            if (yVal1 === null) {
              addGap(gaps, prevXPos, x1);
              inGap = true;
            }
            continue;
          }
          let y1 = pxRound(valToPosY(yVal1, scaleY, yDim, yOff));
          if (inGap) {
            addGap(gaps, prevXPos, x1);
            if (prevYPos != y1) {
              let halfStroke = series.width * pxRatio / 2;
              let lastGap = gaps[gaps.length - 1];
              lastGap[0] += ascDesc || align == 1 ? halfStroke : -halfStroke;
              lastGap[1] -= ascDesc || align == -1 ? halfStroke : -halfStroke;
            }
            inGap = false;
          }
          if (align == 1)
            lineTo(stroke, x1, prevYPos);
          else
            lineTo(stroke, prevXPos, y1);
          lineTo(stroke, x1, y1);
          prevYPos = y1;
          prevXPos = x1;
        }
        if (series.fill != null) {
          let fill = _paths.fill = new Path2D(stroke);
          let fillTo = series.fillTo(u2, seriesIdx, series.min, series.max);
          let minY = pxRound(valToPosY(fillTo, scaleY, yDim, yOff));
          lineTo(fill, prevXPos, minY);
          lineTo(fill, firstXPos, minY);
        }
        _paths.gaps = gaps = series.gaps(u2, seriesIdx, idx0, idx1, gaps);
        if (!series.spanGaps)
          _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
        if (u2.bands.length > 0) {
          _paths.band = clipBandLine(u2, seriesIdx, idx0, idx1, stroke);
        }
        return _paths;
      });
    };
  }
  function bars(opts2) {
    opts2 = opts2 || EMPTY_OBJ;
    const size = ifNull(opts2.size, [0.6, inf, 1]);
    const align = opts2.align || 0;
    const extraGap = (opts2.gap || 0) * pxRatio;
    const radius = ifNull(opts2.radius, 0) * pxRatio;
    const gapFactor = 1 - size[0];
    const maxWidth = ifNull(size[1], inf) * pxRatio;
    const minWidth = ifNull(size[2], 1) * pxRatio;
    const disp = opts2.disp;
    const _each = ifNull(opts2.each, (_2) => {
    });
    return (u2, seriesIdx, idx0, idx1) => {
      return orient(u2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
        let pxRound = series.pxRound;
        const _dirX = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
        const _dirY = scaleY.dir * (scaleY.ori == 1 ? 1 : -1);
        let rect2 = scaleX.ori == 0 ? rectH : rectV;
        let each = scaleX.ori == 0 ? _each : (u3, seriesIdx2, i, top, lft, hgt, wid) => {
          _each(u3, seriesIdx2, i, lft, top, wid, hgt);
        };
        let fillToY = series.fillTo(u2, seriesIdx, series.min, series.max);
        let y0Pos = valToPosY(fillToY, scaleY, yDim, yOff);
        let xShift, barWid;
        let strokeWidth = pxRound(series.width * pxRatio);
        let multiPath = false;
        let fillColors = null;
        let fillPaths = null;
        let strokeColors = null;
        let strokePaths = null;
        if (disp != null) {
          if (disp.fill != null && disp.stroke != null) {
            multiPath = true;
            fillColors = disp.fill.values(u2, seriesIdx, idx0, idx1);
            fillPaths = /* @__PURE__ */ new Map();
            new Set(fillColors).forEach((color) => {
              if (color != null)
                fillPaths.set(color, new Path2D());
            });
            strokeColors = disp.stroke.values(u2, seriesIdx, idx0, idx1);
            strokePaths = /* @__PURE__ */ new Map();
            new Set(strokeColors).forEach((color) => {
              if (color != null)
                strokePaths.set(color, new Path2D());
            });
          }
          dataX = disp.x0.values(u2, seriesIdx, idx0, idx1);
          if (disp.x0.unit == 2)
            dataX = dataX.map((pct) => u2.posToVal(xOff + pct * xDim, scaleX.key, true));
          let sizes = disp.size.values(u2, seriesIdx, idx0, idx1);
          if (disp.size.unit == 2)
            barWid = sizes[0] * xDim;
          else
            barWid = valToPosX(sizes[0], scaleX, xDim, xOff) - valToPosX(0, scaleX, xDim, xOff);
          barWid = pxRound(barWid - strokeWidth);
          xShift = _dirX == 1 ? -strokeWidth / 2 : barWid + strokeWidth / 2;
        } else {
          let colWid = xDim;
          if (dataX.length > 1) {
            let prevIdx = null;
            for (let i = 0, minDelta = Infinity; i < dataX.length; i++) {
              if (dataY[i] !== void 0) {
                if (prevIdx != null) {
                  let delta = abs(dataX[i] - dataX[prevIdx]);
                  if (delta < minDelta) {
                    minDelta = delta;
                    colWid = abs(valToPosX(dataX[i], scaleX, xDim, xOff) - valToPosX(dataX[prevIdx], scaleX, xDim, xOff));
                  }
                }
                prevIdx = i;
              }
            }
          }
          let gapWid = colWid * gapFactor;
          barWid = pxRound(min(maxWidth, max(minWidth, colWid - gapWid)) - strokeWidth - extraGap);
          xShift = (align == 0 ? barWid / 2 : align == _dirX ? 0 : barWid) - align * _dirX * extraGap / 2;
        }
        const _paths = { stroke: null, fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL | BAND_CLIP_STROKE };
        const hasBands = u2.bands.length > 0;
        let yLimit;
        if (hasBands) {
          _paths.band = new Path2D();
          yLimit = pxRound(valToPosY(scaleY.max, scaleY, yDim, yOff));
        }
        const stroke = multiPath ? null : new Path2D();
        const band = _paths.band;
        for (let i = _dirX == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += _dirX) {
          let yVal = dataY[i];
          let xVal = scaleX.distr != 2 || disp != null ? dataX[i] : i;
          let xPos = valToPosX(xVal, scaleX, xDim, xOff);
          let yPos = valToPosY(yVal, scaleY, yDim, yOff);
          let lft = pxRound(xPos - xShift);
          let btm = pxRound(max(yPos, y0Pos));
          let top = pxRound(min(yPos, y0Pos));
          let barHgt = btm - top;
          if (dataY[i] != null) {
            if (multiPath) {
              if (strokeWidth > 0 && strokeColors[i] != null)
                rect2(strokePaths.get(strokeColors[i]), lft, top, barWid, barHgt, radius * barWid);
              if (fillColors[i] != null)
                rect2(fillPaths.get(fillColors[i]), lft, top, barWid, barHgt, radius * barWid);
            } else
              rect2(stroke, lft, top, barWid, barHgt, radius * barWid);
            each(u2, seriesIdx, i, lft - strokeWidth / 2, top - strokeWidth / 2, barWid + strokeWidth, barHgt + strokeWidth);
          }
          if (hasBands) {
            if (_dirY == 1) {
              btm = top;
              top = yLimit;
            } else {
              top = btm;
              btm = yLimit;
            }
            barHgt = btm - top;
            rect2(band, lft - strokeWidth / 2, top + strokeWidth / 2, barWid + strokeWidth, barHgt - strokeWidth, 0);
          }
        }
        if (strokeWidth > 0)
          _paths.stroke = multiPath ? strokePaths : stroke;
        _paths.fill = multiPath ? fillPaths : stroke;
        return _paths;
      });
    };
  }
  function splineInterp(interp, opts2) {
    return (u2, seriesIdx, idx0, idx1) => {
      return orient(u2, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
        let pxRound = series.pxRound;
        let moveTo, bezierCurveTo, lineTo;
        if (scaleX.ori == 0) {
          moveTo = moveToH;
          lineTo = lineToH;
          bezierCurveTo = bezierCurveToH;
        } else {
          moveTo = moveToV;
          lineTo = lineToV;
          bezierCurveTo = bezierCurveToV;
        }
        const _dir = 1 * scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
        idx0 = nonNullIdx(dataY, idx0, idx1, 1);
        idx1 = nonNullIdx(dataY, idx0, idx1, -1);
        let gaps = [];
        let inGap = false;
        let firstXPos = pxRound(valToPosX(dataX[_dir == 1 ? idx0 : idx1], scaleX, xDim, xOff));
        let prevXPos = firstXPos;
        let xCoords = [];
        let yCoords = [];
        for (let i = _dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += _dir) {
          let yVal = dataY[i];
          let xVal = dataX[i];
          let xPos = valToPosX(xVal, scaleX, xDim, xOff);
          if (yVal == null) {
            if (yVal === null) {
              addGap(gaps, prevXPos, xPos);
              inGap = true;
            }
            continue;
          } else {
            if (inGap) {
              addGap(gaps, prevXPos, xPos);
              inGap = false;
            }
            xCoords.push(prevXPos = xPos);
            yCoords.push(valToPosY(dataY[i], scaleY, yDim, yOff));
          }
        }
        const _paths = { stroke: interp(xCoords, yCoords, moveTo, lineTo, bezierCurveTo, pxRound), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL };
        const stroke = _paths.stroke;
        if (series.fill != null && stroke != null) {
          let fill = _paths.fill = new Path2D(stroke);
          let fillTo = series.fillTo(u2, seriesIdx, series.min, series.max);
          let minY = pxRound(valToPosY(fillTo, scaleY, yDim, yOff));
          lineTo(fill, prevXPos, minY);
          lineTo(fill, firstXPos, minY);
        }
        _paths.gaps = gaps = series.gaps(u2, seriesIdx, idx0, idx1, gaps);
        if (!series.spanGaps)
          _paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
        if (u2.bands.length > 0) {
          _paths.band = clipBandLine(u2, seriesIdx, idx0, idx1, stroke);
        }
        return _paths;
      });
    };
  }
  function monotoneCubic(opts2) {
    return splineInterp(_monotoneCubic);
  }
  function _monotoneCubic(xs, ys, moveTo, lineTo, bezierCurveTo, pxRound) {
    const n = xs.length;
    if (n < 2)
      return null;
    const path = new Path2D();
    moveTo(path, xs[0], ys[0]);
    if (n == 2)
      lineTo(path, xs[1], ys[1]);
    else {
      let ms = Array(n), ds = Array(n - 1), dys = Array(n - 1), dxs = Array(n - 1);
      for (let i = 0; i < n - 1; i++) {
        dys[i] = ys[i + 1] - ys[i];
        dxs[i] = xs[i + 1] - xs[i];
        ds[i] = dys[i] / dxs[i];
      }
      ms[0] = ds[0];
      for (let i = 1; i < n - 1; i++) {
        if (ds[i] === 0 || ds[i - 1] === 0 || ds[i - 1] > 0 !== ds[i] > 0)
          ms[i] = 0;
        else {
          ms[i] = 3 * (dxs[i - 1] + dxs[i]) / ((2 * dxs[i] + dxs[i - 1]) / ds[i - 1] + (dxs[i] + 2 * dxs[i - 1]) / ds[i]);
          if (!isFinite(ms[i]))
            ms[i] = 0;
        }
      }
      ms[n - 1] = ds[n - 2];
      for (let i = 0; i < n - 1; i++) {
        bezierCurveTo(path, xs[i] + dxs[i] / 3, ys[i] + ms[i] * dxs[i] / 3, xs[i + 1] - dxs[i] / 3, ys[i + 1] - ms[i + 1] * dxs[i] / 3, xs[i + 1], ys[i + 1]);
      }
    }
    return path;
  }
  var cursorPlots = /* @__PURE__ */ new Set();
  function invalidateRects() {
    cursorPlots.forEach((u2) => {
      u2.syncRect(true);
    });
  }
  on(resize, win, invalidateRects);
  on(scroll, win, invalidateRects, true);
  var linearPath = linear();
  var pointsPath = points();
  function setDefaults(d, xo, yo, initY) {
    let d2 = initY ? [d[0], d[1]].concat(d.slice(2)) : [d[0]].concat(d.slice(1));
    return d2.map((o, i) => setDefault(o, i, xo, yo));
  }
  function setDefaults2(d, xyo) {
    return d.map((o, i) => i == 0 ? null : assign({}, xyo, o));
  }
  function setDefault(o, i, xo, yo) {
    return assign({}, i == 0 ? xo : yo, o);
  }
  function snapNumX(self2, dataMin, dataMax) {
    return dataMin == null ? nullNullTuple : [dataMin, dataMax];
  }
  var snapTimeX = snapNumX;
  function snapNumY(self2, dataMin, dataMax) {
    return dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, rangePad, true);
  }
  function snapLogY(self2, dataMin, dataMax, scale) {
    return dataMin == null ? nullNullTuple : rangeLog(dataMin, dataMax, self2.scales[scale].log, false);
  }
  var snapLogX = snapLogY;
  function snapAsinhY(self2, dataMin, dataMax, scale) {
    return dataMin == null ? nullNullTuple : rangeAsinh(dataMin, dataMax, self2.scales[scale].log, false);
  }
  var snapAsinhX = snapAsinhY;
  function findIncr(minVal, maxVal, incrs, dim, minSpace) {
    let intDigits = max(numIntDigits(minVal), numIntDigits(maxVal));
    let delta = maxVal - minVal;
    let incrIdx = closestIdx(minSpace / dim * delta, incrs);
    do {
      let foundIncr = incrs[incrIdx];
      let foundSpace = dim * foundIncr / delta;
      if (foundSpace >= minSpace && intDigits + (foundIncr < 5 ? fixedDec.get(foundIncr) : 0) <= 17)
        return [foundIncr, foundSpace];
    } while (++incrIdx < incrs.length);
    return [0, 0];
  }
  function pxRatioFont(font2) {
    let fontSize, fontSizeCss;
    font2 = font2.replace(/(\d+)px/, (m, p1) => (fontSize = round((fontSizeCss = +p1) * pxRatio)) + "px");
    return [font2, fontSize, fontSizeCss];
  }
  function syncFontSize(axis) {
    if (axis.show) {
      [axis.font, axis.labelFont].forEach((f) => {
        let size = roundDec(f[2] * pxRatio, 1);
        f[0] = f[0].replace(/[0-9.]+px/, size + "px");
        f[1] = size;
      });
    }
  }
  function uPlot(opts2, data2, then) {
    const self2 = {
      mode: ifNull(opts2.mode, 1)
    };
    const mode = self2.mode;
    function getValPct(val, scale) {
      let _val = scale.distr == 3 ? log10(val > 0 ? val : scale.clamp(self2, val, scale.min, scale.max, scale.key)) : scale.distr == 4 ? asinh(val, scale.asinh) : val;
      return (_val - scale._min) / (scale._max - scale._min);
    }
    function getHPos(val, scale, dim, off2) {
      let pct = getValPct(val, scale);
      return off2 + dim * (scale.dir == -1 ? 1 - pct : pct);
    }
    function getVPos(val, scale, dim, off2) {
      let pct = getValPct(val, scale);
      return off2 + dim * (scale.dir == -1 ? pct : 1 - pct);
    }
    function getPos(val, scale, dim, off2) {
      return scale.ori == 0 ? getHPos(val, scale, dim, off2) : getVPos(val, scale, dim, off2);
    }
    self2.valToPosH = getHPos;
    self2.valToPosV = getVPos;
    let ready = false;
    self2.status = 0;
    const root = self2.root = placeDiv(UPLOT);
    if (opts2.id != null)
      root.id = opts2.id;
    addClass(root, opts2.class);
    if (opts2.title) {
      let title = placeDiv(TITLE, root);
      title.textContent = opts2.title;
    }
    const can = placeTag("canvas");
    const ctx = self2.ctx = can.getContext("2d");
    const wrap = placeDiv(WRAP, root);
    const under = self2.under = placeDiv(UNDER, wrap);
    wrap.appendChild(can);
    const over = self2.over = placeDiv(OVER, wrap);
    opts2 = copy(opts2);
    const pxAlign = +ifNull(opts2.pxAlign, 1);
    const pxRound = pxRoundGen(pxAlign);
    (opts2.plugins || []).forEach((p) => {
      if (p.opts)
        opts2 = p.opts(self2, opts2) || opts2;
    });
    const ms = opts2.ms || 1e-3;
    const series = self2.series = mode == 1 ? setDefaults(opts2.series || [], xSeriesOpts, ySeriesOpts, false) : setDefaults2(opts2.series || [null], xySeriesOpts);
    const axes = self2.axes = setDefaults(opts2.axes || [], xAxisOpts, yAxisOpts, true);
    const scales2 = self2.scales = {};
    const bands = self2.bands = opts2.bands || [];
    bands.forEach((b) => {
      b.fill = fnOrSelf(b.fill || null);
    });
    const xScaleKey = mode == 2 ? series[1].facets[0].scale : series[0].scale;
    const drawOrderMap = {
      axes: drawAxesGrid,
      series: drawSeries
    };
    const drawOrder = (opts2.drawOrder || ["axes", "series"]).map((key2) => drawOrderMap[key2]);
    function initScale(scaleKey) {
      let sc = scales2[scaleKey];
      if (sc == null) {
        let scaleOpts = (opts2.scales || EMPTY_OBJ)[scaleKey] || EMPTY_OBJ;
        if (scaleOpts.from != null) {
          initScale(scaleOpts.from);
          scales2[scaleKey] = assign({}, scales2[scaleOpts.from], scaleOpts, { key: scaleKey });
        } else {
          sc = scales2[scaleKey] = assign({}, scaleKey == xScaleKey ? xScaleOpts : yScaleOpts, scaleOpts);
          if (mode == 2)
            sc.time = false;
          sc.key = scaleKey;
          let isTime = sc.time;
          let rn = sc.range;
          let rangeIsArr = isArr(rn);
          if (scaleKey != xScaleKey || mode == 2) {
            if (rangeIsArr && (rn[0] == null || rn[1] == null)) {
              rn = {
                min: rn[0] == null ? autoRangePart : {
                  mode: 1,
                  hard: rn[0],
                  soft: rn[0]
                },
                max: rn[1] == null ? autoRangePart : {
                  mode: 1,
                  hard: rn[1],
                  soft: rn[1]
                }
              };
              rangeIsArr = false;
            }
            if (!rangeIsArr && isObj(rn)) {
              let cfg = rn;
              rn = (self3, dataMin, dataMax) => dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, cfg);
            }
          }
          sc.range = fnOrSelf(rn || (isTime ? snapTimeX : scaleKey == xScaleKey ? sc.distr == 3 ? snapLogX : sc.distr == 4 ? snapAsinhX : snapNumX : sc.distr == 3 ? snapLogY : sc.distr == 4 ? snapAsinhY : snapNumY));
          sc.auto = fnOrSelf(rangeIsArr ? false : sc.auto);
          sc.clamp = fnOrSelf(sc.clamp || clampScale);
          sc._min = sc._max = null;
        }
      }
    }
    initScale("x");
    initScale("y");
    if (mode == 1) {
      series.forEach((s) => {
        initScale(s.scale);
      });
    }
    axes.forEach((a) => {
      initScale(a.scale);
    });
    for (let k in opts2.scales)
      initScale(k);
    const scaleX = scales2[xScaleKey];
    const xScaleDistr = scaleX.distr;
    let valToPosX, valToPosY;
    if (scaleX.ori == 0) {
      addClass(root, ORI_HZ);
      valToPosX = getHPos;
      valToPosY = getVPos;
    } else {
      addClass(root, ORI_VT);
      valToPosX = getVPos;
      valToPosY = getHPos;
    }
    const pendScales = {};
    for (let k in scales2) {
      let sc = scales2[k];
      if (sc.min != null || sc.max != null) {
        pendScales[k] = { min: sc.min, max: sc.max };
        sc.min = sc.max = null;
      }
    }
    const _tzDate = opts2.tzDate || ((ts) => new Date(round(ts / ms)));
    const _fmtDate = opts2.fmtDate || fmtDate;
    const _timeAxisSplits = ms == 1 ? timeAxisSplitsMs(_tzDate) : timeAxisSplitsS(_tzDate);
    const _timeAxisVals = timeAxisVals(_tzDate, timeAxisStamps(ms == 1 ? _timeAxisStampsMs : _timeAxisStampsS, _fmtDate));
    const _timeSeriesVal = timeSeriesVal(_tzDate, timeSeriesStamp(_timeSeriesStamp, _fmtDate));
    const activeIdxs = [];
    const legend = self2.legend = assign({}, legendOpts, opts2.legend);
    const showLegend = legend.show;
    const markers = legend.markers;
    {
      legend.idxs = activeIdxs;
      markers.width = fnOrSelf(markers.width);
      markers.dash = fnOrSelf(markers.dash);
      markers.stroke = fnOrSelf(markers.stroke);
      markers.fill = fnOrSelf(markers.fill);
    }
    let legendEl;
    let legendRows = [];
    let legendCells = [];
    let legendCols;
    let multiValLegend = false;
    let NULL_LEGEND_VALUES = {};
    if (legend.live) {
      const getMultiVals = series[1] ? series[1].values : null;
      multiValLegend = getMultiVals != null;
      legendCols = multiValLegend ? getMultiVals(self2, 1, 0) : { _: 0 };
      for (let k in legendCols)
        NULL_LEGEND_VALUES[k] = "--";
    }
    if (showLegend) {
      legendEl = placeTag("table", LEGEND, root);
      if (multiValLegend) {
        let head = placeTag("tr", LEGEND_THEAD, legendEl);
        placeTag("th", null, head);
        for (var key in legendCols)
          placeTag("th", LEGEND_LABEL, head).textContent = key;
      } else {
        addClass(legendEl, LEGEND_INLINE);
        legend.live && addClass(legendEl, LEGEND_LIVE);
      }
    }
    const son = { show: true };
    const soff = { show: false };
    function initLegendRow(s, i) {
      if (i == 0 && (multiValLegend || !legend.live || mode == 2))
        return nullNullTuple;
      let cells = [];
      let row = placeTag("tr", LEGEND_SERIES, legendEl, legendEl.childNodes[i]);
      addClass(row, s.class);
      if (!s.show)
        addClass(row, OFF);
      let label = placeTag("th", null, row);
      if (markers.show) {
        let indic = placeDiv(LEGEND_MARKER, label);
        if (i > 0) {
          let width = markers.width(self2, i);
          if (width)
            indic.style.border = width + "px " + markers.dash(self2, i) + " " + markers.stroke(self2, i);
          indic.style.background = markers.fill(self2, i);
        }
      }
      let text = placeDiv(LEGEND_LABEL, label);
      text.textContent = s.label;
      if (i > 0) {
        if (!markers.show)
          text.style.color = s.width > 0 ? markers.stroke(self2, i) : markers.fill(self2, i);
        onMouse("click", label, (e) => {
          if (cursor._lock)
            return;
          let seriesIdx = series.indexOf(s);
          if ((e.ctrlKey || e.metaKey) != legend.isolate) {
            let isolate = series.some((s2, i2) => i2 > 0 && i2 != seriesIdx && s2.show);
            series.forEach((s2, i2) => {
              i2 > 0 && setSeries(i2, isolate ? i2 == seriesIdx ? son : soff : son, true, syncOpts.setSeries);
            });
          } else
            setSeries(seriesIdx, { show: !s.show }, true, syncOpts.setSeries);
        });
        if (cursorFocus) {
          onMouse(mouseenter, label, (e) => {
            if (cursor._lock)
              return;
            setSeries(series.indexOf(s), FOCUS_TRUE, true, syncOpts.setSeries);
          });
        }
      }
      for (var key2 in legendCols) {
        let v = placeTag("td", LEGEND_VALUE, row);
        v.textContent = "--";
        cells.push(v);
      }
      return [row, cells];
    }
    const mouseListeners = /* @__PURE__ */ new Map();
    function onMouse(ev, targ, fn) {
      const targListeners = mouseListeners.get(targ) || {};
      const listener = cursor.bind[ev](self2, targ, fn);
      if (listener) {
        on(ev, targ, targListeners[ev] = listener);
        mouseListeners.set(targ, targListeners);
      }
    }
    function offMouse(ev, targ, fn) {
      const targListeners = mouseListeners.get(targ) || {};
      for (let k in targListeners) {
        if (ev == null || k == ev) {
          off(k, targ, targListeners[k]);
          delete targListeners[k];
        }
      }
      if (ev == null)
        mouseListeners.delete(targ);
    }
    let fullWidCss = 0;
    let fullHgtCss = 0;
    let plotWidCss = 0;
    let plotHgtCss = 0;
    let plotLftCss = 0;
    let plotTopCss = 0;
    let plotLft = 0;
    let plotTop = 0;
    let plotWid = 0;
    let plotHgt = 0;
    self2.bbox = {};
    let shouldSetScales = false;
    let shouldSetSize = false;
    let shouldConvergeSize = false;
    let shouldSetCursor = false;
    let shouldSetLegend = false;
    function _setSize(width, height, force) {
      if (force || (width != self2.width || height != self2.height))
        calcSize(width, height);
      resetYSeries(false);
      shouldConvergeSize = true;
      shouldSetSize = true;
      shouldSetCursor = shouldSetLegend = cursor.left >= 0;
      commit();
    }
    function calcSize(width, height) {
      self2.width = fullWidCss = plotWidCss = width;
      self2.height = fullHgtCss = plotHgtCss = height;
      plotLftCss = plotTopCss = 0;
      calcPlotRect();
      calcAxesRects();
      let bb = self2.bbox;
      plotLft = bb.left = incrRound(plotLftCss * pxRatio, 0.5);
      plotTop = bb.top = incrRound(plotTopCss * pxRatio, 0.5);
      plotWid = bb.width = incrRound(plotWidCss * pxRatio, 0.5);
      plotHgt = bb.height = incrRound(plotHgtCss * pxRatio, 0.5);
    }
    const CYCLE_LIMIT = 3;
    function convergeSize() {
      let converged = false;
      let cycleNum = 0;
      while (!converged) {
        cycleNum++;
        let axesConverged = axesCalc(cycleNum);
        let paddingConverged = paddingCalc(cycleNum);
        converged = cycleNum == CYCLE_LIMIT || axesConverged && paddingConverged;
        if (!converged) {
          calcSize(self2.width, self2.height);
          shouldSetSize = true;
        }
      }
    }
    function setSize({ width, height }) {
      _setSize(width, height);
    }
    self2.setSize = setSize;
    function calcPlotRect() {
      let hasTopAxis = false;
      let hasBtmAxis = false;
      let hasRgtAxis = false;
      let hasLftAxis = false;
      axes.forEach((axis, i) => {
        if (axis.show && axis._show) {
          let { side, _size } = axis;
          let isVt = side % 2;
          let labelSize = axis.label != null ? axis.labelSize : 0;
          let fullSize = _size + labelSize;
          if (fullSize > 0) {
            if (isVt) {
              plotWidCss -= fullSize;
              if (side == 3) {
                plotLftCss += fullSize;
                hasLftAxis = true;
              } else
                hasRgtAxis = true;
            } else {
              plotHgtCss -= fullSize;
              if (side == 0) {
                plotTopCss += fullSize;
                hasTopAxis = true;
              } else
                hasBtmAxis = true;
            }
          }
        }
      });
      sidesWithAxes[0] = hasTopAxis;
      sidesWithAxes[1] = hasRgtAxis;
      sidesWithAxes[2] = hasBtmAxis;
      sidesWithAxes[3] = hasLftAxis;
      plotWidCss -= _padding[1] + _padding[3];
      plotLftCss += _padding[3];
      plotHgtCss -= _padding[2] + _padding[0];
      plotTopCss += _padding[0];
    }
    function calcAxesRects() {
      let off1 = plotLftCss + plotWidCss;
      let off2 = plotTopCss + plotHgtCss;
      let off3 = plotLftCss;
      let off0 = plotTopCss;
      function incrOffset(side, size) {
        switch (side) {
          case 1:
            off1 += size;
            return off1 - size;
          case 2:
            off2 += size;
            return off2 - size;
          case 3:
            off3 -= size;
            return off3 + size;
          case 0:
            off0 -= size;
            return off0 + size;
        }
      }
      axes.forEach((axis, i) => {
        if (axis.show && axis._show) {
          let side = axis.side;
          axis._pos = incrOffset(side, axis._size);
          if (axis.label != null)
            axis._lpos = incrOffset(side, axis.labelSize);
        }
      });
    }
    const cursor = self2.cursor = assign({}, cursorOpts, { drag: { y: mode == 2 } }, opts2.cursor);
    {
      cursor.idxs = activeIdxs;
      cursor._lock = false;
      let points2 = cursor.points;
      points2.show = fnOrSelf(points2.show);
      points2.size = fnOrSelf(points2.size);
      points2.stroke = fnOrSelf(points2.stroke);
      points2.width = fnOrSelf(points2.width);
      points2.fill = fnOrSelf(points2.fill);
    }
    const focus = self2.focus = assign({}, opts2.focus || { alpha: 0.3 }, cursor.focus);
    const cursorFocus = focus.prox >= 0;
    let cursorPts = [null];
    function initCursorPt(s, si) {
      if (si > 0) {
        let pt = cursor.points.show(self2, si);
        if (pt) {
          addClass(pt, CURSOR_PT);
          addClass(pt, s.class);
          elTrans(pt, -10, -10, plotWidCss, plotHgtCss);
          over.insertBefore(pt, cursorPts[si]);
          return pt;
        }
      }
    }
    function initSeries(s, i) {
      if (mode == 1 || i > 0) {
        let isTime = mode == 1 && scales2[s.scale].time;
        let sv = s.value;
        s.value = isTime ? isStr(sv) ? timeSeriesVal(_tzDate, timeSeriesStamp(sv, _fmtDate)) : sv || _timeSeriesVal : sv || numSeriesVal;
        s.label = s.label || (isTime ? timeSeriesLabel : numSeriesLabel);
      }
      if (i > 0) {
        s.width = s.width == null ? 1 : s.width;
        s.paths = s.paths || linearPath || retNull;
        s.fillTo = fnOrSelf(s.fillTo || seriesFillTo);
        s.pxAlign = +ifNull(s.pxAlign, pxAlign);
        s.pxRound = pxRoundGen(s.pxAlign);
        s.stroke = fnOrSelf(s.stroke || null);
        s.fill = fnOrSelf(s.fill || null);
        s._stroke = s._fill = s._paths = s._focus = null;
        let _ptDia = ptDia(s.width, 1);
        let points2 = s.points = assign({}, {
          size: _ptDia,
          width: max(1, _ptDia * 0.2),
          stroke: s.stroke,
          space: _ptDia * 2,
          paths: pointsPath,
          _stroke: null,
          _fill: null
        }, s.points);
        points2.show = fnOrSelf(points2.show);
        points2.filter = fnOrSelf(points2.filter);
        points2.fill = fnOrSelf(points2.fill);
        points2.stroke = fnOrSelf(points2.stroke);
        points2.paths = fnOrSelf(points2.paths);
        points2.pxAlign = s.pxAlign;
      }
      if (showLegend) {
        let rowCells = initLegendRow(s, i);
        legendRows.splice(i, 0, rowCells[0]);
        legendCells.splice(i, 0, rowCells[1]);
        legend.values.push(null);
      }
      if (cursor.show) {
        activeIdxs.splice(i, 0, null);
        let pt = initCursorPt(s, i);
        pt && cursorPts.splice(i, 0, pt);
      }
    }
    function addSeries(opts3, si) {
      si = si == null ? series.length : si;
      opts3 = setDefault(opts3, si, xSeriesOpts, ySeriesOpts);
      series.splice(si, 0, opts3);
      initSeries(series[si], si);
    }
    self2.addSeries = addSeries;
    function delSeries(i) {
      series.splice(i, 1);
      if (showLegend) {
        legend.values.splice(i, 1);
        legendCells.splice(i, 1);
        let tr = legendRows.splice(i, 1)[0];
        offMouse(null, tr.firstChild);
        tr.remove();
      }
      if (cursor.show) {
        activeIdxs.splice(i, 1);
        cursorPts.length > 1 && cursorPts.splice(i, 1)[0].remove();
      }
    }
    self2.delSeries = delSeries;
    const sidesWithAxes = [false, false, false, false];
    function initAxis(axis, i) {
      axis._show = axis.show;
      if (axis.show) {
        let isVt = axis.side % 2;
        let sc = scales2[axis.scale];
        if (sc == null) {
          axis.scale = isVt ? series[1].scale : xScaleKey;
          sc = scales2[axis.scale];
        }
        let isTime = sc.time;
        axis.size = fnOrSelf(axis.size);
        axis.space = fnOrSelf(axis.space);
        axis.rotate = fnOrSelf(axis.rotate);
        axis.incrs = fnOrSelf(axis.incrs || (sc.distr == 2 ? wholeIncrs : isTime ? ms == 1 ? timeIncrsMs : timeIncrsS : numIncrs));
        axis.splits = fnOrSelf(axis.splits || (isTime && sc.distr == 1 ? _timeAxisSplits : sc.distr == 3 ? logAxisSplits : sc.distr == 4 ? asinhAxisSplits : numAxisSplits));
        axis.stroke = fnOrSelf(axis.stroke);
        axis.grid.stroke = fnOrSelf(axis.grid.stroke);
        axis.ticks.stroke = fnOrSelf(axis.ticks.stroke);
        let av = axis.values;
        axis.values = isArr(av) && !isArr(av[0]) ? fnOrSelf(av) : isTime ? isArr(av) ? timeAxisVals(_tzDate, timeAxisStamps(av, _fmtDate)) : isStr(av) ? timeAxisVal(_tzDate, av) : av || _timeAxisVals : av || numAxisVals;
        axis.filter = fnOrSelf(axis.filter || (sc.distr >= 3 ? logAxisValsFilt : retArg1));
        axis.font = pxRatioFont(axis.font);
        axis.labelFont = pxRatioFont(axis.labelFont);
        axis._size = axis.size(self2, null, i, 0);
        axis._space = axis._rotate = axis._incrs = axis._found = axis._splits = axis._values = null;
        if (axis._size > 0)
          sidesWithAxes[i] = true;
        axis._el = placeDiv(AXIS, wrap);
      }
    }
    function autoPadSide(self3, side, sidesWithAxes2, cycleNum) {
      let [hasTopAxis, hasRgtAxis, hasBtmAxis, hasLftAxis] = sidesWithAxes2;
      let ori = side % 2;
      let size = 0;
      if (ori == 0 && (hasLftAxis || hasRgtAxis))
        size = side == 0 && !hasTopAxis || side == 2 && !hasBtmAxis ? round(xAxisOpts.size / 3) : 0;
      if (ori == 1 && (hasTopAxis || hasBtmAxis))
        size = side == 1 && !hasRgtAxis || side == 3 && !hasLftAxis ? round(yAxisOpts.size / 2) : 0;
      return size;
    }
    const padding = self2.padding = (opts2.padding || [autoPadSide, autoPadSide, autoPadSide, autoPadSide]).map((p) => fnOrSelf(ifNull(p, autoPadSide)));
    const _padding = self2._padding = padding.map((p, i) => p(self2, i, sidesWithAxes, 0));
    let dataLen;
    let i0 = null;
    let i1 = null;
    const idxs = mode == 1 ? series[0].idxs : null;
    let data0 = null;
    let viaAutoScaleX = false;
    function setData(_data, _resetScales) {
      if (mode == 2) {
        dataLen = 0;
        for (let i = 1; i < series.length; i++)
          dataLen += data2[i][0].length;
        self2.data = data2 = _data;
      } else {
        data2 = (_data || []).slice();
        data2[0] = data2[0] || [];
        self2.data = data2.slice();
        data0 = data2[0];
        dataLen = data0.length;
        if (xScaleDistr == 2)
          data2[0] = data0.map((v, i) => i);
      }
      self2._data = data2;
      resetYSeries(true);
      fire("setData");
      if (_resetScales !== false) {
        let xsc = scaleX;
        if (xsc.auto(self2, viaAutoScaleX))
          autoScaleX();
        else
          _setScale(xScaleKey, xsc.min, xsc.max);
        shouldSetCursor = cursor.left >= 0;
        shouldSetLegend = true;
        commit();
      }
    }
    self2.setData = setData;
    function autoScaleX() {
      viaAutoScaleX = true;
      let _min, _max;
      if (mode == 1) {
        if (dataLen > 0) {
          i0 = idxs[0] = 0;
          i1 = idxs[1] = dataLen - 1;
          _min = data2[0][i0];
          _max = data2[0][i1];
          if (xScaleDistr == 2) {
            _min = i0;
            _max = i1;
          } else if (dataLen == 1) {
            if (xScaleDistr == 3)
              [_min, _max] = rangeLog(_min, _min, scaleX.log, false);
            else if (xScaleDistr == 4)
              [_min, _max] = rangeAsinh(_min, _min, scaleX.log, false);
            else if (scaleX.time)
              _max = _min + round(86400 / ms);
            else
              [_min, _max] = rangeNum(_min, _max, rangePad, true);
          }
        } else {
          i0 = idxs[0] = _min = null;
          i1 = idxs[1] = _max = null;
        }
      }
      _setScale(xScaleKey, _min, _max);
    }
    let ctxStroke, ctxFill, ctxWidth, ctxDash, ctxJoin, ctxCap, ctxFont, ctxAlign, ctxBaseline;
    let ctxAlpha;
    function setCtxStyle(stroke = transparent, width, dash = EMPTY_ARR, cap = "butt", fill = transparent, join2 = "round") {
      if (stroke != ctxStroke)
        ctx.strokeStyle = ctxStroke = stroke;
      if (fill != ctxFill)
        ctx.fillStyle = ctxFill = fill;
      if (width != ctxWidth)
        ctx.lineWidth = ctxWidth = width;
      if (join2 != ctxJoin)
        ctx.lineJoin = ctxJoin = join2;
      if (cap != ctxCap)
        ctx.lineCap = ctxCap = cap;
      if (dash != ctxDash)
        ctx.setLineDash(ctxDash = dash);
    }
    function setFontStyle(font2, fill, align, baseline) {
      if (fill != ctxFill)
        ctx.fillStyle = ctxFill = fill;
      if (font2 != ctxFont)
        ctx.font = ctxFont = font2;
      if (align != ctxAlign)
        ctx.textAlign = ctxAlign = align;
      if (baseline != ctxBaseline)
        ctx.textBaseline = ctxBaseline = baseline;
    }
    function accScale(wsc, psc, facet2, data3) {
      if (wsc.auto(self2, viaAutoScaleX) && (psc == null || psc.min == null)) {
        let _i0 = ifNull(i0, 0);
        let _i1 = ifNull(i1, data3.length - 1);
        let minMax = facet2.min == null ? wsc.distr == 3 ? getMinMaxLog(data3, _i0, _i1) : getMinMax(data3, _i0, _i1) : [facet2.min, facet2.max];
        wsc.min = min(wsc.min, facet2.min = minMax[0]);
        wsc.max = max(wsc.max, facet2.max = minMax[1]);
      }
    }
    function setScales() {
      let wipScales = copy(scales2, fastIsObj);
      for (let k in wipScales) {
        let wsc = wipScales[k];
        let psc = pendScales[k];
        if (psc != null && psc.min != null) {
          assign(wsc, psc);
          if (k == xScaleKey)
            resetYSeries(true);
        } else if (k != xScaleKey || mode == 2) {
          if (dataLen == 0 && wsc.from == null) {
            let minMax = wsc.range(self2, null, null, k);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
          } else {
            wsc.min = inf;
            wsc.max = -inf;
          }
        }
      }
      if (dataLen > 0) {
        series.forEach((s, i) => {
          if (mode == 1) {
            let k = s.scale;
            let wsc = wipScales[k];
            let psc = pendScales[k];
            if (i == 0) {
              let minMax = wsc.range(self2, wsc.min, wsc.max, k);
              wsc.min = minMax[0];
              wsc.max = minMax[1];
              i0 = closestIdx(wsc.min, data2[0]);
              i1 = closestIdx(wsc.max, data2[0]);
              if (data2[0][i0] < wsc.min)
                i0++;
              if (data2[0][i1] > wsc.max)
                i1--;
              s.min = data0[i0];
              s.max = data0[i1];
            } else if (s.show && s.auto)
              accScale(wsc, psc, s, data2[i]);
            s.idxs[0] = i0;
            s.idxs[1] = i1;
          } else {
            if (i > 0) {
              if (s.show && s.auto) {
                let [xFacet, yFacet] = s.facets;
                let xScaleKey2 = xFacet.scale;
                let yScaleKey = yFacet.scale;
                let [xData, yData] = data2[i];
                accScale(wipScales[xScaleKey2], pendScales[xScaleKey2], xFacet, xData);
                accScale(wipScales[yScaleKey], pendScales[yScaleKey], yFacet, yData);
                s.min = yFacet.min;
                s.max = yFacet.max;
              }
            }
          }
        });
        for (let k in wipScales) {
          let wsc = wipScales[k];
          let psc = pendScales[k];
          if (wsc.from == null && (psc == null || psc.min == null)) {
            let minMax = wsc.range(self2, wsc.min == inf ? null : wsc.min, wsc.max == -inf ? null : wsc.max, k);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
          }
        }
      }
      for (let k in wipScales) {
        let wsc = wipScales[k];
        if (wsc.from != null) {
          let base = wipScales[wsc.from];
          if (base.min == null)
            wsc.min = wsc.max = null;
          else {
            let minMax = wsc.range(self2, base.min, base.max, k);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
          }
        }
      }
      let changed = {};
      let anyChanged = false;
      for (let k in wipScales) {
        let wsc = wipScales[k];
        let sc = scales2[k];
        if (sc.min != wsc.min || sc.max != wsc.max) {
          sc.min = wsc.min;
          sc.max = wsc.max;
          let distr = sc.distr;
          sc._min = distr == 3 ? log10(sc.min) : distr == 4 ? asinh(sc.min, sc.asinh) : sc.min;
          sc._max = distr == 3 ? log10(sc.max) : distr == 4 ? asinh(sc.max, sc.asinh) : sc.max;
          changed[k] = anyChanged = true;
        }
      }
      if (anyChanged) {
        series.forEach((s, i) => {
          if (mode == 2) {
            if (i > 0 && changed.y)
              s._paths = null;
          } else {
            if (changed[s.scale])
              s._paths = null;
          }
        });
        for (let k in changed) {
          shouldConvergeSize = true;
          fire("setScale", k);
        }
        if (cursor.show)
          shouldSetCursor = shouldSetLegend = cursor.left >= 0;
      }
      for (let k in pendScales)
        pendScales[k] = null;
    }
    function getOuterIdxs(ydata) {
      let _i0 = clamp(i0 - 1, 0, dataLen - 1);
      let _i1 = clamp(i1 + 1, 0, dataLen - 1);
      while (ydata[_i0] == null && _i0 > 0)
        _i0--;
      while (ydata[_i1] == null && _i1 < dataLen - 1)
        _i1++;
      return [_i0, _i1];
    }
    function drawSeries() {
      if (dataLen > 0) {
        series.forEach((s, i) => {
          if (i > 0 && s.show && s._paths == null) {
            let _idxs = getOuterIdxs(data2[i]);
            s._paths = s.paths(self2, i, _idxs[0], _idxs[1]);
          }
        });
        series.forEach((s, i) => {
          if (i > 0 && s.show) {
            if (ctxAlpha != s.alpha)
              ctx.globalAlpha = ctxAlpha = s.alpha;
            {
              cacheStrokeFill(i, false);
              s._paths && drawPath(i, false);
            }
            {
              cacheStrokeFill(i, true);
              let show = s.points.show(self2, i, i0, i1);
              let idxs2 = s.points.filter(self2, i, show, s._paths ? s._paths.gaps : null);
              if (show || idxs2) {
                s.points._paths = s.points.paths(self2, i, i0, i1, idxs2);
                drawPath(i, true);
              }
            }
            if (ctxAlpha != 1)
              ctx.globalAlpha = ctxAlpha = 1;
            fire("drawSeries", i);
          }
        });
      }
    }
    function cacheStrokeFill(si, _points) {
      let s = _points ? series[si].points : series[si];
      s._stroke = s.stroke(self2, si);
      s._fill = s.fill(self2, si);
    }
    function drawPath(si, _points) {
      let s = _points ? series[si].points : series[si];
      let strokeStyle = s._stroke;
      let fillStyle = s._fill;
      let { stroke, fill, clip: gapsClip, flags } = s._paths;
      let boundsClip = null;
      let width = roundDec(s.width * pxRatio, 3);
      let offset = width % 2 / 2;
      if (_points && fillStyle == null)
        fillStyle = width > 0 ? "#fff" : strokeStyle;
      let _pxAlign = s.pxAlign == 1;
      _pxAlign && ctx.translate(offset, offset);
      if (!_points) {
        let lft = plotLft, top = plotTop, wid = plotWid, hgt = plotHgt;
        let halfWid = width * pxRatio / 2;
        if (s.min == 0)
          hgt += halfWid;
        if (s.max == 0) {
          top -= halfWid;
          hgt += halfWid;
        }
        boundsClip = new Path2D();
        boundsClip.rect(lft, top, wid, hgt);
      }
      if (_points)
        strokeFill(strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, gapsClip);
      else
        fillStroke(si, strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, boundsClip, gapsClip);
      _pxAlign && ctx.translate(-offset, -offset);
    }
    function fillStroke(si, strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip) {
      let didStrokeFill = false;
      bands.forEach((b, bi) => {
        if (b.series[0] == si) {
          let lowerEdge = series[b.series[1]];
          let lowerData = data2[b.series[1]];
          let bandClip = (lowerEdge._paths || EMPTY_OBJ).band;
          let gapsClip2;
          let _fillStyle = null;
          if (lowerEdge.show && bandClip && hasData(lowerData, i0, i1)) {
            _fillStyle = b.fill(self2, bi) || fillStyle;
            gapsClip2 = lowerEdge._paths.clip;
          } else
            bandClip = null;
          strokeFill(strokeStyle, lineWidth, lineDash, lineCap, _fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip);
          didStrokeFill = true;
        }
      });
      if (!didStrokeFill)
        strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip);
    }
    const CLIP_FILL_STROKE = BAND_CLIP_FILL | BAND_CLIP_STROKE;
    function strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip) {
      setCtxStyle(strokeStyle, lineWidth, lineDash, lineCap, fillStyle);
      if (boundsClip || gapsClip || bandClip) {
        ctx.save();
        boundsClip && ctx.clip(boundsClip);
        gapsClip && ctx.clip(gapsClip);
      }
      if (bandClip) {
        if ((flags & CLIP_FILL_STROKE) == CLIP_FILL_STROKE) {
          ctx.clip(bandClip);
          gapsClip2 && ctx.clip(gapsClip2);
          doFill(fillStyle, fillPath);
          doStroke(strokeStyle, strokePath, lineWidth);
        } else if (flags & BAND_CLIP_STROKE) {
          doFill(fillStyle, fillPath);
          ctx.clip(bandClip);
          doStroke(strokeStyle, strokePath, lineWidth);
        } else if (flags & BAND_CLIP_FILL) {
          ctx.save();
          ctx.clip(bandClip);
          gapsClip2 && ctx.clip(gapsClip2);
          doFill(fillStyle, fillPath);
          ctx.restore();
          doStroke(strokeStyle, strokePath, lineWidth);
        }
      } else {
        doFill(fillStyle, fillPath);
        doStroke(strokeStyle, strokePath, lineWidth);
      }
      if (boundsClip || gapsClip || bandClip)
        ctx.restore();
    }
    function doStroke(strokeStyle, strokePath, lineWidth) {
      if (lineWidth > 0) {
        if (strokePath instanceof Map) {
          strokePath.forEach((strokePath2, strokeStyle2) => {
            ctx.strokeStyle = ctxStroke = strokeStyle2;
            ctx.stroke(strokePath2);
          });
        } else
          strokePath != null && strokeStyle && ctx.stroke(strokePath);
      }
    }
    function doFill(fillStyle, fillPath) {
      if (fillPath instanceof Map) {
        fillPath.forEach((fillPath2, fillStyle2) => {
          ctx.fillStyle = ctxFill = fillStyle2;
          ctx.fill(fillPath2);
        });
      } else
        fillPath != null && fillStyle && ctx.fill(fillPath);
    }
    function getIncrSpace(axisIdx, min2, max2, fullDim) {
      let axis = axes[axisIdx];
      let incrSpace;
      if (fullDim <= 0)
        incrSpace = [0, 0];
      else {
        let minSpace = axis._space = axis.space(self2, axisIdx, min2, max2, fullDim);
        let incrs = axis._incrs = axis.incrs(self2, axisIdx, min2, max2, fullDim, minSpace);
        incrSpace = findIncr(min2, max2, incrs, fullDim, minSpace);
      }
      return axis._found = incrSpace;
    }
    function drawOrthoLines(offs, filts, ori, side, pos0, len, width, stroke, dash, cap) {
      let offset = width % 2 / 2;
      pxAlign == 1 && ctx.translate(offset, offset);
      setCtxStyle(stroke, width, dash, cap, stroke);
      ctx.beginPath();
      let x0, y0, x1, y1, pos1 = pos0 + (side == 0 || side == 3 ? -len : len);
      if (ori == 0) {
        y0 = pos0;
        y1 = pos1;
      } else {
        x0 = pos0;
        x1 = pos1;
      }
      for (let i = 0; i < offs.length; i++) {
        if (filts[i] != null) {
          if (ori == 0)
            x0 = x1 = offs[i];
          else
            y0 = y1 = offs[i];
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
        }
      }
      ctx.stroke();
      pxAlign == 1 && ctx.translate(-offset, -offset);
    }
    function axesCalc(cycleNum) {
      let converged = true;
      axes.forEach((axis, i) => {
        if (!axis.show)
          return;
        let scale = scales2[axis.scale];
        if (scale.min == null) {
          if (axis._show) {
            converged = false;
            axis._show = false;
            resetYSeries(false);
          }
          return;
        } else {
          if (!axis._show) {
            converged = false;
            axis._show = true;
            resetYSeries(false);
          }
        }
        let side = axis.side;
        let ori = side % 2;
        let { min: min2, max: max2 } = scale;
        let [_incr, _space] = getIncrSpace(i, min2, max2, ori == 0 ? plotWidCss : plotHgtCss);
        if (_space == 0)
          return;
        let forceMin = scale.distr == 2;
        let _splits = axis._splits = axis.splits(self2, i, min2, max2, _incr, _space, forceMin);
        let splits = scale.distr == 2 ? _splits.map((i2) => data0[i2]) : _splits;
        let incr = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;
        let values = axis._values = axis.values(self2, axis.filter(self2, splits, i, _space, incr), i, _space, incr);
        axis._rotate = side == 2 ? axis.rotate(self2, values, i, _space) : 0;
        let oldSize = axis._size;
        axis._size = ceil(axis.size(self2, values, i, cycleNum));
        if (oldSize != null && axis._size != oldSize)
          converged = false;
      });
      return converged;
    }
    function paddingCalc(cycleNum) {
      let converged = true;
      padding.forEach((p, i) => {
        let _p = p(self2, i, sidesWithAxes, cycleNum);
        if (_p != _padding[i])
          converged = false;
        _padding[i] = _p;
      });
      return converged;
    }
    function drawAxesGrid() {
      for (let i = 0; i < axes.length; i++) {
        let axis = axes[i];
        if (!axis.show || !axis._show)
          continue;
        let side = axis.side;
        let ori = side % 2;
        let x, y;
        let fillStyle = axis.stroke(self2, i);
        let shiftDir = side == 0 || side == 3 ? -1 : 1;
        if (axis.label) {
          let shiftAmt2 = axis.labelGap * shiftDir;
          let baseLpos = round((axis._lpos + shiftAmt2) * pxRatio);
          setFontStyle(axis.labelFont[0], fillStyle, "center", side == 2 ? TOP : BOTTOM);
          ctx.save();
          if (ori == 1) {
            x = y = 0;
            ctx.translate(baseLpos, round(plotTop + plotHgt / 2));
            ctx.rotate((side == 3 ? -PI : PI) / 2);
          } else {
            x = round(plotLft + plotWid / 2);
            y = baseLpos;
          }
          ctx.fillText(axis.label, x, y);
          ctx.restore();
        }
        let [_incr, _space] = axis._found;
        if (_space == 0)
          continue;
        let scale = scales2[axis.scale];
        let plotDim = ori == 0 ? plotWid : plotHgt;
        let plotOff = ori == 0 ? plotLft : plotTop;
        let axisGap = round(axis.gap * pxRatio);
        let _splits = axis._splits;
        let splits = scale.distr == 2 ? _splits.map((i2) => data0[i2]) : _splits;
        let incr = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;
        let ticks2 = axis.ticks;
        let tickSize = ticks2.show ? round(ticks2.size * pxRatio) : 0;
        let angle = axis._rotate * -PI / 180;
        let basePos = pxRound(axis._pos * pxRatio);
        let shiftAmt = (tickSize + axisGap) * shiftDir;
        let finalPos = basePos + shiftAmt;
        y = ori == 0 ? finalPos : 0;
        x = ori == 1 ? finalPos : 0;
        let font2 = axis.font[0];
        let textAlign = axis.align == 1 ? LEFT : axis.align == 2 ? RIGHT : angle > 0 ? LEFT : angle < 0 ? RIGHT : ori == 0 ? "center" : side == 3 ? RIGHT : LEFT;
        let textBaseline = angle || ori == 1 ? "middle" : side == 2 ? TOP : BOTTOM;
        setFontStyle(font2, fillStyle, textAlign, textBaseline);
        let lineHeight = axis.font[1] * lineMult;
        let canOffs = _splits.map((val) => pxRound(getPos(val, scale, plotDim, plotOff)));
        let _values = axis._values;
        for (let i2 = 0; i2 < _values.length; i2++) {
          let val = _values[i2];
          if (val != null) {
            if (ori == 0)
              x = canOffs[i2];
            else
              y = canOffs[i2];
            val = "" + val;
            let _parts = val.indexOf("\n") == -1 ? [val] : val.split(/\n/gm);
            for (let j = 0; j < _parts.length; j++) {
              let text = _parts[j];
              if (angle) {
                ctx.save();
                ctx.translate(x, y + j * lineHeight);
                ctx.rotate(angle);
                ctx.fillText(text, 0, 0);
                ctx.restore();
              } else
                ctx.fillText(text, x, y + j * lineHeight);
            }
          }
        }
        if (ticks2.show) {
          drawOrthoLines(canOffs, ticks2.filter(self2, splits, i, _space, incr), ori, side, basePos, tickSize, roundDec(ticks2.width * pxRatio, 3), ticks2.stroke(self2, i), ticks2.dash, ticks2.cap);
        }
        let grid2 = axis.grid;
        if (grid2.show) {
          drawOrthoLines(canOffs, grid2.filter(self2, splits, i, _space, incr), ori, ori == 0 ? 2 : 1, ori == 0 ? plotTop : plotLft, ori == 0 ? plotHgt : plotWid, roundDec(grid2.width * pxRatio, 3), grid2.stroke(self2, i), grid2.dash, grid2.cap);
        }
      }
      fire("drawAxes");
    }
    function resetYSeries(minMax) {
      series.forEach((s, i) => {
        if (i > 0) {
          s._paths = null;
          if (minMax) {
            if (mode == 1) {
              s.min = null;
              s.max = null;
            } else {
              s.facets.forEach((f) => {
                f.min = null;
                f.max = null;
              });
            }
          }
        }
      });
    }
    let queuedCommit = false;
    function commit() {
      if (!queuedCommit) {
        microTask(_commit);
        queuedCommit = true;
      }
    }
    function _commit() {
      if (shouldSetScales) {
        setScales();
        shouldSetScales = false;
      }
      if (shouldConvergeSize) {
        convergeSize();
        shouldConvergeSize = false;
      }
      if (shouldSetSize) {
        setStylePx(under, LEFT, plotLftCss);
        setStylePx(under, TOP, plotTopCss);
        setStylePx(under, WIDTH, plotWidCss);
        setStylePx(under, HEIGHT, plotHgtCss);
        setStylePx(over, LEFT, plotLftCss);
        setStylePx(over, TOP, plotTopCss);
        setStylePx(over, WIDTH, plotWidCss);
        setStylePx(over, HEIGHT, plotHgtCss);
        setStylePx(wrap, WIDTH, fullWidCss);
        setStylePx(wrap, HEIGHT, fullHgtCss);
        can.width = round(fullWidCss * pxRatio);
        can.height = round(fullHgtCss * pxRatio);
        axes.forEach((a) => {
          let { _show, _el, _size, _pos, side } = a;
          if (_show) {
            let posOffset = side === 3 || side === 0 ? _size : 0;
            let isVt = side % 2 == 1;
            setStylePx(_el, isVt ? "left" : "top", _pos - posOffset);
            setStylePx(_el, isVt ? "width" : "height", _size);
            setStylePx(_el, isVt ? "top" : "left", isVt ? plotTopCss : plotLftCss);
            setStylePx(_el, isVt ? "height" : "width", isVt ? plotHgtCss : plotWidCss);
            _el && remClass(_el, OFF);
          } else
            _el && addClass(_el, OFF);
        });
        ctxStroke = ctxFill = ctxWidth = ctxJoin = ctxCap = ctxFont = ctxAlign = ctxBaseline = ctxDash = null;
        ctxAlpha = 1;
        syncRect(false);
        fire("setSize");
        shouldSetSize = false;
      }
      if (fullWidCss > 0 && fullHgtCss > 0) {
        ctx.clearRect(0, 0, can.width, can.height);
        fire("drawClear");
        drawOrder.forEach((fn) => fn());
        fire("draw");
      }
      if (cursor.show && shouldSetCursor) {
        updateCursor(null, true, false);
        shouldSetCursor = false;
      }
      if (!ready) {
        ready = true;
        self2.status = 1;
        fire("ready");
      }
      viaAutoScaleX = false;
      queuedCommit = false;
    }
    self2.redraw = (rebuildPaths, recalcAxes) => {
      shouldConvergeSize = recalcAxes || false;
      if (rebuildPaths !== false)
        _setScale(xScaleKey, scaleX.min, scaleX.max);
      else
        commit();
    };
    function setScale(key2, opts3) {
      let sc = scales2[key2];
      if (sc.from == null) {
        if (dataLen == 0) {
          let minMax = sc.range(self2, opts3.min, opts3.max, key2);
          opts3.min = minMax[0];
          opts3.max = minMax[1];
        }
        if (opts3.min > opts3.max) {
          let _min = opts3.min;
          opts3.min = opts3.max;
          opts3.max = _min;
        }
        if (dataLen > 1 && opts3.min != null && opts3.max != null && opts3.max - opts3.min < 1e-16)
          return;
        if (key2 == xScaleKey) {
          if (sc.distr == 2 && dataLen > 0) {
            opts3.min = closestIdx(opts3.min, data2[0]);
            opts3.max = closestIdx(opts3.max, data2[0]);
          }
        }
        pendScales[key2] = opts3;
        shouldSetScales = true;
        commit();
      }
    }
    self2.setScale = setScale;
    let xCursor;
    let yCursor;
    let vCursor;
    let hCursor;
    let rawMouseLeft0;
    let rawMouseTop0;
    let mouseLeft0;
    let mouseTop0;
    let rawMouseLeft1;
    let rawMouseTop1;
    let mouseLeft1;
    let mouseTop1;
    let dragging = false;
    const drag = cursor.drag;
    let dragX = drag.x;
    let dragY = drag.y;
    if (cursor.show) {
      if (cursor.x)
        xCursor = placeDiv(CURSOR_X, over);
      if (cursor.y)
        yCursor = placeDiv(CURSOR_Y, over);
      if (scaleX.ori == 0) {
        vCursor = xCursor;
        hCursor = yCursor;
      } else {
        vCursor = yCursor;
        hCursor = xCursor;
      }
      mouseLeft1 = cursor.left;
      mouseTop1 = cursor.top;
    }
    const select = self2.select = assign({
      show: true,
      over: true,
      left: 0,
      width: 0,
      top: 0,
      height: 0
    }, opts2.select);
    const selectDiv = select.show ? placeDiv(SELECT, select.over ? over : under) : null;
    function setSelect(opts3, _fire) {
      if (select.show) {
        for (let prop in opts3)
          setStylePx(selectDiv, prop, select[prop] = opts3[prop]);
        _fire !== false && fire("setSelect");
      }
    }
    self2.setSelect = setSelect;
    function toggleDOM(i, onOff) {
      let s = series[i];
      let label = showLegend ? legendRows[i] : null;
      if (s.show)
        label && remClass(label, OFF);
      else {
        label && addClass(label, OFF);
        cursorPts.length > 1 && elTrans(cursorPts[i], -10, -10, plotWidCss, plotHgtCss);
      }
    }
    function _setScale(key2, min2, max2) {
      setScale(key2, { min: min2, max: max2 });
    }
    function setSeries(i, opts3, _fire, _pub) {
      let s = series[i];
      if (opts3.focus != null)
        setFocus(i);
      if (opts3.show != null) {
        s.show = opts3.show;
        toggleDOM(i, opts3.show);
        _setScale(mode == 2 ? s.facets[1].scale : s.scale, null, null);
        commit();
      }
      _fire !== false && fire("setSeries", i, opts3);
      _pub && pubSync("setSeries", self2, i, opts3);
    }
    self2.setSeries = setSeries;
    function setBand(bi, opts3) {
      assign(bands[bi], opts3);
    }
    function addBand(opts3, bi) {
      opts3.fill = fnOrSelf(opts3.fill || null);
      bi = bi == null ? bands.length : bi;
      bands.splice(bi, 0, opts3);
    }
    function delBand(bi) {
      if (bi == null)
        bands.length = 0;
      else
        bands.splice(bi, 1);
    }
    self2.addBand = addBand;
    self2.setBand = setBand;
    self2.delBand = delBand;
    function setAlpha(i, value) {
      series[i].alpha = value;
      if (cursor.show && cursorPts[i])
        cursorPts[i].style.opacity = value;
      if (showLegend && legendRows[i])
        legendRows[i].style.opacity = value;
    }
    let closestDist;
    let closestSeries;
    let focusedSeries;
    const FOCUS_TRUE = { focus: true };
    const FOCUS_FALSE = { focus: false };
    function setFocus(i) {
      if (i != focusedSeries) {
        let allFocused = i == null;
        let _setAlpha = focus.alpha != 1;
        series.forEach((s, i2) => {
          let isFocused = allFocused || i2 == 0 || i2 == i;
          s._focus = allFocused ? null : isFocused;
          _setAlpha && setAlpha(i2, isFocused ? 1 : focus.alpha);
        });
        focusedSeries = i;
        _setAlpha && commit();
      }
    }
    if (showLegend && cursorFocus) {
      on(mouseleave, legendEl, (e) => {
        if (cursor._lock)
          return;
        setSeries(null, FOCUS_FALSE, true, syncOpts.setSeries);
        updateCursor(null, true, false);
      });
    }
    function posToVal(pos, scale, can2) {
      let sc = scales2[scale];
      if (can2)
        pos = pos / pxRatio - (sc.ori == 1 ? plotTopCss : plotLftCss);
      let dim = plotWidCss;
      if (sc.ori == 1) {
        dim = plotHgtCss;
        pos = dim - pos;
      }
      if (sc.dir == -1)
        pos = dim - pos;
      let _min = sc._min, _max = sc._max, pct = pos / dim;
      let sv = _min + (_max - _min) * pct;
      let distr = sc.distr;
      return distr == 3 ? pow(10, sv) : distr == 4 ? sinh(sv, sc.asinh) : sv;
    }
    function closestIdxFromXpos(pos, can2) {
      let v = posToVal(pos, xScaleKey, can2);
      return closestIdx(v, data2[0], i0, i1);
    }
    self2.valToIdx = (val) => closestIdx(val, data2[0]);
    self2.posToIdx = closestIdxFromXpos;
    self2.posToVal = posToVal;
    self2.valToPos = (val, scale, can2) => scales2[scale].ori == 0 ? getHPos(val, scales2[scale], can2 ? plotWid : plotWidCss, can2 ? plotLft : 0) : getVPos(val, scales2[scale], can2 ? plotHgt : plotHgtCss, can2 ? plotTop : 0);
    function batch(fn) {
      fn(self2);
      commit();
    }
    self2.batch = batch;
    self2.setCursor = (opts3, _fire, _pub) => {
      mouseLeft1 = opts3.left;
      mouseTop1 = opts3.top;
      updateCursor(null, _fire, _pub);
    };
    function setSelH(off2, dim) {
      setStylePx(selectDiv, LEFT, select.left = off2);
      setStylePx(selectDiv, WIDTH, select.width = dim);
    }
    function setSelV(off2, dim) {
      setStylePx(selectDiv, TOP, select.top = off2);
      setStylePx(selectDiv, HEIGHT, select.height = dim);
    }
    let setSelX = scaleX.ori == 0 ? setSelH : setSelV;
    let setSelY = scaleX.ori == 1 ? setSelH : setSelV;
    function syncLegend() {
      if (showLegend && legend.live) {
        for (let i = mode == 2 ? 1 : 0; i < series.length; i++) {
          if (i == 0 && multiValLegend)
            continue;
          let vals = legend.values[i];
          let j = 0;
          for (let k in vals)
            legendCells[i][j++].firstChild.nodeValue = vals[k];
        }
      }
    }
    function setLegend(opts3, _fire) {
      if (opts3 != null) {
        let idx = opts3.idx;
        legend.idx = idx;
        series.forEach((s, sidx) => {
          (sidx > 0 || !multiValLegend) && setLegendValues(sidx, idx);
        });
      }
      if (showLegend && legend.live)
        syncLegend();
      shouldSetLegend = false;
      _fire !== false && fire("setLegend");
    }
    self2.setLegend = setLegend;
    function setLegendValues(sidx, idx) {
      let val;
      if (idx == null)
        val = NULL_LEGEND_VALUES;
      else {
        let s = series[sidx];
        let src = sidx == 0 && xScaleDistr == 2 ? data0 : data2[sidx];
        val = multiValLegend ? s.values(self2, sidx, idx) : { _: s.value(self2, src[idx], sidx, idx) };
      }
      legend.values[sidx] = val;
    }
    function updateCursor(src, _fire, _pub) {
      rawMouseLeft1 = mouseLeft1;
      rawMouseTop1 = mouseTop1;
      [mouseLeft1, mouseTop1] = cursor.move(self2, mouseLeft1, mouseTop1);
      if (cursor.show) {
        vCursor && elTrans(vCursor, round(mouseLeft1), 0, plotWidCss, plotHgtCss);
        hCursor && elTrans(hCursor, 0, round(mouseTop1), plotWidCss, plotHgtCss);
      }
      let idx;
      let noDataInRange = i0 > i1;
      closestDist = inf;
      let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss;
      let yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss;
      if (mouseLeft1 < 0 || dataLen == 0 || noDataInRange) {
        idx = null;
        for (let i = 0; i < series.length; i++) {
          if (i > 0) {
            cursorPts.length > 1 && elTrans(cursorPts[i], -10, -10, plotWidCss, plotHgtCss);
          }
        }
        if (cursorFocus)
          setSeries(null, FOCUS_TRUE, true, src == null && syncOpts.setSeries);
        if (legend.live) {
          activeIdxs.fill(null);
          shouldSetLegend = true;
          for (let i = 0; i < series.length; i++)
            legend.values[i] = NULL_LEGEND_VALUES;
        }
      } else {
        let mouseXPos, valAtPosX, xPos;
        if (mode == 1) {
          mouseXPos = scaleX.ori == 0 ? mouseLeft1 : mouseTop1;
          valAtPosX = posToVal(mouseXPos, xScaleKey);
          idx = closestIdx(valAtPosX, data2[0], i0, i1);
          xPos = incrRoundUp(valToPosX(data2[0][idx], scaleX, xDim, 0), 0.5);
        }
        for (let i = mode == 2 ? 1 : 0; i < series.length; i++) {
          let s = series[i];
          let idx1 = activeIdxs[i];
          let yVal1 = mode == 1 ? data2[i][idx1] : data2[i][1][idx1];
          let idx2 = cursor.dataIdx(self2, i, idx, valAtPosX);
          let yVal2 = mode == 1 ? data2[i][idx2] : data2[i][1][idx2];
          shouldSetLegend = shouldSetLegend || yVal2 != yVal1 || idx2 != idx1;
          activeIdxs[i] = idx2;
          let xPos2 = idx2 == idx ? xPos : incrRoundUp(valToPosX(mode == 1 ? data2[0][idx2] : data2[i][0][idx2], scaleX, xDim, 0), 0.5);
          if (i > 0 && s.show) {
            let yPos = yVal2 == null ? -10 : incrRoundUp(valToPosY(yVal2, mode == 1 ? scales2[s.scale] : scales2[s.facets[1].scale], yDim, 0), 0.5);
            if (yPos > 0 && mode == 1) {
              let dist = abs(yPos - mouseTop1);
              if (dist <= closestDist) {
                closestDist = dist;
                closestSeries = i;
              }
            }
            let hPos, vPos;
            if (scaleX.ori == 0) {
              hPos = xPos2;
              vPos = yPos;
            } else {
              hPos = yPos;
              vPos = xPos2;
            }
            if (shouldSetLegend && cursorPts.length > 1) {
              elColor(cursorPts[i], cursor.points.fill(self2, i), cursor.points.stroke(self2, i));
              let ptWid, ptHgt, ptLft, ptTop, centered = true, getBBox = cursor.points.bbox;
              if (getBBox != null) {
                centered = false;
                let bbox = getBBox(self2, i);
                ptLft = bbox.left;
                ptTop = bbox.top;
                ptWid = bbox.width;
                ptHgt = bbox.height;
              } else {
                ptLft = hPos;
                ptTop = vPos;
                ptWid = ptHgt = cursor.points.size(self2, i);
              }
              elSize(cursorPts[i], ptWid, ptHgt, centered);
              elTrans(cursorPts[i], ptLft, ptTop, plotWidCss, plotHgtCss);
            }
          }
          if (legend.live) {
            if (!shouldSetLegend || i == 0 && multiValLegend)
              continue;
            setLegendValues(i, idx2);
          }
        }
      }
      cursor.idx = idx;
      cursor.left = mouseLeft1;
      cursor.top = mouseTop1;
      if (shouldSetLegend) {
        legend.idx = idx;
        setLegend();
      }
      if (select.show && dragging) {
        if (src != null) {
          let [xKey, yKey] = syncOpts.scales;
          let [matchXKeys, matchYKeys] = syncOpts.match;
          let [xKeySrc, yKeySrc] = src.cursor.sync.scales;
          let sdrag = src.cursor.drag;
          dragX = sdrag._x;
          dragY = sdrag._y;
          let { left, top, width, height } = src.select;
          let sori = src.scales[xKey].ori;
          let sPosToVal = src.posToVal;
          let sOff, sDim, sc, a, b;
          let matchingX = xKey != null && matchXKeys(xKey, xKeySrc);
          let matchingY = yKey != null && matchYKeys(yKey, yKeySrc);
          if (matchingX) {
            if (sori == 0) {
              sOff = left;
              sDim = width;
            } else {
              sOff = top;
              sDim = height;
            }
            if (dragX) {
              sc = scales2[xKey];
              a = valToPosX(sPosToVal(sOff, xKeySrc), sc, xDim, 0);
              b = valToPosX(sPosToVal(sOff + sDim, xKeySrc), sc, xDim, 0);
              setSelX(min(a, b), abs(b - a));
            } else
              setSelX(0, xDim);
            if (!matchingY)
              setSelY(0, yDim);
          }
          if (matchingY) {
            if (sori == 1) {
              sOff = left;
              sDim = width;
            } else {
              sOff = top;
              sDim = height;
            }
            if (dragY) {
              sc = scales2[yKey];
              a = valToPosY(sPosToVal(sOff, yKeySrc), sc, yDim, 0);
              b = valToPosY(sPosToVal(sOff + sDim, yKeySrc), sc, yDim, 0);
              setSelY(min(a, b), abs(b - a));
            } else
              setSelY(0, yDim);
            if (!matchingX)
              setSelX(0, xDim);
          }
        } else {
          let rawDX = abs(rawMouseLeft1 - rawMouseLeft0);
          let rawDY = abs(rawMouseTop1 - rawMouseTop0);
          if (scaleX.ori == 1) {
            let _rawDX = rawDX;
            rawDX = rawDY;
            rawDY = _rawDX;
          }
          dragX = drag.x && rawDX >= drag.dist;
          dragY = drag.y && rawDY >= drag.dist;
          let uni = drag.uni;
          if (uni != null) {
            if (dragX && dragY) {
              dragX = rawDX >= uni;
              dragY = rawDY >= uni;
              if (!dragX && !dragY) {
                if (rawDY > rawDX)
                  dragY = true;
                else
                  dragX = true;
              }
            }
          } else if (drag.x && drag.y && (dragX || dragY))
            dragX = dragY = true;
          let p0, p1;
          if (dragX) {
            if (scaleX.ori == 0) {
              p0 = mouseLeft0;
              p1 = mouseLeft1;
            } else {
              p0 = mouseTop0;
              p1 = mouseTop1;
            }
            setSelX(min(p0, p1), abs(p1 - p0));
            if (!dragY)
              setSelY(0, yDim);
          }
          if (dragY) {
            if (scaleX.ori == 1) {
              p0 = mouseLeft0;
              p1 = mouseLeft1;
            } else {
              p0 = mouseTop0;
              p1 = mouseTop1;
            }
            setSelY(min(p0, p1), abs(p1 - p0));
            if (!dragX)
              setSelX(0, xDim);
          }
          if (!dragX && !dragY) {
            setSelX(0, 0);
            setSelY(0, 0);
          }
        }
      }
      drag._x = dragX;
      drag._y = dragY;
      if (src == null) {
        if (_pub) {
          if (syncKey != null) {
            let [xSyncKey, ySyncKey] = syncOpts.scales;
            syncOpts.values[0] = xSyncKey != null ? posToVal(scaleX.ori == 0 ? mouseLeft1 : mouseTop1, xSyncKey) : null;
            syncOpts.values[1] = ySyncKey != null ? posToVal(scaleX.ori == 1 ? mouseLeft1 : mouseTop1, ySyncKey) : null;
          }
          pubSync(mousemove, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, idx);
        }
        if (cursorFocus) {
          let shouldPub = _pub && syncOpts.setSeries;
          let p = focus.prox;
          if (focusedSeries == null) {
            if (closestDist <= p)
              setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
          } else {
            if (closestDist > p)
              setSeries(null, FOCUS_TRUE, true, shouldPub);
            else if (closestSeries != focusedSeries)
              setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
          }
        }
      }
      ready && _fire !== false && fire("setCursor");
    }
    let rect2 = null;
    function syncRect(defer) {
      if (defer === true)
        rect2 = null;
      else {
        rect2 = over.getBoundingClientRect();
        fire("syncRect", rect2);
      }
    }
    function mouseMove(e, src, _l, _t, _w, _h, _i) {
      if (cursor._lock)
        return;
      cacheMouse(e, src, _l, _t, _w, _h, _i, false, e != null);
      if (e != null)
        updateCursor(null, true, true);
      else
        updateCursor(src, true, false);
    }
    function cacheMouse(e, src, _l, _t, _w, _h, _i, initial, snap) {
      if (rect2 == null)
        syncRect(false);
      if (e != null) {
        _l = e.clientX - rect2.left;
        _t = e.clientY - rect2.top;
      } else {
        if (_l < 0 || _t < 0) {
          mouseLeft1 = -10;
          mouseTop1 = -10;
          return;
        }
        let [xKey, yKey] = syncOpts.scales;
        let syncOptsSrc = src.cursor.sync;
        let [xValSrc, yValSrc] = syncOptsSrc.values;
        let [xKeySrc, yKeySrc] = syncOptsSrc.scales;
        let [matchXKeys, matchYKeys] = syncOpts.match;
        let rotSrc = src.scales[xKeySrc].ori == 1;
        let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss, yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss, _xDim = rotSrc ? _h : _w, _yDim = rotSrc ? _w : _h, _xPos = rotSrc ? _t : _l, _yPos = rotSrc ? _l : _t;
        if (xKeySrc != null)
          _l = matchXKeys(xKey, xKeySrc) ? getPos(xValSrc, scales2[xKey], xDim, 0) : -10;
        else
          _l = xDim * (_xPos / _xDim);
        if (yKeySrc != null)
          _t = matchYKeys(yKey, yKeySrc) ? getPos(yValSrc, scales2[yKey], yDim, 0) : -10;
        else
          _t = yDim * (_yPos / _yDim);
        if (scaleX.ori == 1) {
          let __l = _l;
          _l = _t;
          _t = __l;
        }
      }
      if (snap) {
        if (_l <= 1 || _l >= plotWidCss - 1)
          _l = incrRound(_l, plotWidCss);
        if (_t <= 1 || _t >= plotHgtCss - 1)
          _t = incrRound(_t, plotHgtCss);
      }
      if (initial) {
        rawMouseLeft0 = _l;
        rawMouseTop0 = _t;
        [mouseLeft0, mouseTop0] = cursor.move(self2, _l, _t);
      } else {
        mouseLeft1 = _l;
        mouseTop1 = _t;
      }
    }
    function hideSelect() {
      setSelect({
        width: 0,
        height: 0
      }, false);
    }
    function mouseDown(e, src, _l, _t, _w, _h, _i) {
      dragging = true;
      dragX = dragY = drag._x = drag._y = false;
      cacheMouse(e, src, _l, _t, _w, _h, _i, true, false);
      if (e != null) {
        onMouse(mouseup, doc, mouseUp);
        pubSync(mousedown, self2, mouseLeft0, mouseTop0, plotWidCss, plotHgtCss, null);
      }
    }
    function mouseUp(e, src, _l, _t, _w, _h, _i) {
      dragging = drag._x = drag._y = false;
      cacheMouse(e, src, _l, _t, _w, _h, _i, false, true);
      let { left, top, width, height } = select;
      let hasSelect = width > 0 || height > 0;
      hasSelect && setSelect(select);
      if (drag.setScale && hasSelect) {
        let xOff = left, xDim = width, yOff = top, yDim = height;
        if (scaleX.ori == 1) {
          xOff = top, xDim = height, yOff = left, yDim = width;
        }
        if (dragX) {
          _setScale(xScaleKey, posToVal(xOff, xScaleKey), posToVal(xOff + xDim, xScaleKey));
        }
        if (dragY) {
          for (let k in scales2) {
            let sc = scales2[k];
            if (k != xScaleKey && sc.from == null && sc.min != inf) {
              _setScale(k, posToVal(yOff + yDim, k), posToVal(yOff, k));
            }
          }
        }
        hideSelect();
      } else if (cursor.lock) {
        cursor._lock = !cursor._lock;
        if (!cursor._lock)
          updateCursor(null, true, false);
      }
      if (e != null) {
        offMouse(mouseup, doc);
        pubSync(mouseup, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
      }
    }
    function mouseLeave(e, src, _l, _t, _w, _h, _i) {
      if (!cursor._lock) {
        let _dragging = dragging;
        if (dragging) {
          let snapH = true;
          let snapV = true;
          let snapProx = 10;
          let dragH, dragV;
          if (scaleX.ori == 0) {
            dragH = dragX;
            dragV = dragY;
          } else {
            dragH = dragY;
            dragV = dragX;
          }
          if (dragH && dragV) {
            snapH = mouseLeft1 <= snapProx || mouseLeft1 >= plotWidCss - snapProx;
            snapV = mouseTop1 <= snapProx || mouseTop1 >= plotHgtCss - snapProx;
          }
          if (dragH && snapH)
            mouseLeft1 = mouseLeft1 < mouseLeft0 ? 0 : plotWidCss;
          if (dragV && snapV)
            mouseTop1 = mouseTop1 < mouseTop0 ? 0 : plotHgtCss;
          updateCursor(null, true, true);
          dragging = false;
        }
        mouseLeft1 = -10;
        mouseTop1 = -10;
        updateCursor(null, true, true);
        if (_dragging)
          dragging = _dragging;
      }
    }
    function dblClick(e, src, _l, _t, _w, _h, _i) {
      autoScaleX();
      hideSelect();
      if (e != null)
        pubSync(dblclick, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
    }
    function syncPxRatio() {
      axes.forEach(syncFontSize);
      _setSize(self2.width, self2.height, true);
    }
    on(dppxchange, win, syncPxRatio);
    const events = {};
    events.mousedown = mouseDown;
    events.mousemove = mouseMove;
    events.mouseup = mouseUp;
    events.dblclick = dblClick;
    events["setSeries"] = (e, src, idx, opts3) => {
      setSeries(idx, opts3, true, false);
    };
    if (cursor.show) {
      onMouse(mousedown, over, mouseDown);
      onMouse(mousemove, over, mouseMove);
      onMouse(mouseenter, over, syncRect);
      onMouse(mouseleave, over, mouseLeave);
      onMouse(dblclick, over, dblClick);
      cursorPlots.add(self2);
      self2.syncRect = syncRect;
    }
    const hooks = self2.hooks = opts2.hooks || {};
    function fire(evName, a1, a2) {
      if (evName in hooks) {
        hooks[evName].forEach((fn) => {
          fn.call(null, self2, a1, a2);
        });
      }
    }
    (opts2.plugins || []).forEach((p) => {
      for (let evName in p.hooks)
        hooks[evName] = (hooks[evName] || []).concat(p.hooks[evName]);
    });
    const syncOpts = assign({
      key: null,
      setSeries: false,
      filters: {
        pub: retTrue,
        sub: retTrue
      },
      scales: [xScaleKey, series[1] ? series[1].scale : null],
      match: [retEq, retEq],
      values: [null, null]
    }, cursor.sync);
    cursor.sync = syncOpts;
    const syncKey = syncOpts.key;
    const sync = _sync(syncKey);
    function pubSync(type, src, x, y, w, h, i) {
      if (syncOpts.filters.pub(type, src, x, y, w, h, i))
        sync.pub(type, src, x, y, w, h, i);
    }
    sync.sub(self2);
    function pub(type, src, x, y, w, h, i) {
      if (syncOpts.filters.sub(type, src, x, y, w, h, i))
        events[type](null, src, x, y, w, h, i);
    }
    self2.pub = pub;
    function destroy() {
      sync.unsub(self2);
      cursorPlots.delete(self2);
      mouseListeners.clear();
      off(dppxchange, win, syncPxRatio);
      root.remove();
      fire("destroy");
    }
    self2.destroy = destroy;
    function _init() {
      fire("init", opts2, data2);
      setData(data2 || opts2.data, false);
      if (pendScales[xScaleKey])
        setScale(xScaleKey, pendScales[xScaleKey]);
      else
        autoScaleX();
      _setSize(opts2.width, opts2.height);
      updateCursor(null, true, false);
      setSelect(select, false);
    }
    series.forEach(initSeries);
    axes.forEach(initAxis);
    if (then) {
      if (then instanceof HTMLElement) {
        then.appendChild(root);
        _init();
      } else
        then(self2, _init);
    } else
      _init();
    return self2;
  }
  uPlot.assign = assign;
  uPlot.fmtNum = fmtNum;
  uPlot.rangeNum = rangeNum;
  uPlot.rangeLog = rangeLog;
  uPlot.rangeAsinh = rangeAsinh;
  uPlot.orient = orient;
  {
    uPlot.join = join;
  }
  {
    uPlot.fmtDate = fmtDate;
    uPlot.tzDate = tzDate;
  }
  {
    uPlot.sync = _sync;
  }
  {
    uPlot.addGap = addGap;
    uPlot.clipGaps = clipGaps;
    let paths = uPlot.paths = {
      points
    };
    paths.linear = linear;
    paths.stepped = stepped;
    paths.bars = bars;
    paths.spline = monotoneCubic;
  }

  // desktop-web/main.js
  var import_jquery = __toESM(require_jquery());
  var import_semantic_ui_tab = __toESM(require_semantic_ui_tab());
  console.log("Starting up Twinleaf Web UI Experiment...");
  (0, import_jquery.default)("#page-menu .item").tab();
  var interval = 50;
  var loop = 1e3;
  var data = [
    [],
    [],
    [],
    [],
    []
  ];
  function addData() {
    if (data[0].length == loop) {
      data[0].shift();
      data[1].shift();
      data[2].shift();
      data[3].shift();
    }
    data[0].push(Date.now());
    data[1].push(0 - Math.random());
    data[2].push(-1 - Math.random());
    data[3].push(-2 - Math.random());
  }
  setInterval(addData, interval);
  function getSize() {
    return {
      width: 800,
      height: 400
    };
  }
  var scales = {
    x: {},
    y: {
      auto: false,
      range: [-3.5, 1.5]
    }
  };
  var opts = {
    title: "Scrolling Data Example",
    ...getSize(),
    pxAlign: 0,
    ms: 1,
    scales,
    pxSnap: false,
    series: [
      {},
      {
        stroke: "red",
        paths: uPlot.paths.linear(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true }
      },
      {
        stroke: "blue",
        paths: uPlot.paths.spline(),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true }
      },
      {
        stroke: "purple",
        paths: uPlot.paths.stepped({ align: 1, pxSnap: false }),
        spanGaps: true,
        pxAlign: 0,
        points: { show: true }
      }
    ]
  };
  var u = new uPlot(opts, data, document.getElementById("uplot-chart"));
  window.addEventListener("resize", (e) => {
    u.setSize(getSize());
  });
})();
/*!
 * # Semantic UI 2.3.1 - Tab
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
