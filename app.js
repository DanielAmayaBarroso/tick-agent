'use strict';

var fs = require('fs');
var os = require('os');
var async = require('neo-async');
var config = require(__dirname + '/config.js');
var tickers = {};
var sockets = [];
var tickersDir = __dirname + '/tickers';

// load tick modules synchronous
var loadTickers = function() {
    var files = fs.readdirSync(tickersDir);
    files.forEach(function(file) {
        var fileParts = file.split('.');
        tickers[fileParts[0]] = require(tickersDir + '/' + file);
    });
};


var loadSockets = function() {
    config.servers.forEach(function(server) {
        var socket = require('socket.io-client')(server);
        sockets.push(socket);
        socket.on('connect', function(data){
            console.log('connect', data);
        });
    });
};


var TICK = function () {
    async.parallel(tickers, function(err, tickData) {
        sendTick(tickData);
    });
};


var sendTick = function(tickData) {
    var debug = require('debut')('tk:tick');
    // core tick
    tickData.machine = {
        host: os.hostname(),
        platform: os.platform()
    }

    async.each(sockets, function(socket, callback) {
        socket.emit('tick', tickData);
        callback(null);
    }, function() {
        debug('tick done', tickData);
    });
};


// INIT
loadTickers();
loadSockets();
setInterval(TICK, 1000);
