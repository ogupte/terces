# terces

A library and CLI tool to encrypt and decrypt sensitive application secrets, and manage
encryption keys.

## Install

To use programatically in your project
```
$ npm install --save terces
```

To use as a CLI tool to manage secret keys an create secret tokens:
```
$ npm install -g terces
```

## How to Use

### terces CLI

```
$ terces

  Usage: terces [options] [command]


  Commands:

    decode|token <token>       decode the given JWT token
    encode|payload <JSONData>  encode the given JSON payload string
    set-key|key <key>          Set the key value at key-path (~/.terces, by default)

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -k, --key <key>        use key string
    -S, --key-path <path>  path to key file, (~/.terces, by default)
    -D, --dryrun           no writes to the filesystem
    -v, --verbose          log extra info to console
```

First, set a key for your host with
```
$ terces set-key <your key>
```
or copy a key from another host. Default path for the key file is `~/.terces` and
the default permissions set is `640`.

Then you'll need to encode your application secrets that you want to consume in your
node project:
```
$ terces encode '{"applicationSecret":"secret12345"}'
```
this command will output a JWT token encoded with your terces key. This token can be
packaged with your application build or set on an ENV variable and then decoded during
run time, where the sensitive, decoded JSON data can be stored in memory.

In you application code import the terces module to decode the token.
```javascript
var terces = require('terces');
var secretData = terces.decode(jwtToken);
secretData.applicationSecret; // 'secret12345';
```
terces.decode will use the key located at `~/.terces` by default, but you target a
different path using 
```
terces.decode(jwtToken, { path: '/etc/terces/mykeyfile' });
```
or if you want to use your own in-memory keyValue, without terces caching it, use
```
terces.decode(jwtToken, { noCache: true }, myKeyValue);
```
...or you can use any JWT library since it's just a valid JWT token. :)_
