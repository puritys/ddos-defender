DDOS Defender
=============

cloudflare ip //173.245.48.188

NPM: https://www.npmjs.com/package/ddos-defender

Please install the redis server first. The library DDOS-defender will use redis to be a storage.


Execute command example
-----------------------

* sudo redis-server  (Start redis) (install redis first sudo yum install redis)
* sudo npm install -g ddos-defender
* sudo ddos-defender conf.js

<br />

conf.js example
-----------------

<pre>
module.exports = exports = {

    logFiles: [
        "/var/logs/access"
    ],
    skipPaths: [
        "/jserror", "/mod_pagespeed", "/login.php"
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
</pre>

The Real Case to block the bad guy
-------------------------------
<pre>
27.17.252.118 - [25/Sep/2015:15:54:50 +0800] 138749 "POST /plus/mytag_js.php?aid=511348 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:15:54:55 +0800] 119813 "POST /plus/mytag_js.php?aid=9527 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:15:55:00 +0800] 467474 "POST /plus/mytag_js.php?aid=8080 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:15:55:01 +0800] 64891 "POST /plus/mytag_js.php?aid=9191 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:22:18:11 +0800] 63459 "POST /plus/mytag_js.php?aid=9527 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:22:18:11 +0800] 77964 "POST /plus/mytag_j.php?aid=6022 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:22:18:13 +0800] 113189 "POST /plus/mytag_js.php?aid=9191 HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:22:18:13 +0800] 64418 "POST /include/code/mp.php HTTP/1.1" 200 > 54424 "-" "-"
27.17.252.118 - [25/Sep/2015:22:18:14 +0800] 114088 "POST /include/helpers/cookie.helpea.php HTTP/1.1" 200 > 54424 "-" "-"
</pre>

* sudo iptables -L
<pre>
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
LOG_REJECT  tcp  --  115.135.167.113      anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.149.97       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  MXJK.JIN-KUI.COM     anywhere             tcp dpt:http
LOG_REJECT  tcp  --  146.185.234.48       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.152.239      anywhere             tcp dpt:http
LOG_REJECT  tcp  --  ohmyweb1.ohmyweb.fr  anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.145.212      anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.148.20       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.148.67       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.159.92       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  27.17.252.118        anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.148.96       anywhere             tcp dpt:http
LOG_REJECT  tcp  --  123.182.146.166      anywhere             tcp dpt:http
ACCEPT      tcp  --  anywhere             anywhere             tcp dpt:http
</pre>
