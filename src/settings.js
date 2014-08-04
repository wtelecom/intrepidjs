
/**
 * @file settings.js
 * @namespace @name settings
 * @desc Platform @name settings
 */


// Module name
exports.name = '@name';

// Module description
exports.description = '@name module';

// Routes
exports.route_prefix = '@iname';

// Root path
var modulePath = process.cwd() + '/modules/@iname';
exports.modulePath = modulePath;

// Paths
// Middlewares path
exports.middlewaresPath = modulePath + '/middlewares/';
// Models path
exports.modelsPath = modulePath + '/data/models/';
// Schemas path
exports.schemasPath = modulePath + '/data/schemas/';
// Views path
exports.viewsPath = modulePath + '/views/';
// Public path
exports.publicPath = modulePath + '/public/';
// Routes path
exports.routesPath = modulePath + '/routes/';

// Site settings
exports.highlights = true;

// Module actions
exports.actions = [];