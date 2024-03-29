var externalContex = this; //window

describe("(03) variables declaration: ", function () {
    it("without 'var', even inside a function, is global", function () {
        function defineGlobalFoo() {
            foo = "I'm global!";
        }

        function callFoo() {
            return foo;
        }

        defineGlobalFoo();
        expect(callFoo()).toEqual("I'm global!");
    });

    it("but with 'var', is scoped to the function", function () {
        delete foo;
        function defineFooWithVar() {
            var foo = "I'm global!";
        }

        // does not exist at all
        expect(window['foo']).toBeUndefined();
    });

    it("this is how to check not defined variables", function () {
        // http://stackoverflow.com/questions/858181/how-to-check-a-not-defined-variable-in-javascript
        expect(typeof thisNotExist).toEqual('undefined');
        expect(window['thisNotExist']).toBeUndefined();
    })
});

describe("(03) hoisting:", function () {
    it("variables are always moved to the top", function () {
        function hoistedTrueFooVar() {
            if (true) {
                var fooHoisted = "fooHoisted";
            }
            return fooHoisted;
        }

        expect(hoistedTrueFooVar()).toEqual("fooHoisted");
    });
    it("...even if not reached in runtime", function () {
        function hoistedFalseFooVar() {
            if (false) {
                var fooHoisted = "fooHoisted";
            }
            return fooHoisted;
        }

        expect(hoistedFalseFooVar()).toEqual(undefined);
    })
});

describe("(03) closures:", function () {

    function outerScope(mustCall) {
        var outerVar = "outerVar";

        function innerScope() {
            outerVar = "closure variable";
        }

        if (mustCall) {
            innerScope();
        }
        return outerVar;
    }

    it("without calling inner the var not change", function () {
        expect(outerScope(false), "outerVar");
    });
    it("but calling inner function, change outer variable", function () {
        expect(outerScope(true), "closure variable");
    });
    it("that is not global. Does not exist outside", function () {
        expect(typeof outerVar).toEqual('undefined');
    })
});


describe("(03) immediate functions:", function () {
    it("you can point your function to a variable", function () {
        var myFunc = function () {
            var a = 1;
            expect(a).toEqual(1);
        };
        myFunc();
    });
    it("but, to be immediate you have to call it", function () {
        (function () {
            var a = 1;
            expect(a).toEqual(1);
        })();
    })
});

describe("(03) modules:", function () {
    it("this is a simple module that returns a string", function () {
        var myModule = (function () {
            var fooStr;

            function closureCall() {
                fooStr = "foo has a value";
            }

            closureCall();
            return fooStr;
        })();

        expect(myModule).toEqual("foo has a value")
    });

    it("they can have state", function () {
        var myModule = (function () {
            var fooObj = {};
            fooObj.count = 0;
            fooObj.addCount = function () {
                fooObj.count += 1;
            };
            return fooObj;
        })();

        expect(myModule.count).toEqual(0);
        myModule.addCount();
        expect(myModule.count).toEqual(1);
        myModule.addCount();
        expect(myModule.count).toEqual(2);
        myModule.addCount();
        expect(myModule.count).toEqual(3);
    })

    it("its better to access external things passing then", function () {
        var externalVar = 10;

        var myModule = (function (fromOutside) {
            return fromOutside;
        })(externalVar);

        expect(myModule).toEqual(10);
    })

    it("you can attach to the external context", function () {
        var myModule = (function (context, fullExternal) {
            // jasmine
            context.newVar = "I'm at jasmine";
            // window
            fullExternal.newVar = "I'm at window";
        })(this, externalContex);

        // jasmine
        expect(this.newVar).toEqual("I'm at jasmine");

        // window
        expect(externalContex.newVar).toEqual("I'm at window");
        expect(window.newVar).toEqual("I'm at window");
    })

});

describe("(03) instances:", function () {
    var module1;
    var module2;

    beforeEach(function () {
        var MyModule = (function () {
            var outerConter = 0;
            var myObj = function (name) {
                this.name = name;
                var counter = 0;
                this.add = function () {
                    counter += 1;
                    outerConter += 1;
                }
                this.getCounter = function () {
                    return counter;
                }
                this.getOuterCounter = function () {
                    return outerConter;
                }
            }
            return myObj;
        })();
        //IMMEDIATE EXECUTION -> module

        module1 = new MyModule("mod1");
        module2 = new MyModule("mod2");
    })

    it("diff instance with diff names", function () {
        expect(module1.name).toEqual("mod1");
        expect(module2.name).toEqual("mod2");
    })

    it("'counter' is inside the object", function () {
        //module1
        expect(module1.getCounter()).toEqual(0);
        module1.add();
        expect(module1.getCounter()).toEqual(1);

        //module2
        expect(module2.getCounter()).toEqual(0);
        module2.add();
        expect(module2.getCounter()).toEqual(1);
    })

    it("'outerCounter' is a shared private variable", function () {
        expect(module1.getOuterCounter()).toEqual(0);
        expect(module2.getOuterCounter()).toEqual(0);
        //module1
        module1.add();
        expect(module1.getOuterCounter()).toEqual(1);
        expect(module2.getOuterCounter()).toEqual(1);
        //module2
        module2.add();
        expect(module1.getOuterCounter()).toEqual(2);
        expect(module2.getOuterCounter()).toEqual(2);
    })
});

