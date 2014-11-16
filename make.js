#!/usr/bin/env node

var cli = require('cli'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    rek = require('rekuire'),
    shell = require('shelljs'),
    fixtures = require('mongodb-fixtures'),
    chalk = require('chalk'),
    settings = rek('/settings');

// Colors Alert
var verbose = chalk.cyan,
prompt = chalk.grey,
info = chalk.green,
data = chalk.grey,
help = chalk.cyan,
warn = chalk.bold.yellow,
debug = chalk.blue,
error = chalk.bold.red;

var progress = 0,
    source = 'https://github.com/wtelecom/intrepidjs-module.git';

cli.parse(null, ['createmodule', 'loaddata']);

cli.main(function (args, options) {
    var modifyFile = function(file, lower, camel) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                return console.error( error( err ) );
            }

            var reLower = new RegExp('@iname', 'g');

            var resultLower = data.replace(reLower, lower);
            var resultCamel = resultLower.replace(/@name/g, camel);

            fs.writeFile(file, resultCamel, 'utf8', function(err) {
                if (err) return console.error( error( err ) );
            });
        });
    };

    var walk = function(dir, lower, camel, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                progress += 0.01;
                cli.progress(progress);
                var file = list[i++];
                if (!file) return done(null, results);
                fileToRead = dir + '/' + file;
                setTimeout(function(){
                    fs.stat(fileToRead, function(err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(fileToRead, lower, camel, function(err, res) {
                                results = results.concat(res);
                                next();
                            });
                        } else {
                            if (path.extname(file) == '.js' || path.extname(file) == '.jade') {
                                modifyFile(fileToRead, lower, camel);
                            }
                            results.push(file);
                            next();
                        }
                    });
                }, 30);
            })();
        });
    };

    var createModule = function(data) {
        var srcPath = process.cwd() + '/src',
            modulePath = process.cwd() + '/modules/' + data[0],
            moduleLowerCase = data[0].toLowerCase(),
            moduleCamelCase = data[0].charAt(0).toUpperCase() + data[0].slice(1);

        if (!shell.which('git')) return console.log( error('Prerequisite not installed: git') );

        fs.exists(modulePath, function (exists) {
            if (exists) {
                console.log( warn('%s module already exists'), data[0]);
            } else {
                progress += 0.1;
                cli.progress(progress);

                shell.exec('git clone ' + source + ' ' + modulePath, function(code, output) {
                    if (code) return console.error(output);

                    progress += 0.1;
                    cli.progress(progress);
                    walk(modulePath, moduleLowerCase, moduleCamelCase, function(err, results) {
                        if (err) {
                            console.error( error(err) );
                        } else {
                            cli.progress(1);
                            console.log( info('%s module created!') , data[0]);
                        }
                    });
                });
            }
        });
    };

    var loadFixture = function(module) {
        var dirFixtures = __dirname + '/modules/' + module + '/data/fixtures';

        var Db = require('mongodb').Db,
            Connection = require('mongodb').Connection,
            Server = require('mongodb').Server;

        var db = new Db(settings.dbSettings.dbName, new Server("localhost", 27017, {}), {safe:false});

        fixtures.load(dirFixtures);
        fixtures.save(db, function(err) {
            db.close();
            if (err) {
                console.error( error(err) );
            } else {
                console.log( info('%s fixtures loaded!') , module);
            }
        });
    };

    if (this.argc && (this.argc > 0 && this.argc < 3)) {
        switch(cli.command) {
            case 'createmodule':
                createModule(args);
                break;
            case 'loaddata':
                loadFixture(args[0]);
                break;
            default:
                console.error( error('Invalid command') +','+ help('commands availables are: createmodule loaddata') );
                break;
        }
    } else {
        switch(cli.command) {
            case 'createmodule':
                console.error( error('Invalid command') +','+ help('createmodule <module_name>') );
                break;
            case 'loaddata':
                console.error( error('Invalid command') +','+ help('loaddata <module_name>') );
                break;
            default:
                console.error( error('Invalid command') +','+ help('commands availables are: createmodule loaddata') );
                break;
        }
    }
});
