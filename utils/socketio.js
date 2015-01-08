
/**
 * Socket.io events manager.
 */

var rek = require('rekuire');
var chat_events = rek('utils/socketio_events/chat');

var passportSocketIo = require("passport.socketio"),
    cookieParser = require('cookie-parser'),
    mainSettings = rek('/settings');

// var checkEntry = require('./check_url');

// module.exports = function(server) {
//     var io = require('socket.io').listen(server);

//     io.sockets.on('connection', function (socket) {
//         // When sockets are ready
//         socket.emit('ready', { status: 'websockets-on' });

//         // When entry has been added
//         socket.on('entry-added', function (data) {
//             // Check entry type
//             var type = checkEntry(data.entry);

//             // Return checked data
//             socket.emit('entry-checked', {
//                 entry: data.entry,
//                 type: type.type
//             });
//         });
//     });
// };


module.exports = function(server, redisStore, redisClient) {
    var io = require('socket.io').listen(server);

    var sessionStore = new redisStore(
        {
            host: 'localhost',
            port: 6379
        }
    );
    io.set('log level', 1);//Reduce log level
    // set authorization for socket.io
    io.set('authorization', passportSocketIo.authorize({
        cookieParser: cookieParser,
        // key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
        secret:      mainSettings.secret,    // the session_secret to parse the cookie
        store:       sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
    }));

    function onAuthorizeSuccess(data, accept){
        console.log('__successful connection to socket.io');

        // The accept-callback still allows us to decide whether to
        // accept the connection or not.
        accept(null, true);
    }

    function onAuthorizeFail(data, message, error, accept){
        if(error)
        throw new Error(message);
        console.log('__failed connection to socket.io:', message);

        // We use this callback to log all of our failed connections.
        // Set true for connect to socket for prevent connection error.
        accept(null, true);
    }

    io.sockets.on('connection', function (socket) {
          // Chat events
        //chat_events(socket, io, redisClient)
        //Load module socketio events
        if (mainSettings.modules.length>0) {
            _.each(mainSettings.modules, function(module) {
                var mSettings = rek('modules/' + module + '/settings');
                if (mSettings.hasSocketIO) {
                    var modSocketIOEvents = require(mSettings.utilsPath + 'socketio_events/index');
                    modSocketIOEvents(socket, io);
                    /*if (_.isEmpty(_.where(mainSettings.modules_sio_events, {module: "opendata"}))) {
                        mainSettings.modules_sio_events.push(
                            {
                                module: module,
                                sio_events: modSocketIOEvents,
                                socket: socket,
                                io: io
                            }
                        );
                    }*/
                }
            });
        }

    });
};