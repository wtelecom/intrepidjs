
/**
 * Get platform modules
 */

var validator = require('validator');
var _ = require('underscore');

function formValidation(req, res, next) {
    var data = null;

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

    if (!_.isEmpty(req.body)) {
        data = req.body;
    } else if (!_.isEmpty(req.query.attrs)) {
        data = JSON.parse(req.query.attrs);
    }

    var errors = [];
    for (var index in data){
        switch(data[index].type)
        {
            case 'color':
                if (!validator.isHexColor(data[index].value))
                    errors.push({
                        name: index,
                        message: res.__('Must be a hex color')}
                    );
                break;
            case 'date':
                if (!validator.isDate(data[index].value))
                    errors.push({
                        name: index,
                        message: res.__('Must be a date')}
                    );
                break;
            case 'objectid':
                if (!validator.isObjectId(data[index].value))
                    errors.push({
                        name: index,
                        message: res.__('Must be a ObjectId')}
                    );
                break;
            default:
                validator.toString(data[index].value);
        }
    }

    if (errors.length > 0) {
        console.log(errors);
        res.json({errors: errors});
    } else {
        return next();
    }

}

module.exports = formValidation;