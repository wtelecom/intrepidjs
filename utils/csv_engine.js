/**
 * @file csv_engine.js
 * @namespace CSV Engine
 * @desc This module manage CSV operations over streams
 */

var _ = require('underscore'),
    parse = require('csv-parse'),
    transform = require('stream-transform');


exports.parser = function(data, cb) {
    var output = [];
    var parser = parse({delimiter: ','});
    var transformer = transform(
        function(record, callback) {
            setTimeout(function(){
                callback(null, record.join(' ')+'\n');
            }, 500);
        },
        {
            parallel: 10
        });

    parser.on('readable', function() {
        while(record = parser.read()) {
            output.push(record);
        }
    });

    parser.on('finish', function() {
        cb(output);
    });

    data
        .pipe(parser)
        .pipe(transformer);
};

