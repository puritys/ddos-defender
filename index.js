//var conf = require("./conf.js");
var spawn = require('child_process').spawn;
var logParser = require('./lib/logParser.js');
var ddos = new (require('./lib/ddos.js'));
var iptables =require('./lib/iptables.js');
var accessLogs = [];
var child, args;
var Q = require('q');
var php = require('phplike/module');


if (process.argc < 3) {
    console.log("Example: sudo node index.js conf.js");
    process.exit();
}

if (process.argv[2].indexOf('/') != 0) {
    process.argv[2] = './' + process.argv[2];
}
var config = require(process.argv[2]);
if (config.blockRule) {
    ddos.setRule(config.blockRule);
}
config.logFiles.map(function (file) {
    accessLogs.push(file);
});

args = ["-f"];
for (var index in accessLogs) {
    args.push(accessLogs[index]);
}

iptables.init();
// tail -f file1 file2 ...
child = spawn ('tail', args);

child.stdout.on ('data', function (data)
{
    var passedPaths = config.skipPaths, skipIps = ["127.0.0.1"];
    var ret = logParser(data.toString());
    if (!ret) return "";
    var promise = [];
    if (config.skipIps) {
        skipIps = config.skipIps;
    }
    ret.map(function (req) {
        for (var i in passedPaths) {
            if (req.path.indexOf(passedPaths[i]) === 0) {
                return "";
            }
        }
        for (var i in skipIps) {
            if (req.ip.indexOf(skipIps[i]) === 0) {
                console.log("test skip");
                return "";
            }
        }

        //ddos.isReject(req);
        if (req.protocol.toLowerCase() === "post") {
            promise.push(function () {
                var deferred = Q.defer();
                ddos.shouldReject(req)
                .then(function (ret) {
                    if (ret === true) {
                        iptables.reject(req.ip).then(function (rejRet) {
                            if (rejRet === true) console.log('Block this ip: ' + req.ip);
                        });
                    }
                    deferred.resolve(ret);
                });
                return deferred.promise;
            });
        }
    });
    promise.reduce(function(qp, func) {
        return qp.then(func);
    }, Q());
    console.log ( ret);

});

child.stderr.on ('data', function (data)
{
    console.log ('Error: ' + data.toString());
});

