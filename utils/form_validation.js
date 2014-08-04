
/**
 * Get platform modules
 */

var validator = require('validator'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    i18n = require("i18n");

function formValidation(data, cb) {
    function isObjectId(str){
        if (validator.isHexadecimal(str)) {
            if (str.length === 24)
                return true;
            else
                return false;
        } else {
            return false;
        }
    }
    validator.extend('isObjectId', function (str) {
        return isObjectId(str);
    });

    var errors = [];
    for (var index in data){
        switch(data[index].type)
        {
            case 'color':
                if (!validator.isHexColor(data[index].value))
                    errors.push({
                        name: index,
                        message: i18n.__('Must be a hex color')}
                    );
                break;
            case 'date':
                if (!validator.isDate(data[index].value))
                    errors.push({
                        name: index,
                        message: i18n.__('Must be a date')}
                    );
                break;
            case 'objectid':
                if (!validator.isObjectId(data[index].value))
                    errors.push({
                        name: index,
                        message: i18n.__('Must be a ObjectId')}
                    );
                break;
            case 'base64':
                if (!validator.isBase64(data[index].value))
                    errors.push({
                        name: index,
                        message: i18n.__('Must be a base64')}
                    );
                break;
            case 'array':
                break;
            case 'toArray':
                var pre_values = [];
                _.each(data[index].value.split(','), function(el) {
                    pre_values.push(_s.clean(el));
                });
                data[index].value = pre_values;
                break;
            default:
                validator.toString(data[index].value);
        }
    }

    if (errors.length > 0){
        console.log(errors);
        cb({errors: errors});

    } else {
        return cb();
    }

}

module.exports = formValidation;