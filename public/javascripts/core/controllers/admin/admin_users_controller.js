/**
 * @file admin_users_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin dashboard operations
 */
angular
    .module('IntrepidJS').controller('AdminUsersController',
        [
            '$scope',
            'restService',
            'i18n',
            adminUsersController
        ]
    );
function adminUsersController($scope, restService, i18n) {
    restService.get(
        {},
        apiPrefix + '/users',
        function(data, status, headers, config) {
            $scope.users = data.users;
        },
        function(data, status, headers, config) {}
    );
    var getRoles = function() {
        restService.get(
            {},
            apiPrefix + '/admin/roles',
            function(data, status, headers, config) {
                $scope.roles = data.roles;
            },
            function(data, status, headers, config) {}
        );
    };
    getRoles();
    $scope.addRole = function (u) {
        if (u.newRole) {
            if (u.roles.indexOf(u.newRole) === -1) {
                u.roles.push(u.newRole);                
                restService.post(u,
                    apiPrefix + '/users/' + u._id + '/update',
                    function(data, status, headers, config) {
                        delete u.newRole;
                        getRoles();
                        u.roles = data.object.roles;
                    },
                    function(data, status, headers, config) {}
                );
                
            }
            
        }    
    };
    $scope.selectRole = function (u, r) {
        u.newRole = r;
        $scope.addRole(u);
    };
    $scope.removeRole = function (u, r) {
        if (u && r) {
            if (u.roles.indexOf(r)+1) {
                u.roles.splice(u.roles.indexOf(r), 1);                
                restService.post(u,
                    apiPrefix + '/users/' + u._id + '/update',
                    function(data, status, headers, config) {
                        getRoles();
                        u.roles = data.object.roles;
                    },
                    function(data, status, headers, config) {}
                );
                
            }
        }    
    };
}