// Directive to check if req.user is the author.
angular.module('IntrepidJS').directive('author', [
    'restService',
    function(restService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var isAuthor = function(uid, req_uid) {
                    return String(uid) === String(req_uid);
                };
                var isAdmin = function(roles) {
                    return _.contains(roles, 'admin');
                };
                restService.get({}, apiPrefix + '/info',
                    function(data, status, headers, config) {
                        if (data.user) {
                            if (isAuthor(attrs.author, data.user._id) || isAdmin(data.user.roles)) {
                                element.show();
                            } else {
                                element.hide();
                            }
                        } else {
                            element.hide();
                        }
                    },
                    function(data, status, headers, config) {}
                );
            }
        };
    }
]);