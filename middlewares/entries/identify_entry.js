
/**
 * Save an element
 */

var settings = require('../../../settings');
var checkURL = require('../../../utils/check_url');

function identifyEntry(req, res, next) {
    var entry = req.body.entry;
    checkURL(entry);
    next();
}

module.exports = identifyEntry;
