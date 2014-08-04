
/**
 * Compile sass to css -> Create a theme stylesheet
 */

var settings = require('../../settings');
var exec = require('child_process').exec;
var fs = require('fs');
var rootPath = settings.rootPath;

function compileSass(req, res, next) {
    var name = req.body.name.value;
    var theme_vars_file = rootPath + '/public/vendor/bootflat/scss/bootflat/_theme_vars.scss';
    var inputFile = rootPath + '/public/vendor/bootflat/scss/bootflat.scss';
    var themesDir = rootPath + '/public/themes/';
    var outDir = themesDir + name + '/';
    var outputFile = outDir + 'style.css';

    // Set vars into theme_vars.scss file
    data = "";
    for (var v in req.body) {
        if (v != 'name' && req.body[v].value){
            str = "$" + v + ": " + req.body[v].value + "; \n";
            data = data + str;
        }
    }
    fs.writeFile(theme_vars_file, data, function(err){
        if (err)
            console.log('writefile _theme_vars.scss error: ' + err);
        else {

            // Make style dir if doesn't exists and compile
            if (!fs.existsSync(outDir)) {
                console.log('Creating directory');
                fs.mkdir(outDir, '0755', function(err){
                    if (err)
                        console.log('mkdir error: ' + err);
                    comp(inputFile, outputFile);
                });
            }
            else {
                comp(inputFile, outputFile);
            }
            
        }
    });
    return next();
}

function comp(input, output){
    var command = 'sass '+input+' '+output+ ' --style compressed';
    exec(command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

module.exports = compileSass;
