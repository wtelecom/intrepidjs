/**
 * Twitter widget settings
 */


// Widget name
exports.name = 'Twitter';

// Module description
exports.description = 'Twitter widget';


// Route prefix
exports.route_prefix = 'twitter';

// Root path
var widgetPath = process.cwd() + '/widgets/social_widgets/twitter';
exports.widgetPath = widgetPath;

// Paths
// Middlewares path
exports.middlewaresPath = widgetPath + '/middlewares/';
// Models path
exports.modelsPath = widgetPath + '/data/models/';
// Schemas path
exports.schemasPath = widgetPath + '/data/schemas/';
// Views path
exports.viewsPath = widgetPath + '/views/';
// Public path
exports.publicPath = widgetPath + '/public/';
// Routes path
exports.routesPath = widgetPath + '/routes/';