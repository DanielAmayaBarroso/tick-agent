var ps = require('ps-node');
module.exports = function(callback) {

    // A simple pid lookup
    ps.lookup({
        command: 'node'
    }, function(err, resultList ) {
        if (err) {
            throw new Error( err );
        }

        callback(null, resultList)
    });
}
