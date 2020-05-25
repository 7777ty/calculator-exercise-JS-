// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
var _this = this;

var ul = document.querySelector('ul');
var currentInput = document.getElementsByClassName('currentInput');
var clear = document.getElementsByClassName('clear');
var onDelete = document.getElementsByClassName('onDelete');
var onCalculate = document.getElementsByClassName('onCalculate');
var numberString = '0123456789';
var operatorString = '+-*/%';
var historyInput = document.getElementsByClassName('history');
var suffixExpression = [];
var numberStack = [];
var result = document.getElementsByClassName('result');
ul.addEventListener('click', function (e) {
  console.log(currentInput[0].innerHTML);

  if (currentInput[0].innerHTML === '') {
    return;
  }

  var input = e.target.textContent;
  var currentOutput = currentInput[0].innerHTML;
  var length = currentInput[0].firstChild.length;

  if (numberString.includes(input) || operatorString.includes(input) || input === '.') {
    if (length >= 16) {
      return;
    }

    if (currentOutput === '0') {
      if (numberString.includes(input)) {
        currentInput[0].innerHTML = input;
      } else if (operatorString.includes(input) || input === '.') {
        currentInput[0].innerHTML += input;
      }

      return;
    }

    if (operatorString.includes(currentOutput[length - 1]) && input === '.') {
      return;
    }

    if (currentOutput.includes('.') && input === '.') {
      if (!currentOutput.slice(currentOutput.lastIndexOf('.')).match(/\+[0-9]|\-[0-9]|\*[0-9]|\/[0-9]|\%[0-9]?/)) {
        return;
      }
    }

    if (operatorString.includes(input)) {
      if (operatorString.includes(currentOutput[length - 1]) || currentOutput.endsWith('.')) {
        return;
      }
    }

    currentInput[0].innerHTML += input;
  }
});
onCalculate[0].addEventListener('click', function () {
  var currentOutput = currentInput[0].innerHTML;

  if (currentOutput === '' || currentOutput === '0') {
    return;
  }

  toRPolish(currentOutput);
  suffixExpression.forEach(function (e) {
    if (!operatorString.includes(e)) {
      numberStack.push(e);
    } else {
      var number1 = parseFloat(numberStack.pop());
      var number2 = parseFloat(numberStack.pop());
      var sum = 0;

      switch (e) {
        case '+':
          {
            sum = number1 + number2;
            numberStack.push(sum);
            break;
          }

        case '-':
          {
            sum = number2 - number1;
            numberStack.push(sum);
            break;
          }

        case '*':
          {
            sum = number1 * number2;
            numberStack.push(sum);
            break;
          }

        case '/':
          {
            if (number1 === 0) {
              window.alert("除数不能为0！！！");
              historyInput[0].innerHTML = '';
              break;
            }

            sum = number2 / number1;

            _this.numberStack.push(sum);

            break;
          }

        case '%':
          {
            if (!(Number.isInteger(number2) && Number.isInteger(number1))) {
              window.alert("求余运算两边必须是整数！！！");
              historyInput[0].innerHTML = '';
              break;
            }

            if (number1 === 0) {
              window.alert("求余运算的分母不可为0！！！");
              historyInput[0].innerHTML = '';
              break;
            }

            sum = number2 % number1;
            numberStack.push(sum);
            break;
          }
      }
    }
  });

  if (!historyInput[0].innerHTML) {
    currentInput[0].innerHTML = '0';
    result[0].innerHTML = '';
  } else {
    result[0].innerHTML = numberStack.pop();
    currentInput[0].innerHTML = '';
  }

  suffixExpression = [];
});
clear[0].addEventListener('click', function () {
  currentInput[0].innerHTML = '0';
  result[0].innerHTML = '';
  historyInput[0].innerHTML = '';
});
onDelete[0].addEventListener('click', function () {
  if (currentInput[0].innerHTML.length > 1) {
    currentInput[0].innerHTML = currentInput[0].innerHTML.substring(0, currentInput[0].innerHTML.length - 1);
  } else {
    currentInput[0].innerHTML = '0';
    result[0].innerHTML = '';
    historyInput[0].innerHTML = '';
  }
});

function toRPolish(input) {
  var S1 = []; //操作数栈

  var S2 = []; //运算符栈

  var flag = true;
  var currentOutput = currentInput[0].innerHTML;

  if (operatorString.includes(input[input.length - 1])) {
    input = input.substring(0, input.length - 1);
  }

  for (var i = 0; i < input.length; i++) {
    if (numberString.includes(input[i])) {
      for (var j = i; j < input.length; j++) {
        if (operatorString.includes(input[j])) {
          S1.push(input.slice(i, j));

          if (S2.length === 0 || !toCompareOperator(S2[S2.length - 1], input[j])) {
            S2.push(input[j]);
            flag = false;
          } else if (toCompareOperator(S2[S2.length - 1], input[j])) {
            flag = true;
            S1.push(S2.pop());

            while (flag) {
              if (S2.length === 0 || !toCompareOperator(S2[S2.length - 1], input[j])) {
                S2.push(input[j]);
                flag = false;
              } else if (toCompareOperator(S2[S2.length - 1], input[j])) {
                S1.push(S2.pop());
              }
            }
          }

          i = j;
          break;
        } else if (j === input.length - 1) {
          S1.push(input.slice(i, j + 1));

          while (S2.length > 0) {
            S1.push(S2.pop());
          }

          i = j;
        }
      }
    }
  }

  suffixExpression = S1;
  historyInput[0].innerHTML = currentOutput;
}

function toCompareOperator(a, b) {
  if (a === '*' || a === '/' || a === '%') {
    return true;
  } else if ((a === '+' || a === '-') && (b === '*' || b === '/' || b === '%')) {
    return false;
  }
}
},{}],"C:/Users/呀哈哈/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51901" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/呀哈哈/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map