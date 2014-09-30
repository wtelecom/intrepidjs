/**
 * @file check_site_setting.js
 * @namespace Check Site Settings
 * @desc Middleware to check site settings
 */

var _ = require('underscore'),
    rek = require('rekuire'),
    settingModel = rek('data/models/admin/setting'),
    mainModules = rek('/settings').main_modules;

module.exports = function checkSiteSetting(setting) {
    settingModel.exists(
        function(result) {
            if (_.isBoolean(result)) {
                if (!result) {
                    settingModel.create(
                        {
                            main_modules: mainModules,
                            modules: [],
                            themes: [],
                            logo: null
                        },
                        function(err) {
                            if (err) {
                                console.log(err);
                        }
                        console.log('Setting DB entry created');
                    });
                }
            }
        }
    );
};
