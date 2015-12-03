#!/usr/bin/env node

'use strict';

var terces = require('../index.js');
var program = require('commander');

program
	.version('1.0.0')
	.option('-s, --secret <secret>', 'secret key string')
	.option('-S, --secret-path <path>', 'path to secret key file')
	.option('-D, --dryrun', 'no writes to the filesystem');


program
	.command('decode <token>')
	.alias('token')
	.description('decode the given JWT token')
	.action(function (token, options) {
		console.log('doing a decode...');
		console.log(terces.decode(token));
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces decode \'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJlbmRlckBpbG92ZWJlbmRlci5jb20iLCJwYXNzd2QiOiJmb29iYXIifQ.eFqi4A_DGoDxiyUzVEaUdHlU3nU7UNC6fig4ODy1qqo\'');
	});

program
	.command('encode <JSONData>')
	.alias('payload')
	.description('encode the given JSON payload string')
	.action(function (jsonPayload, options) {
		console.log('doing a encode...');
		var payload;
		try {
			payload = JSON.parse(jsonPayload);
		} catch (err) {
			console.log('Unable to parse JSON');
			console.error(err.message);
		}
		console.log(JSON.stringify(terces.encode(payload), null, 2));
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces encode \'{"email": "bender@ilovebender.com", "passwd": "foobar"}\'');
	});

program
	.command('set-secret <secret>')
	.alias('secret')
	.description('Set the secret value at ~/.terces')
	.action(function (secret, options) {
		console.log('Setting secret...');
		terces.setSecret(secret);
	})
	.on('--help', function () {
		console.log('Example:');
		console.log();
		console.log('	$ terces set-secret \'mysecret\'');
	});

program
	.command('*')
	.action(function (env) {
		console.log('unknown command: ' + env);
	});

program.parse(process.argv);
