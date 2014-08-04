
/**
 * Save an element
 */

var _ = require('underscore');
var rek = require('rekuire');
var createOperation = rek('libs/crud_operations/create');
var validator = rek('utils/form_validation');
var postValidatorTreatment = rek('utils/post_validator');
var passportSocketIo = require("passport.socketio");

function createObject(model, data, params, cb) {


    validator(data, function(err) {
        if (!err){
   
            createOperation(model, postValidatorTreatment(data), function(obj){
                if (obj) {
                    model.findById(obj._id)
                    .populate('user_src user_dst', '_id image username')
                    .exec(function(err, msg){
                        passportSocketIo.filterSocketsByUser(params.io, function(user){
                            if (user.logged_in)
                                return user._id.toString() === params.data.user_src || user._id.toString() === params.data.user_dst;
                        }).forEach(function(socket){
                            socket.emit('newChatMessage', msg);
                        });
                        return cb();

                    });

                }
            });
    
        } else {
            return cb(err);
        }
    });

}

module.exports = createObject;
