
Execute command example
-----------------------
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
    ]
    
};
</pre>
