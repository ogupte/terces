'use strict';

var jwt = require('jwt-simple');
var path = require('path');
var fs = require('fs');

var KEY_PATH = path.join(process.env.HOME, '.terces');
var cachedKey = null;

function encode (payload, options, key) {
	return jwt.encode(payload, key || getKey(options));
}

function decode (token, options, key) {
	return jwt.decode(token, key || getKey(options));
}

function getKey(options) {
	options = options || {};
	options.path = options.path || KEY_PATH;
	options.forceRead = options.forceRead || false;
	options.nocache = options.nocache || false;

	var key = cachedKey;

	if (options.forceRead || key === null) {
		key = fs.readFileSync(options.path).toString('utf8');
	}

	if (!options.nocache) {
		cachedKey = key;
	}

	return key;
}

function setKey(newkey, options) {
	options = options || {};
	options.path = options.path || KEY_PATH;
	options.nowrite = options.nowrite || false;
	options.nocache = options.nocache || false;
	options.keyFileMode = options.keyFileMode || 0o640;

	if (!options.nocache) {
		cachedKey = newkey;
	}

	if (!options.nowrite) {
		fs.writeFileSync(options.path, newkey, { encoding: 'utf8', mode: options.keyFileMode });
	}
}

module.exports = {
	encode: encode,
	decode: decode,
	setKey: setKey,
	getKey: getKey
};
