var rek = require('rekuire'),
    settings = rek('/settings'),
    _ = require('underscore');

function loadHorizontalModules(req, res, next) {
    var horizontal_modules = [];

    function getHorizontalModules(){
        var mods = [];
        for (var index in req.objects) {
            try {
                var mSettings = rek('modules/'+ req.objects[index].name + '/settings');
                if (mSettings.horizontal) {
                    if (req.objects[index].position) {
                        mods.push(
                            {
                                route: mSettings.horizontalRoute,
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

        req.objects = mods;    	
        next();
    }
    getHorizontalModules();
}
module.exports=loadHorizontalModules;