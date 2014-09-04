/**
 * Main settings.
 */


// Node port
exports.port = 8000;

// Root path
var rootPath = process.cwd();
exports.rootPath = rootPath;

// Secret app key
exports.secret = 'P3p34rne5T0y43st4aqU1y4T0d0sv4aC0mb4t1r';

// API version
exports.apiPrefix = '/api/v1';

// Paths
// Libs path
exports.libsPath = rootPath + '/libs/';
// Middlewares path
exports.middlewaresPath = rootPath + '/middlewares/';
// // Models path
exports.modelsPath = rootPath + '/data/models/';
// // Schemas path
exports.schemasPath = rootPath + '/data/schemas/';
// // Views path
exports.viewsPath = rootPath + '/views/';
// Modules path
exports.modulesPath = rootPath + '/modules/';
// Themes path
exports.themesPath = rootPath + '/public/themes/';
// Files path
exports.filesPath = rootPath + '/public/files/';
// Widgets path
exports.widgetsPath = rootPath + '/widgets/';
// Social widgets path
exports.socialwidgetsPath = rootPath + '/widgets/social_widgets/';
// Custom Widgets path
exports.customWidgetsPath = rootPath + '/widgets/custom_widgets/';

// Site settings
exports.site = {
    // Site title
    title: {
        property: 'title',
        content: 'WeTalk'
    },
    // Default theme
    theme: {
        property: 'theme',
        content: 'default'
    },
    default_themes: {
        property: 'default_themes',
        content: ['default', 'modern'],
    },
    sections: {
        property: 'sections',
        content: []
    }
};

// Site static routes
exports.siteRoutes = {
    // Admin route
    admin: {
        route: '/admin'
    },
};

// Modules to load
exports.modules = [
    //'egovernment',
    'measures',
    'forum',
    'meetings',
    'recommendations'
];

// Modules models
exports.models = [];

// Widgets
exports.widgets = {
    // Social widgets
    social: [{
        partials: [],
        name: 'twitter',
        real_name: 'Twitter',
        main_url: null
    }],
    // Custom widgets
    custom: [
        'slider'
    ]
};

// Site static files
exports.styleFiles = null;
exports.jsFiles = null;
exports.staticFiles = function(app) {
    if (!app.locals.styleFiles) {
        app.locals.styleFiles = [];
    }
    if (!app.locals.jsFiles) {
        app.locals.jsFiles = [];
    }
    this.styleFiles = app.locals.styleFiles;
    this.jsFiles = app.locals.jsFiles;
};