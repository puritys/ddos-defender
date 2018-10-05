//192.1xx.x.x0 [11/Jul/2015:16:02:20 +0800] "GET /xxx/xxx"
module.exports = function (data) {
    if (!data) return "";
    var lines = data.split(/\n/);
    var ret = [];

    lines.map(function (line) {
        if (!line) return "";
        var ip, protocol = "", path = "";
        var matches = line.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
        if (matches) {
            ip = matches[0];
        } else {
            // parse ipv6
            matches = line.match(/([0-9a-z]{1,4}:?){8}/);
            if (matches) {
                ip = matches[0];
            }
        }
        matches = line.match(/(GET|POST|PUT|HEAD) (\/[^\s]*)/);
        if (matches && matches[2]) {
            protocol = matches[1];
            path = matches[2];
        }

        ret.push({
            path: path,
            ip: ip,
            protocol: protocol
        });
    });
    return ret;
};
