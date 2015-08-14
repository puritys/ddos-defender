//192.1xx.x.x0 [11/Jul/2015:16:02:20 +0800] "GET /xxx/xxx"
module.exports = function (data) {
    if (!data) return "";
    var lines = data.split(/\n/);
    var ret = [];

    lines.map(function (line) {
        if (!line) return "";
        var ip, protocol = "";
        var matches = line.match(/^[0-9\.]+/);
        if (matches) {
            ip = matches[0];
        }
        matches = line.match(/([a-zA-Z]+)[\s]\//);
        if (matches && matches[1]) {
            protocol = matches[1];
        }
        ret.push({
            ip: ip,
            protocol: protocol
        });
    });
    return ret;
};
