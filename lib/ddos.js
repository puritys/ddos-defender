/*

It will save the request times of ip in the redis db.

The record key is the value of ip. 
The record value is last request time + request times + status , like "1223000,10,1"

Status: 
 0: allow
 1: deny

*/
var redis = require('redis');
var client = redis.createClient();
var Q = require('q');
var smallestTimeGap = 60 * 1000;  // 60 seconds, each gap time of request will be counted.
var blockLimit = 5; //block ip, if the ip request how many times within xx seconds?

function ddos() {

}

var o = ddos.prototype;

/**
 * @param info object {ip: "xxx", procotol: "xxx"}
 */
o.shouldReject = function (info) {
    var deferred = Q.defer();
    this.getRecord(info.ip)
        .then(function (ret) {
            //console.log(ret);
            var lastTime, times, now, status, result = false;
            lastTime  = ret[0];
            status = ret[2];
            if (status == 1) result = false;
            times = ret[1];
            now = (new Date()).getTime();
            if ((lastTime +86400000 ) > now && times >= blockLimit) {
                result = true;
            }
            deferred.resolve(result);
        });
    return deferred.promise;
};

o.saveRecord = function () {

};

o.getRecord = function (key) {
    var deferred = Q.defer();
//    Q.nfcall(client.get, key)
    client.get(key, function (error, val) {
        var record, t, newRecord, reqTimes, lastTime;
        if (error) {
            deferred.reject(error);
        } else {
            if (typeof(val) === "undefined" || !val ) {
                val = "0,0,0";
            }
            record = val.split(",");
            reqTimes = ++record[1];
            lastTime = parseInt(record[0], 10);
            status = record[2];
            t = (new Date).getTime();
            if ((lastTime + smallestTimeGap) > t) {
                // User post again inside 60 seconds.
                newRecord = t + "," + reqTimes + "," + status;
            } else {
                newRecord = t + ",1," + status;
            }
            client.set(key, newRecord, function () {
               deferred.resolve(newRecord.split(','));
            });
        }
    });
    return deferred.promise;
};

module.exports = ddos;
