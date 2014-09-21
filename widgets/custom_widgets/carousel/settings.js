/**
 * Twitter widget settings
 */


// Widget name
exports.name = 'Carousel';

// Module description
exports.description = 'Images Carousel';


// Route prefix
exports.route_prefix = 'carousel';

// Root path
var widgetPath = process.cwd() + '/widgets/custom_widgets/carousel';
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