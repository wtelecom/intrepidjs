
/**
 * Chat events manager.
 */

var rek = require('rekuire');
var messageModel = rek('data/models/chat/message');
var accountModel = rek('../../data/models/user/account');
var passportSocketIo = require("passport.socketio");
var create_message = rek('libs/chat/create_message');
var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function(socket, io, redisClient) {
    var meUser = socket.handshake.user;

    // When a socket is connected
    socket.on('userConnect', function (data) {
        // Tell me the users that have in session.
        var key = 'sess:' + data.session;
        redisClient.exists(key, function (err, result) {
            if (result) {
                redisClient.get(key, function (err, session) {
                    var users = [];
                    _.each(JSON.parse(session).chats, function(user) {
                        users.push(ObjectId(user));
                    });
                    // Emit only if you have users in session.
                    if (!_.isEmpty(users)) {
                        accountModel.find({ _id: { $in: users }})
                            .select('username image')
                            .exec(function(err, accounts) {
                                uaccs = {};
                                _.each(accounts, function (acc) {
                                    if (acc._id.toString() != meUser._id)
                                        uaccs[acc._id.toString()] = {
                                            _id: acc._id,
                                            username: acc.username,
                                            image: acc.image,
                                            state: "offline",
                                            read: 0,
                                            unread: 0
                                        };
                                });
                                _.each(io.sockets.sockets, function (user) {
                                    if (user.handshake.user.logged_in && user.handshake.user != meUser)
                                        if (_.has(uaccs, [user.handshake.user._id]))
                                            uaccs[user.handshake.user._id].state = 'online';
                                });
                                // Find read and unread messages
                                messageModel.aggregate(
                                    {
                                        $match: {
                                            $or: [
                                                {
                                                    user_dst: meUser._id,
                                                    user_src: {$in:users},
                                                },
                                                {
                                                    user_dst: {$in:users},
                                                    user_src: meUser._id,
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: {
                                                usrc: '$user_src',
                                                read: '$read'
                                            },
                                            total: {$sum: 1}
                                        }
                                    }
                                ).exec(function(err, msgs) {
                                    var globalMessages = 0;
                                    _.each(msgs, function(group) {
                                        if (group._id.usrc.toString() != meUser._id.toString() && !group._id.read) {
                                            uaccs[group._id.usrc.toString()].unread = group.total;
                                            globalMessages = +group.total;
                                        }
                                        else if (group._id.usrc.toString() != meUser._id.toString() && group._id.read) {
                                            uaccs[group._id.usrc.toString()].read = group.total;
                                        }
                                    });
                                    var data = {
                                        uaccs: uaccs,
                                        nMessages: globalMessages
                                    };
                                    socket.emit('sessionChatUsers', data);
                                });

                            });
                    }
                });
            }
        });

        // Tells the others that have been connected.
        io.sockets.emit('userConnected', meUser._id);
    });

    
    // When someone is disconnected
    socket.on('disconnect', function() {
        io.sockets.emit('userDisconnected', meUser._id);
    });

    // To count how many messages are unread for this couple of users.
    socket.on('checkUnread', function(user) {
        messageModel.aggregate([
            {$match: {
                user_dst: ObjectId(meUser._id),
                user_src: ObjectId(user),
                read: false
            }},
            {$group: {
                _id: "$user_src",
                total: {$sum: 1}
            }}
        ]).exec(function(err, result) {
            socket.emit('numUnreadMsgs', result[0]);
        });
    });


    // Getting user messages
    socket.on('getUserMsgs', function (user) {
        messageModel
        .find({
            $or: [
                {user_src: user._id, user_dst: meUser},
                {user_src: meUser, user_dst: user._id}
            ]
        })
        .sort({created: -1})
        .populate('user_dst user_src', '_id image')
        // .limit(30)
        .exec(function(err, lastMessages) {
            var mu = {
                _id: meUser._id,
                image: meUser.image,
                username: meUser.username,
                unread: 0,
                state: 'online'
            };
            var users = {
                me: mu,
                other: user
            };
            var emitData = {uid:users, lastMessages: lastMessages};
            socket.emit('userMsgs', emitData);
        });
    });

    // Mark read all messages from this couple of users
    socket.on('chatAllRead', function (uid) {
        messageModel.update(
        {
            user_src: uid,
            user_dst: meUser,
            read: false
        },
        {
            read: true
        },
        {
            multi: true
        },
        function(err, result) {
            if (err)
                console.log('Error!!');
            console.log('All messages mark as read.');
        });
    });

    // When someone sent a chat message
    socket.on('sendChatMessage', function (data) {
        var user_src = meUser._id.toString();
        var user_dst = data.user_dst;

        // If user_src and user_dst are equal, do nothing
        if (user_src != user_dst) {
            var chatParams = {
                data: data,
                io: io
            };

            var messageData = {
                user_src: {
                    value: ObjectId(user_src),
                    type: 'objectid'
                },
                user_dst: {
                    value: ObjectId(user_dst),
                    type: 'objectid'
                },
                text: {
                    value: data.message,
                    type: 'text'
                }
            };

            // Check if there are messages betwen this users
            // TODO: Improve this part
            var msgDstSocket = 0;
            passportSocketIo.filterSocketsByUser(io, function(user){
                if (user.logged_in)
                    return user._id.toString()==user_dst;
            }).forEach(function(socket){
                ++msgDstSocket;
            });

            if(msgDstSocket === 0) {
                messageModel
                .find({
                    $or: [
                        {user_src: user_src, user_dst: user_dst},
                        {user_src: user_dst, user_dst: user_src}
                    ]
                })
                .exec(function(err, msgs) {
                    var msgSrc = 0;
                    var msgDst = 0;
                    _.each(msgs, function(msg) {
                        if (msg.user_src == meUser._id.toString())
                            ++msgSrc;
                        else
                            ++msgDst;
                    });
                    if (msgSrc > 0 && msgDst > 0) {
                        create_message(messageModel, messageData, chatParams, function(err) {
                            if (!err)
                                console.log('message saved');
                            else
                                console.log(err);
                        });
                    }
                });
            } else {
                create_message(messageModel, messageData, chatParams, function(err) {
                    if (!err)
                        console.log('message saved');
                    else
                        console.log(err);
                });
            }
        }
    });

    // Mark specific message as read
    socket.on('readMsg', function (msgId) {
        messageModel.findByIdAndUpdate(msgId, { read: true }, function(msg) {
            console.log('message read: ' + msgId);
        });
    });


    // Someone click the chat button user to chat with him.
    socket.on('openChat', function (uid) {
        if (uid != meUser._id) {

            var queryU = {
                $or: [
                    {
                        user_src: meUser._id,
                        user_dst: ObjectId(uid),
                        read:true
                    },
                    {
                        user_src: ObjectId(uid),
                        user_dst: meUser._id,
                        read:true
                    }
                ]
            };
            var query = {
                $or: [
                    { user_src: meUser._id },
                    { user_dst: meUser._id }
                ]
            };
            
            // First, check if the users has chat history.
            messageModel
                .aggregate([
                    { $sort: {created: -1} },
                    { $limit: !uid ? 1 : 30 },
                    { $match: uid ? queryU : query },
                    { $group: { _id: { src: "$user_src" , dst: "$user_dst"}, total: {$sum: 1} }}
                ])
                .exec(function(err, msgs) {
                    if (msgs.length > 1) {
                        // These users have messages. When uid is received.
                        if (msgs[0].total > 0 && msgs[1].total > 0) {
                            passportSocketIo.filterSocketsByUser(io, function(user){
                                if (user.logged_in)
                                    return user._id==meUser._id;
                            }).forEach(function(socket){
                                var isOnline = passportSocketIo.filterSocketsByUser(io, function(user){
                                    if (user.logged_in)
                                        return user._id==uid;
                                }).length;
                                accountModel.findById(ObjectId(uid))
                                .lean(true)
                                .select('username image')
                                .exec(function (err, u) {
                                    u.state = isOnline ? 'online' : 'offline';
                                    socket.emit('openChatUser', u);
                                });
                            });
                        }
                    } else if (msgs.length == 1) {
                        // Openning chat from global button with user
                        var src = msgs[0]._id.src,
                            dst = msgs[0]._id.dst,
                            other = src == String(meUser._id) ? String(dst) : String(src);

                        var isOnline = passportSocketIo.filterSocketsByUser(io, function(user){
                            if (user.logged_in)
                                return user._id==other;
                        }).length;
                        
                        accountModel.findById(other)
                        .lean(true)
                        .select('username image')
                        .exec(function (err, u) {
                            u.state = isOnline ? 'online' : 'offline';
                            socket.emit('openChatUser', u);
                        });

                    } else if (msgs.length === 0 && !uid) {
                        // Openning chat from global button
                        socket.emit('openChatUser', null);
                    } else if (msgs.length === 0 && uid) {
                        // Openning chat from user button whithout messages
                        var isOnline = passportSocketIo.filterSocketsByUser(io, function(user){
                            if (user.logged_in)
                                return user._id==uid;
                        }).length;

                        accountModel.findById(ObjectId(uid))
                        .lean(true)
                        .select('username image')
                        .exec(function (err, u) {
                            u.state = isOnline ? 'online' : 'offline';
                            socket.emit('openChatUser', u);
                        });
                    }
                });
        }
    });
};
