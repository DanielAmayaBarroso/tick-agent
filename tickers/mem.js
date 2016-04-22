var os = require('os');
module.exports = function(callback) {
    callback(null, {
        total: os.totalmem(),
        free: os.freemem()
    });
}
