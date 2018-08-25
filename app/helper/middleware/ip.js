const geoip = require("geoip-lite");

module.exports = function ip (req, res, next){
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    req.geo = geo && geo.country;
    next()
}