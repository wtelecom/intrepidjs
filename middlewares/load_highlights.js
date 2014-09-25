
/**
 * Get modules highlights
 */

var rek = require('rekuire'),
    settings = rek('/settings'),
    _ = require('underscore'),
    widgetsModel = rek('data/models/widget/widget');

function loadHighlights(req, res, next) {
    var elements_highlights = [];

    function getModulesHighlights() {
        var mods = [];
        for (var index in req.objects) {
            try {
                var mSettings = rek('modules/'+ req.objects[index].name + '/settings');
                if (mSettings.highlights) {
                    if (req.objects[index].position) {
                        mods.push(
                            {
                                route: '/' + req.objects[index].name + '/partials/highlights',
                                position:  req.objects[index].position,
                                order: req.objects[index].order
                            }
                        );
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        return mods;
    }

    function getWidgetsHighlights() {
        var widgets_list = [];
        widgetsModel.find({enabled: true})
            .exec(function(err, widgets) {
                if (!_.isEmpty(widgets)) {
                    _.each(widgets, function(widget) {
                        if (!_.isNull(widget.position)) {
                            widgets_list.push(
                                {
                                    route: '/widget/' + widget.parent + '/partials/highlights',
                                    position: widget.position,
                                    order: widget.position
                                }
                            );
                        }
                    });
                }
                
                var modules_highlights = getModulesHighlights();

                elements_highlights = modules_highlights.concat(widgets_list);
                req.highlights_center = _.sortBy(_.filter(elements_highlights, function(el) {
                    if (el.position === 0)
                        return true;
                    return false;

                }), 'order');
                req.highlights_left = _.sortBy(_.filter(elements_highlights, function(el) {
                    if (el.position == 1)
                        return true;
                    return false;

                }), 'order');
                req.highlights_right = _.sortBy(_.filter(elements_highlights, function(el) {
                    if (el.position == 2)
                        return true;
                    return false;

                }), 'order');
                return next();
            });
    }

    getWidgetsHighlights();
}

module.exports = loadHighlights;