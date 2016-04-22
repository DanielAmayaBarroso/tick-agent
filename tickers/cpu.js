var os = require('os');
module.exports = function(callback) {
    callback(null, {
        loadavg: os.loadavg(),
        cpus: os.cpus()
    });
}
