#!/usr/bin/env node

var cli = require('cli'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    rek = require('rekuire'),
    shell = require('shelljs'),
    fixtures = require('mongodb-fixtures'),
    colors = require('colors'),
    settings = rek('/settings');

colors.setTheme({
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});
    
var progress = 0,
    source = 'https://github.com/wtelecom/intrepidjs-module.git';

cli.parse(null, ['createmodule', 'loaddata']);

cli.main(function (args, options) {
    var modifyFile = function(file, lower, camel) {
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                return console.error(err.error);
            }

            var reLower = new RegExp('@iname', 'g');

            var resultLower = data.replace(reLower, lower);
            var resultCamel = resultLower.replace(/(@name)\b/g, camel);

            fs.writeFile(file, resultCamel, 'utf8', function(err) {
                if (err) return console.error(err.error);
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

        if (!shell.which('git')) return console.log(chalk.red('Prerequisite not installed: git'));

        fs.exists(modulePath, function (exists) {
            if (exists) {
                console.log('%s module already exists'.warn, data[0]);
            } else {
                progress += 0.1;
                cli.progress(progress);

                shell.exec('git clone ' + source + ' ' + modulePath, function(code, output) {
                    if (code) return console.error(output);

                    progress += 0.1;
                    cli.progress(progress);
                    walk(modulePath, moduleLowerCase, moduleCamelCase, function(err, results) {
                        if (err) {
                            console.error(err.error);
                        } else {
                            cli.progress(1);
                            console.log('%s module created!'.info, data[0]);
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
                console.error(err.error);
            } else {
                console.log('%s fixtures loaded!'.info, module);
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
                console.error('Invalid command'.error + ', commands availables are: createmodule loaddata'.help);
                break;
        }
    } else {
        switch(cli.command) {
            case 'createmodule':
                console.error('Invalid command'.error + ', createmodule <module_name>'.help);
                break;
            case 'loaddata':
                console.error('Invalid command'.error + ', loaddata <module_name>'.help);
                break;
            default:
                console.error('Invalid command'.error + ', commands availables are: createmodule loaddata'.help);
                break;
        }
    }
});
