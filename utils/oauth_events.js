module.exports = function() {

    // Before showing authorization page, make sure the user is logged in
    myOAP.on('enforce_login', function(req, res, authorize_url, next) {
        if(req.session.user) {
            next(req.session.user);
        } else {
            res.writeHead(303, {Location: '/login?next=' + encodeURIComponent(authorize_url)});
            res.end();
        }
    });

    // Render the authorize form with the submission URL
    // Use two submit buttons named "allow" and "deny" for the user's choice
    myOAP.on('authorize_form', function(req, res, client_id, authorize_url) {
        res.end(
            '<html>this app wants to access your account... <form method="post" action="' +
            authorize_url +
            '"><button name="allow">Allow</button><button name="deny">Deny</button></form>'
        );
    });

    // Save the generated grant code for the current user
    myOAP.on('save_grant', function(req, client_id, code, next) {
        if(!(req.session.user in myGrants))
            myGrants[req.session.user] = {};

        myGrants[req.session.user][client_id] = code;
        next();
    });

    // Remove the grant when the access token has been sent
    myOAP.on('remove_grant', function(user_id, client_id, code) {
        if(myGrants[user_id] && myGrants[user_id][client_id])
            delete myGrants[user_id][client_id];
    });

    // Find the user for a particular grant
    myOAP.on('lookup_grant', function(client_id, client_secret, code, next) {
        // Verify that client id/secret pair are valid
        if(client_id in myClients && myClients[client_id] == client_secret) {
            for(var user in myGrants) {
                var clients = myGrants[user];

                if(clients[client_id] && clients[client_id] == code)
                    return next(null, user);
            }
        }

        next(new Error('no such grant found'));
    });

    // Embed an opaque value in the generated access token
    myOAP.on('create_access_token', function(user_id, client_id, next) {
        // Can be any data type or null
        var extra_data = 'blah';
        // var oauth_params = {token_type: 'bearer'};

        next(extra_data/*, oauth_params*/);
    });

    // (Optional) Do something with the generated access token
    myOAP.on('save_access_token', function(user_id, client_id, access_token) {
        console.log('saving access token %s for user_id=%s client_id=%s', JSON.stringify(access_token), user_id, client_id);
    });

    // An access token was received in a URL query string parameter or HTTP header
    myOAP.on('access_token', function(req, token, next) {
        // 10 minutes
        var TOKEN_TTL = 10 * 60 * 1000;

        if(token.grant_date.getTime() + TOKEN_TTL > Date.now()) {
            req.session.user = token.user_id;
            req.session.data = token.extra_data;
        } else {
            console.warn('access token for user %s has expired', token.user_id);
        }

        next();
    });

    // (Optional) Client authentication (xAuth) for trusted clients
    myOAP.on('client_auth', function(client_id, client_secret, username, password, next) {
        if(client_id == '1' && username == 'guest') {
            var user_id = '1337';
            return next(null, user_id);
        }

        return next(new Error('client authentication denied'));
    });

};
