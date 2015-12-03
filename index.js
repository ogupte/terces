'use strict';

var jwt = require('jwt-simple');
var path = require('path');
var fs = require('fs');

var SECRET_PATH = path.join(process.env.HOME, '.terces');
var cachedSecret = null;

function encode (payload, options) {
	return jwt.encode(payload, getSecret(options));
}

function decode (token, options) {
	return jwt.decode(token, getSecret(options));
}

function getSecret(options) {
	options = options || {};
	options.path = options.path || SECRET_PATH;
	options.forceRead = options.forceRead || false;
	options.nocache = options.nocache || false;

	var secret = cachedSecret;

	if (options.forceRead || secret === null) {
		secret = fs.readFileSync(options.path).toString('utf8');
	}

	if (!options.nocache) {
		cachedSecret = secret;
	}

	return secret;
}

function setSecret(newsecret, options) {
	options = options || {};
	options.path = options.path || SECRET_PATH;
	options.nowrite = options.nowrite || false;
	options.nocache = options.nocache || false;
	options.secretFileMode = options.secretFileMode || 0o640;

	if (!options.nocache) {
		cachedSecret = newsecret;
	}

	if (!options.nowrite) {
		fs.writeFileSync(options.path, newsecret, { encoding: 'utf8', mode: options.secretFileMode });
	}
}

module.exports = {
	encode: encode,
	decode: decode,
	setSecret: setSecret,
	getSecret: getSecret
};
