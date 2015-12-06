#!/usr/bin/env node

'use strict';

var terces = require('../index.js');
var program = require('commander');

program
	.version('1.0.0')
	.option('-k, --key <key>', 'use key string')
	.option('-S, --key-path <path>', 'path to key file, (~/.terces, by default)')
	.option('-D, --dryrun', 'no writes to the filesystem')
	.option('-v, --verbose', 'log extra info to console');


program
	.command('decode <token>')
	.alias('token')
	.description('decode the given JWT token')
	.action(function (token, command) {
		if (command.parent.verbose) {
			console.log('doing a decode...');
		}

		console.log(JSON.stringify(terces.decode(token, {
			path: command.parent.keyPath
		}, command.parent.key)));
		process.exit();
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces decode \'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJlbmRlckBpbG92ZWJlbmRlci5jb20iLCJwYXNzd2QiOiJmb29iYXIifQ.eFqi4A_DGoDxiyUzVEaUdHlU3nU7UNC6fig4ODy1qqo\'');
		process.exit();
	});

program
	.command('encode <JSONData>')
	.alias('payload')
	.description('encode the given JSON payload string')
	.action(function (jsonPayload, command) {
		if (command.parent.verbose) {
			console.log('doing a encode...');
		}

		var payload;
		try {
			payload = JSON.parse(jsonPayload);
		} catch (err) {
			console.log('Unable to parse JSON');
			console.error(err.message);
		}

		console.log(terces.encode(payload, {
			path: command.parent.keyPath
		}, command.parent.key));
		process.exit();
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces encode \'{"email": "bender@ilovebender.com", "passwd": "foobar"}\'');
		process.exit();
	});

program
	.command('set-key <key>')
	.alias('key')
	.description('Set the key value at key-path (~/.terces, by default)')
	.action(function (key, command) {
		if (command.parent.verbose) {
			console.log('Setting key...');
		}

		terces.setkey(key, {
			path: command.parent.keyPath,
			nowrite: command.parent.dryrun
		});
		process.exit();
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces set-key \'mykey\'');
		process.exit();
	});

program
	.command('*', null, { noHelp: true })
	.action(function (commandName, command) {
		console.log('unknown command: ' + commandName);
		program.help()
		process.exit();
	});

program.parse(process.argv);

program.help()
