
// import Nevow.Athena

if (Nevow.Athena.Tests == undefined) {
    Nevow.Athena.Tests = {};
}

Nevow.Athena.Tests.ClientToServerArgumentSerialization = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ClientToServerArgumentSerialization');
Nevow.Athena.Tests.ClientToServerArgumentSerialization.methods(
    function run(self) {
        var L = [1, 1.5, 'Hello world'];
        var O = {'hello world': 'object value'};
        return self.callRemote('test', 1, 1.5, 'Hello world', L, O);
    });

Nevow.Athena.Tests.ClientToServerResultSerialization = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ClientToServerResultSerialization');
Nevow.Athena.Tests.ClientToServerResultSerialization.methods(
    function run(self) {
        var L = [1, 1.5, 'Hello world'];
        var O = {'hello world': 'object value'};
        var d = self.callRemote('test', 1, 1.5, 'Hello world', L, O);
        d.addCallback(function(result) {
            self.assertEquals(result[0], 1);
            self.assertEquals(result[1], 1.5);
            self.assertEquals(result[2], 'Hello world');
            self.assertEquals(result[3][0], 1);
            self.assertEquals(result[3][1], 1.5);
            self.assertEquals(result[3][2], 'Hello world');
            self.assertEquals(result[4]['hello world'], 'object value');
        });
        return d;
    });

Nevow.Athena.Tests.ClientToServerExceptionResult = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ClientToServerExceptionResult');
Nevow.Athena.Tests.ClientToServerExceptionResult.methods(
    function run(self) {
        var d;
        var s = 'This exception should appear on the client.';
        d = self.callRemote('testSync', s);
        d.addCallbacks(
            function(result) {
                self.fail('Erroneously received a result: ' + result);
            },
            function(f) {
                var idx = f.error.message.indexOf(s);
                if (idx == -1) {
                    self.fail('Did not find expected message in error message: ' + err);
                }
            });
        return d;
    });

Nevow.Athena.Tests.ClientToServerAsyncExceptionResult = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ClientToServerAsyncExceptionResult');
Nevow.Athena.Tests.ClientToServerAsyncExceptionResult.methods(
    function run(self) {
        var d;
        var s = 'This exception should appear on the client.';
        d = self.callRemote('testAsync', s);
        d.addCallbacks(
            function(result) {
                self.fail('Erroneously received a result: ' + result);
            },
            function(f) {
                var idx = f.error.message.indexOf(s);
                if (idx == -1) {
                    self.fail('Did not find expected message in error message: ' + f.err.message);
                }
            });
        return d;
    });

Nevow.Athena.Tests.ServerToClientArgumentSerialization = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ServerToClientArgumentSerialization');
Nevow.Athena.Tests.ServerToClientArgumentSerialization.methods(
    function run(self) {
        return self.callRemote('test');
    },

    function reverse(self, i, f, s, o) {
        self.assertEquals(i, 1);
        self.assertEquals(f, 1.5);
        self.assertEquals(s, 'hello');
        self.assertEquals(o['world'], 'value');
    });

Nevow.Athena.Tests.ServerToClientResultSerialization = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ServerToClientResultSerialization');
Nevow.Athena.Tests.ServerToClientResultSerialization.methods(
    function run(self) {
        return self.callRemote('test');
    },

    function reverse(self) {
        return [1, 1.5, 'hello', {'world': 'value'}];
    });

Nevow.Athena.Tests.WidgetInATable = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.WidgetInATable');
Nevow.Athena.Tests.WidgetInATable.methods(
    function run(self) {
        // Nothing to do
    });

Nevow.Athena.Tests.WidgetIsATable = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.WidgetIsATable');
Nevow.Athena.Tests.WidgetIsATable.methods(
    function run(self) {
        // Nothing to do
    });

Nevow.Athena.Tests.ChildParentRelationshipTest = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ChildParentRelationshipTest');
Nevow.Athena.Tests.ChildParentRelationshipTest.methods(
    function checkParent(self, proposedParent) {
        self.assertEquals(self.widgetParent, proposedParent);
    },

    function run(self) {
        var deferredList = function(finalDeferred, counter) {
            if (counter == 0) {
                finalDeferred.callback(null);
            }
            var callback = function(ignored) {
                counter -= 1;
                Divmod.log('test', 'One more down, ' + counter + ' to go.');
                if (counter == 0) {
                    finalDeferred.callback(null);
                }
            };
            return callback;
        };

        var result = self.callRemote('getChildCount');

        result.addCallback(function(count) {
            Divmod.log('test', 'Discovered I have ' + count + ' children');
            var d = new MochiKit.Async.Deferred();
            d.addCallback(function() { self.node.style.border = 'thin solid green'; });
            var cb = deferredList(d, count);
            self.assertEquals(self.childWidgets.length, count);
            for (var i = 0; i < self.childWidgets.length; i++) {
                var childWidget = self.childWidgets[i];
                childWidget.checkParent(self);
                childWidget.run().addCallback(cb).addErrback(function(err) { d.errback(err); });
            }
            return d;
        });
        return result;
    });

Nevow.Athena.Tests.AutomaticClass = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.AutomaticClass');
Nevow.Athena.Tests.AutomaticClass.methods(
    function run(self) {
        // Nothing to do here
    });


Nevow.Athena.Tests.ImportBeforeLiteralJavaScript = Nevow.Athena.Test.TestCase.subclass('Nevow.Athena.Tests.ImportBeforeLiteralJavaScript');
Nevow.Athena.Tests.ImportBeforeLiteralJavaScript.methods(
    function run(self) {
        self.assertEquals(importBeforeLiteralJavaScriptResult, false);
    });
