// Define a number of common functions if they don"t already exist
var extend = require("node.extend");
var _ = require("lodash");

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

if (!String.prototype.toTitleCase) {
    Object.defineProperty(String.prototype, "toTitleCase", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function () {
            return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });
}

if (!Object.prototype.integrate) {
    Object.defineProperty(Object.prototype, "integrate", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, augment) {
            if (!augment) {
                augment = target;
                target = this;
            }
            if (augment) {
                for (var key in augment) {
                    var descriptor = Object.getOwnPropertyDescriptor(augment, key);
                    if (descriptor.get) {
                        Object.defineProperty(target, key, descriptor);
                    }
                    else {
                        var value = augment[key];
                        if (value instanceof Array) {
                            target[key] = value;
                        }
                        else if ((typeof target[key]==="object")&&(typeof value==="object")) {
                            target[key].integrate(value);
                        }
                        else {
                            target[key] = value;
                        }
                    }
                }
            }
            return target;
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
                    if (
                        (key in f)&&
                        (typeof f[key]==="object")&&
                        (typeof f[key].extend!=="function")&&
                        (!Array.isArray(f[key]))
                    ) {
                        f[key]= _.mergeWith({}, f[key], augment[key], function(a, b) {
                            if (_.isArray(a)&&_.isArray(b)) {
                                return b;
                            }
                        });
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

if (!Object.overlay) {
    Object.defineProperty(Object, "overlay", {
        enumerable: false,
        configurable: false,
        writable: false,
        value:function(augment) {
            function F() {}
            F.prototype = this;
            var f = new F();
            if (augment) {
                for (var key in augment) {
                    if (key in f) {
                        if (typeof f[key]==="object") {
                            if (f[key].overlay===Object.overlay) {
                                f[key] = f[key].overlay(augment[key])
                            }
                            else {
                                f[key] = Object.overlay(f[key]).overlay(augment[key])
                            }
                        }
                        else {
                            f[key] = augment[key];
                        }
                    }
                    else {
                        if (typeof augment[key]==="object") {
                            if (augment[key].overlay===Object.overlay) {
                                f[key] = augment[key].overlay({});
                            }
                            else {
                                f[key] = Object.overlay(augment[key])
                            }
                        }
                        else {
                            f[key] = augment[key]
                        }
                    }
                }
            }
            return f;
        }
    });
}
