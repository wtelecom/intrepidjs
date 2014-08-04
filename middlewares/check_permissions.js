
/**
 * Save an element
 */

var _ = require('underscore');
var rek = require('rekuire');

function checkPermissions(permissions) {
    return function checkPermissions(req, res, next) {
        _.each(permissions, function(perm) {
            if (req.user) {
                if (_.contains(req.user.roles, perm))
                {
                    next();
                } else {
                    res.json(
                        {
                            success: false
                        }
                    );
                }
            } else {
                res.json(
                    {
                        success: false
                    }
                );
            }
        });
    };
}

module.exports = checkPermissions;
