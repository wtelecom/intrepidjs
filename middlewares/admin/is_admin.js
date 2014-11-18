/**
 * @file is_admin.js
 * @namespace Permission check
 * @desc Just admin can pass the middleware
 */

function isAdmin() {
    return function(req, res, next) {
        if (req.user == undefined){
            res.render('accounts/login');
        } else if (req.user.roles.indexOf('admin') === -1){
            res.render('admin/no_permission');
        } else {
            return next();
        }
    };
}

module.exports = isAdmin;
