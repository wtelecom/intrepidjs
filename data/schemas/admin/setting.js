
/**
 * MongoDB Setting schema
 */

var mongoose = require('mongoose'),
    _ = require('underscore'),
    ObjectId = require("mongoose").Types.ObjectId,
    rek = require('rekuire'),
    settings = rek('/settings');


var settingSchema = new mongoose.Schema({
    main_modules: [
        {
            name: String,
            real_name: String,
            description: String,
            enabled: Boolean,
            kind: []
        }
    ],
    modules: [
        {
            name: String,
            real_name: String,
            actions: [],
            description: String,
            enabled: Boolean,
            position: Number,
            order: Number,
            public: Boolean,
            anonymous: Boolean
        }
    ],
    themes: {
        active: String,
        availables: []
    },
    logo: String
});

module.exports = settingSchema;

settingSchema.statics.exists = function(next) {
    this.findOne()
    .exec(function(err, result) {
        
        if (err) {
            return next(err);
        }

        return next(result ? true : false);
    });
};

settingSchema.statics.getModules = function(enabled, req, next) {
    this.findOne()
    .select('modules')
    .lean()
    .exec(function(err, result) {

        var modules = [];
        
        if (err) {
            return next(err);
        }

        if (result) {
            var modules_length = result.modules.length;
            if (enabled) {
                for (var index = 0; index < modules_length; index ++) {
                    if (result.modules[index].enabled) {
                        modules.push(result.modules[index]);
                    }
                }
            } else {
                for (var index = 0; index < modules_length; index ++) {
                    modules.push(result.modules[index]);
                }
            }
        }
        if (req) {
            req.objects = modules;
            return next();
        } else {
            return next(modules);
        }
    });
};

settingSchema.statics.addModule = function(module, next) {
    this.findOne({}, function (err, result){
        if (err) {
            return next(err);
        }

        if (result) {
            result.modules.push(
                {
                    name: module.name,
                    real_name: module.real_name,
                    description: module.description,
                    actions: module.actions ? module.actions : null,
                    enabled: false,
                    position: null,
                    order: null
                }
            );
            result.markModified('modules');
            result.markModified('actions');
            result.save();
            return next(result);
        }
    });
};

settingSchema.statics.updateModule = function(data, next) {
    this.findOne({}, function (err, result) {
        if (err) {
            return next(err);
        }

        if (result) {
            _.each(result.modules, function(mod) {
                if (mod.name == data.name) {
                    mod.name = data.name;
                    mod.real_name = data.real_name;
                    mod.description = data.description;
                    mod.actions = data.actions;
                }
            });
            
            result.markModified('modules');
            result.markModified('actions');
            result.save();
            return next(result);
        }
    });
};

settingSchema.statics.updateModules = function(req, next) {
    this.findOne({}, function (err, result){
        
        var modules = [];
        
        if (err) {
            return next(err);
        }

        if (result) {

            if (req.body.module) {
                if (result.modules) {
                    var modules_length = result.modules.length;
                    for (var index = 0; index < modules_length; index ++) {
                        if (result.modules[index].name == req.body.module) {
                            var changes = false;
                            for (var property in req.body) {
                                if (_.property(result.modules[index], property)) {
                                    result.modules[index][property] = req.body[property];
                                    changes = true;
                                }
                            }
                            if (changes) {
                                // With this "tells" to Mongoose that the value has changed
                                result.markModified('modules');
                                result.save();
                            }
                        }
                    }
                }
            }
        }
        return next();
    });
};

/**
 * Get availables, active and default themes from settings.
 */
settingSchema.statics.getThemes = function(req, next) {
    this.findOne()
    .select('themes')
    .exec(function(err, result) {

        var themes = [];
        var active = null;
        
        if (err) {
            return next(err);
        }

        if (result) {
            var themes_length = result.themes.availables.length;
            for (var index = 0; index < themes_length; index ++) {
                themes.push(result.themes.availables[index]);
            }
            active = result.themes.active;
        }
        if (req) {
            if (req.method == 'GET') {
                req.objects = themes;
                req.active = active;
                req.default = settings.site.default_themes.content;
            } else if (req.method == 'POST' && req.body.theme) {
                var theme = _.filter(themes, function(th) {
                    return th.name.value == req.body.theme;
                });
                req.theme = theme[0];
            }
            return next();
        } else {
            return next(themes);
        }
    });
};

/**
 * Set the active theme to settings.
 */
settingSchema.statics.activeTheme = function(req, next) {
    this.findOne()
    .select('themes')
    .exec(function(err, result) {

        if (err) {
            return next(err);
        }
        result.themes.active = req.body.theme;
        result.save();
        return next(result.themes.active);
    });
};


/**
 * Get the active theme to settings.
 */
settingSchema.statics.getActiveTheme = function(next) {
    this.findOne()
    .select('themes')
    .exec(function(err, result) {
        if (err) {
            return next(err);
        }
        if (result && result.themes && result.themes.active) {
            next(result.themes.active);
        }
        next();
    });
};


/**
 * Save new/edit theme to settings.
 */
settingSchema.statics.saveTheme = function(req, next) {
    this.findOne()
    .select('themes')
    .exec(function(err, result) {

        if (err) {
            return next(err);
        }
        var deleteIndex = null;
        var nameDefault = _.some(settings.site.default_themes.content, function(theme) {
            return req.body.name.value==theme;
        });
        if (nameDefault) {
            req.body.name.value = req.body.name.value + '_copy';
        }
        _.each(result.themes.availables, function(th, i) {
            if (th.name.value == req.body.name.value) {
                deleteIndex = i;
            }
        });
        if (deleteIndex !== null) {
            result.themes.availables.splice(deleteIndex, 1);
        }
        result.themes.availables.push(req.body);
        result.save();


        return next();
    });
};