(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Component, Event,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Event = (function() {
  function Event() {
    this.subscription = {};
  }

  Event.prototype.$subscribe = function(type, fn, cons) {
    var f, id, p, r;
    if ("undefined" === typeof this.subscription.eventmap) {
      this.subscription.eventmap = {};
    }
    if ("undefined" === typeof this.subscription[type]) {
      this.subscription[type] = [];
    }
    p = this.subscription[type];
    r = false;
    if (p.length > 0) {
      f = fn.toString();
      r = !this.each.call(p, function(item) {
        if (item && f === item.response.toString() && cons && cons === item.caller) {
          return false;
        }
      });
    }
    if (false === r) {
      id = Math.floor(Math.random() * 1000000000000000).toString(36);
      this.subscription.eventmap[id] = type;
      p.push({
        "id": id,
        "response": fn,
        "caller": cons
      });
    }
    return id;
  };

  Event.prototype.subscribe = function(type, fn, cons) {
    var i, len1, results, t;
    if (typeof type === 'string') {
      return this.$subscribe(type, fn, cons);
    } else if (Object.prototype.toString.call(type) === '[object Array]') {
      results = [];
      for (i = 0, len1 = type.length; i < len1; i++) {
        t = type[i];
        results.push(this.$subscribe(t, fn, cons));
      }
      return results;
    }
  };

  Event.prototype.publish = function(type) {
    var p, params, publisher;
    p = this.subscription[type];
    if (p && p.length) {
      params = arguments.length > 0 ? Array.prototype.slice.call(arguments) : [];
      publisher = this;
      params.unshift(publisher);
      this.each.call(p, function(item) {
        var cons;
        if (item) {
          cons = item.caller || null;
          return item.response.apply(cons, params);
        }
      });
    }
    return this;
  };

  Event.prototype.unsubscribe = function(id, handle) {
    var map, p, type;
    if ("string" === typeof id) {
      if ("type" === handle) {
        this.subscription[type] && (this.subscription[type].length = 0);
      } else {
        map = this.subscription.eventmap;
        type = map[id];
        if (type) {
          p = this.subscription[type];
          if (p && p.length > 0) {
            this.each.call(p, function(item, index) {
              if (item && id === item.id) {
                p[index] = null;
                map[id] = null;
                delete map[id];
                return false;
              }
            });
          }
        }
      }
    } else {
      this.subscription = {};
    }
    return this;
  };

  Event.prototype.each = function(fn) {
    var i, index, item, key, len, len1, params, result;
    len = this.length;
    params = arguments.length > 1 && Array.prototype.slice.call(arguments, 1) || [];
    if ("number" === typeof len) {
      for (index = i = 0, len1 = this.length; i < len1; index = ++i) {
        item = this[index];
        result = fn.apply(this, [item, index].concat(params));
        if (result === false) {
          return false;
        }
      }
    } else {
      for (key in this) {
        item = this[key];
        if (this.hasOwnProperty(key)) {
          result = fn.apply(this, [item, key].concat(params));
          if (result === false) {
            return false;
          }
        }
      }
    }
    return true;
  };

  return Event;

})();

Component = (function(superClass) {
  extend(Component, superClass);

  function Component(selector) {
    var node;
    Component.__super__.constructor.call(this);
    this.contain = null;
    if ("string" === typeof selector) {
      node = document.querySelector(selector);
    } else if ("object" === typeof selector && selector.nodeType && 1 === selector.nodeType) {
      node = selector;
    }
    if (node && node.getAttribute) {
      this.contain = node;
    }
    this.subscribe("render", this.init, this);
  }

  Component.prototype.render = function(fn) {
    if (fn != null) {
      fn.call(this);
    }
    return this.publish("render");
  };

  Component.prototype.init = function() {};

  Component.prototype.contains = function(parent, child) {
    if (parent === child) {
      return 0;
    }
    if (parent.contains) {
      if (parent.contains(child)) {
        return 1;
      }
    } else {
      if (!!(parent.compareDocumentPosition(child) & 16)) {
        return 1;
      }
    }
    return -1;
  };

  Component.prototype.upperStyleName = function(s) {
    return s && s.length && s.replace(/-([a-z])/g, function(a, b) {
      return b.toUpperCase();
    }) || '';
  };

  Component.prototype.lowerStyleName = function(s) {
    return s && s.length && s.replace(/([A-Z])/g, function(a, b) {
      return '-' + b.toLowerCase();
    }) || '';
  };

  Component.prototype.addClass = function(node, className) {
    if (node && node.getAttribute) {
      if (!this.hasClass(node, className)) {
        node.className += " " + className;
      }
    }
    return this;
  };

  Component.prototype.removeClass = function(node, className) {
    var oldClass, reg;
    if (node && node.getAttribute) {
      if (this.hasClass(node, className)) {
        oldClass = node.className;
        reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
        node.className = oldClass.replace(reg, " ").replace(/(^\s+|\s+$)/g, "");
      }
    }
    return this;
  };

  Component.prototype.hasClass = function(node, className) {
    var reg;
    if (node && node.getAttribute) {
      reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
      return node.className && reg.test(node.className);
    }
    return false;
  };

  return Component;

})(Event);

module.exports = {
  Event: Event,
  Component: Component
};

},{}],2:[function(require,module,exports){
var SElement, Storage, _storage, event, local, session,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

event = require("./components.coffee").Event;

_storage = function(key, value, isDel, storage) {
  if (isDel === false) {
    return storage.removeItem(key);
  }
  if (value === undefined) {
    return storage.getItem(key);
  } else {
    return storage.setItem(key, value);
  }
};

local = function(key, value, isDel) {
  return _storage(key, value, isDel, window.localStorage);
};

session = function(key, value, isDel) {
  return _storage(key, value, isDel, window.sessionStorage);
};

SElement = function(idx, val) {
  this.idx = idx;
  this.time = new Date();
  this.value = val;
  return this;
};

Storage = (function(superClass) {
  extend(Storage, superClass);

  function Storage(opt) {
    Storage.__super__.constructor.call(this);
    opt = opt || {};
    this.key = opt.key || "Markdown";
    this.autoSaveKey = opt.autoSavePrefix || "Lucien_AutoSave_" + this.key;
    this.manualSaveKey = opt.manualSavePrefix || "Lucien_ManualSave_" + this.key;
    this.exitSaveKey = opt.manualSavePrefix || "Lucien_ExitSave_" + this.key;
    this.saveGap = opt.saveGap || 20000;
    this.autoSaveDeep = opt.autoSaveDeep || 5;
  }


  /*
  min time
  20s
  1min
  3min
  9min
  27min
  81min
   */

  Storage.prototype.autoSave = function(element) {
    var deep, idx;
    deep = this.autoSaveDeep;
    idx = 0;
    return setInterval((function(_this) {
      return function() {
        var currentValue, i, j, ref;
        currentValue = JSON.parse(_this.getAutoValue());
        if (!currentValue) {
          currentValue = {};
          currentValue[0] = new SElement(idx, element.value);
        } else if (element.value !== currentValue[0].value) {
          _this.publish('autosave', _this);
          currentValue["i0"] = currentValue[0];
          idx++;
          currentValue[0] = new SElement(idx, element.value);
          for (i = j = 1, ref = deep; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
            if (currentValue["i" + (i - 1)] && currentValue["i" + (i - 1)].idx % Math.pow(3, i) === 0) {
              currentValue[i] = currentValue["i" + (i - 1)];
            }
          }
        }
        return _this.setAutoValue(JSON.stringify(currentValue));
      };
    })(this), this.saveGap);
  };

  Storage.prototype.manualSave = function(element) {
    var _this, currentValue, deep, idx;
    deep = this.autoSaveDeep;
    idx = -1;
    _this = this;
    currentValue = JSON.parse(this.getManualValue());
    if (element.value === currentValue[0].value) {
      return;
    }
    return (function() {
      return function() {
        idx++;
        if (idx === deep) {
          idx = 0;
        }
        currentValue[idx] = {
          value: element.value,
          time: new Date()
        };
        return _this.setManualValue(JSON.stringify(currentValue));
      };
    })();
  };

  Storage.prototype.addExitListener = function(ele) {
    this.recoverValue(ele);
    return window.onbeforeunload = (function(_this) {
      return function() {
        return _this.setExitValue(ele.value);
      };
    })(this);
  };

  Storage.prototype.getAutoValue = function() {
    return local(this.autoSaveKey);
  };

  Storage.prototype.setAutoValue = function(val) {
    return local(this.autoSaveKey, val);
  };

  Storage.prototype.getManualValue = function() {
    return local(this.manualSaveKey);
  };

  Storage.prototype.setManualValue = function(val) {
    this.publish('manualsave', this);
    return local(this.manualSaveKey, val);
  };

  Storage.prototype.getExitValue = function() {
    return local(this.exitSaveKey);
  };

  Storage.prototype.setExitValue = function(val) {
    return local(this.exitSaveKey, val);
  };

  Storage.prototype.recoverValue = function(element) {
    var val;
    val = this.getExitValue();
    if (val) {
      element.value = val;
      return this.setExitValue('');
    }
  };

  return Storage;

})(event);

Storage.local = local;

Storage.session = session;

module.exports = Storage;

},{"./components.coffee":1}]},{},[2]);
