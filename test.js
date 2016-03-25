require("./index.js");

// Simple extension
var A = Object.extend();
var B = A.extend();

// Set a prop on super type, is visible in subtype
A.v1 = 1;

// Change it in super type, it changes in sub type (prop is shared)
A.v1 = 2;

// Set object on supertype, available in subtype, referentially identical
A.o1 = {
    v1:1,
    v2:1
}

// Extend that supplies new version of o1 integrates properties of old version of o1, versions not referentially identical.
// Properties of new version of o1 in C are not added to old version of o1 in A
var C = A.extend({
    o1:{
        v1:2,
        v3:1
    }
})

// Extend A again to get D, D contains o1, but A/C do not contains o2
// Also, notice that object properties are deep extended
var D = A.extend({
    o1:{
        o1:{
            v1:1
        }
    },
    o2:{
        v1:1,
        v2:1
    }
})

// Extend as mixin
var E = Object
    .extend(C)
    .extend(D)

// Order of mixin in multiple inheritance type patterns matters
var F = Object
    .extend(D)
    .extend(C)

// An instance scoped initializer can be provided...
A.initialize = function(options) {
    options = options||{};
    this.v3 = 1;
    this.v4 = 1;
    this.v5 = options.v5;
    this.o3 = {
        v1:1,
        v2:1
    }
}

// ... similar but not exactly like instance construction in class based systems
// a1 contains v3, v4, o3, but A, C, etc do not
var a1 = A.new();

// Arguments can be passed to initializer
var a2 = A.new({
    v5:1
});

// Super type initializers can be overridden and invoked from sub type initializers
B.initialize = function(options) {
    options = options||{};
    A.initialize.call(this, options);
    this.v6 = options.v6;
}

// v5 not passed, so it remains undefined after A's initializer is invoked from B's initializer
var b1 = B.new({
    v6:1
})

// Types can be defined with arbitrary functions inline, including initializer
var G = A.extend({
    initialize:function(options) {
        this.v7 = 1;
    },
    f1:function(options) {
        this.v7 = 2;
    },
    f2:function(options) {
        this.v1 = 3;
    }
})

// Variables defined or modified on instance do not affect super type
var g1 = G.new();
g1.f1();

// Variables set on instance shadow but do not overwrite variables defined on super type
g1.f2();

// Subsequent modification of super type does not affect shadowing variable on sub type
A.v1 = 4;

