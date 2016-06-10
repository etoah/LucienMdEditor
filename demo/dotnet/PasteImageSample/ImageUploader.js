(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Component, ImageUploader, Sync,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component = require('./components.coffee').Component;

Sync = require("./sync.coffee");

ImageUploader = (function(superClass) {
  var dataReader, preventDefault, preventDragDefault;

  extend(ImageUploader, superClass);

  function ImageUploader(id, url, key) {
    ImageUploader.__super__.constructor.call(this, id);
    this.url = url;
    this.imgKey = key || "AreaImgKey";
  }

  preventDragDefault = function() {
    document.addEventListener("dragleave", preventDefault());
    document.addEventListener("drop", preventDefault());
    document.addEventListener("dragenter", preventDefault());
    return document.addEventListener("dragover", preventDefault());
  };

  preventDefault = function(e) {
    e.preventDefault();
    return e.returnValue = false;
  };

  dataReader = function(file, callback) {
    var reader;
    reader = new FileReader();
    reader.onload = callback;
    return reader.readAsDataURL(file);
  };

  ImageUploader.prototype.paste = function(callback, formData) {
    var _this;
    _this = this;
    return this.contain.addEventListener("paste", (function(e) {
      var file, that;
      if (e.clipboardData && e.clipboardData.items[0].type.indexOf("image") > -1) {
        that = this;
        file = e.clipboardData.items[0].getAsFile();
        return dataReader(file, function(e) {
          var fd;
          fd = formData || (new FormData());
          fd.append(_this.imgKey, this.result);
          return Sync("POST", _this.url, fd, function() {
            callback.apply(this, arguments);
            return _this.publish("pasted", this);
          }, that);
        });
      }
    }), false);
  };

  return ImageUploader;

})(Component);

ImageUploader.prototype.drag = function(callback, formData) {
  var that;
  that = this;
  return this.contain.addEventListener("drop", (function(e) {
    var fd, fileList;
    e.preventDefault();
    fileList = e.dataTransfer.files;
    if (fileList.length === 0) {
      return false;
    }
    if (fileList[0].type.indexOf("image") === -1) {
      console.log && console.log("您拖的不是图片！");
      return false;
    }
    fd = formData || (new FormData());
    fd.append(that.imgKey, fileList[0]);
    return Sync("POST", that.url, fd, function() {
      that.publish("droped", this);
      return callback.apply(this, arguments);
    }, this);
  }), false);
};

ImageUploader.prototype.upload = function(callback, formData) {
  this.drag(callback, formData);
  return this.paste(callback, formData);
};

module.exports = ImageUploader;

},{"./components.coffee":2,"./sync.coffee":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var xhRequest;

xhRequest = function(method, url, formData, callback, callbackContext) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onload = function() {
    return callback && callback.call(callbackContext || this, xhr);
  };
  return xhr.send(formData || (new FormData()));
};

module.exports = xhRequest;

},{}]},{},[1]);
