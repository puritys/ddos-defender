var php = require('phplike/module');
var child = require('child_process');
var Q = require('q');
var lockedIps = {};

function init(ip) {
    php.exec("sudo iptables -F");
    php.exec("sudo iptables -N LOG_REJECT");
    php.exec("sudo iptables -A LOG_REJECT -j LOG --log-prefix \"INPUT:REJECT: \" --log-level 6");
    php.exec("sudo iptables -A LOG_REJECT -j REJECT");
    php.exec("sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT");
}

function reject(ip) {
    var q = Q.defer();
    if (lockedIps[ip]) {
        q.resolve(false);
        return false;
    }

    lockedIps[ip] = (new Date()).getTime();
    var cmd = "sudo iptables -I INPUT 1 -s " + ip +" -p tcp --dport 80 -j LOG_REJECT";
    child.exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        q.resolve(true);
    });
    return q.promise; 
}

function exec(cmd) {
    var q = Q.defer();
    child.exec(cmd, function () {
        q.resolve();
    })
    return q.promise;
}

exports.init = init;
exports.reject = reject;
