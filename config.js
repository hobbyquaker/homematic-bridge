var pkg = require('./package.json');
var config = require('yargs')
    .usage(pkg.name + ' ' + pkg.version + '\nUsage: $0 [options]')
    .describe('v', 'possible values: "error", "warn", "info", "debug"')
    .describe('c', 'config file')
    .describe('h', 'show help')
    .alias({
        'h': 'help',
        'v': 'verbosity',
        'c': 'config'

    })
    .default({
        config: 'example.json',
        'web.port': 8000,
        verbosity: 'info'
    })
    .config()
    .version()
    .help('help')
    .argv;

module.exports = config;