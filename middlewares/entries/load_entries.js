
/**
 * Get user's entries
 */

var entryModel = require('../../../data/models/core/entries/entry');
var entryReplyModel = require('../../../data/models/core/entries/entry_reply');

function loadEntries(req, res, next) {
    entryId = req.params.entry_id;
    if (entryId === undefined)
        entryModel.find({}, function(err, entries) {
            if (err) {
                return next(err);
            }
            req.entries = entries;
            next();
        });
    else
        entryModel.find({}, function(err, entry) {
            if (err) {
                return next(err);
            } else {
                entryReplyModel.find({userId: "52529dad0e709b7031fe3282", entryId: entryId}, function(err, entries) {
                    if (err) {
                        return next(err);
                    }
                    req.entry = entry;
                    req.entries = entries;
                    next();
                });
            }
        });
}

module.exports = loadEntries;