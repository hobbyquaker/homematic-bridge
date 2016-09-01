#!/usr/bin/env node

var pkg =               require('./package.json');
var config =            require('./config.js');
var fs =                require('fs');
var log =               require('yalm');
var requirePlugins =    require('require-plugins');

var status = {};

config.hmif = config.hmif || {};

log.setLevel(config.verbosity);
log.info(pkg.name + ' ' + pkg.version + ' starting');

var hmif = require('hmif')(config.hmif, status, log);

function stop() {
    hmif.unsubscribe(function () {
        process.exit(0);
    });
}

var pluginApi = {
    iface: hmif,
    config: config,
    log: log,
    status: status,
    saveConfig: function (conf) {
        delete conf._;
        delete conf['$0'];
        delete conf.help;
        delete conf.version;
        delete conf.h;
        delete conf.v;
        delete conf.c;
        var confFile = conf.config;
        delete conf.config;
        config = conf;
        fs.writeFile(confFile, JSON.stringify(config, null, '  '), function (err, res) {
            if (err) {
                log.error('saveConfig', err);
            } else {
                log.info('saved config');
                log.debug('saveConfig', config);
            }
            log.setLevel(conf.verbosity);
        });


    },
    restart: stop
};

var plugins = requirePlugins(pluginApi);

plugins['hmbridge-web'].setPlugins(plugins);

process.on('SIGINT', stop);
process.on('SIGTERM', stop);