/**
 * Middleware to load site params
 */

module.exports = function loadSiteParams(app, settings) {

    function extractAndSetSiteParms() {
        for (var key in settings.site) {
            if (settings.site.hasOwnProperty(key)) {
                var name = settings.site[key].property;
                app.locals[name] = settings.site[key].content;
            }
        }
    }

    extractAndSetSiteParms();
};
