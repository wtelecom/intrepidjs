/**
 * @file app.js
 * @namespace Main module file
 * @desc @name module main methods
 */

var rek = require('rekuire');

/**
  * @desc  Set module ready
  * @param object $app - App instance
  * @param string $module_path - Module path
  * @param string $module_name - Module name
*/
exports.setModuleApp = function(app, module_path, module_name) {
    try {
        var resourcesMiddleware = rek('libs/load_resources');
        resourcesMiddleware(app, module_path + '/public', module_name);
    } catch(err) {
        console.log(err);
    }
    console.log('Module %s loaded', module_name);
};

/**
  * @desc  Loads module sections
  * @param object $app - App instance
  * @param object $module_settings - Module setting instance
*/
exports.setModuleSections = function(app, module_settings) {
    var module_sections = module_settings.sections;
    var section_obj = {
        name: module_settings.name,
        real_name: module_settings.route_prefix,
        route: '/' + module_settings.route_prefix,
        sections: (module_settings.sections ? module_settings.sections : null)
    };

    if (!app.locals.sections) {
        app.locals.sections = [];
        app.locals.sections.push(section_obj);
    } else {
        app.locals.sections.push(section_obj);
    }
};

/**
  * @desc  Set module route
  * @param string $path - Module path
  * @return string - Module routes path
*/
exports.setModuleRoutes = function(path) {
    return path + '/routes';
};