/**
 * @file check_site_setting.js
 * @namespace Check Site Settings
 * @desc Middleware to check site settings
 */

var _ = require('underscore');
var rek = require('rekuire');
var settingModel = rek('data/models/admin/setting');

module.exports = function checkSiteSetting(setting) {
    settingModel.exists(
        function(result) {
            if (_.isBoolean(result)) {
                if (!result) {
                    settingModel.create(
                        {
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
