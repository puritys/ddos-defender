module.exports = exports = {
    logFiles: [
        "/var/logs/access", "/var/logs/access2"
    ],
    skipPaths: [
        "/jserror", "/mod_pagespeed"
    ],
    skipIps: [
        "127.0.0.1", "192.168"
    ],
    blockRule: {
        timeBase: {
            limit: 5,   // block this ip if it request 5 times in 60*5 seconds.
            timeGapMs: 60000 // count limit if the request is smaller than 60 seconds of last request.
        }
    }
};
