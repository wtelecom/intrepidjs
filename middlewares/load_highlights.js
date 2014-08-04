
/**
 * Get modules highlights
 */

var rek = require('rekuire');
var settings = require('../settings');
var us = require('underscore');

function loadHighlights(req, res, next) {
    function getModulesHighlights(position) {
        var mods = [];
        for (var index in req.objects) {
            try {
                var mSettings = rek('modules/'+ req.objects[index].name + '/settings');
                if (mSettings.highlights) {
                    if (req.objects[index].position) {
                        if (position == req.objects[index].position) {
                            mods.push(
                                {
                                    route: '/' + req.objects[index].name + '/partials/highlights',
                                    position:  req.objects[index].position,
                                    order: req.objects[index].order
                                }
                            );
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
        return us.sortBy(mods, 'order');
    }

    req.highlights_left = getModulesHighlights(1);
    req.highlights_right = getModulesHighlights(2);

    return next();
}

module.exports = loadHighlights;