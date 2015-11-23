// Define a number of common functions if they don"t already exist
var extend = require("node.extend");

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, "startsWith", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, "endsWith", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

if (!Object.new) {
    Object.defineProperty(Object, "new", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (options) {
            var instance = this.extend();
            if (instance.initialize) {
                instance.initialize(options);
            }
            return instance;
        }
    });
}

if (!Object.extend) {
    Object.defineProperty(Object, "extend", {
        enumerable: false,
        configurable: false,
        writable: false,
        value:function(augment) {
            function F() {}
            F.prototype = this;
            var f = new F();
            if (augment) {
                for (var key in augment) {
                    if ((key in f)&&(typeof f[key]==="object")&&(!Array.isArray(f[key]))) {
                        f[key]=extend(true, {}, f[key], augment[key]);
                    }
                    else {
                        f[key]=augment[key];
                    }
                }
            }
            return f;
        }
    });
}
