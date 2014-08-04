var permissionService = angular.module('permService', []);

permissionService.factory('$permission', function ($rootScope, $state) {
    var permissionList;
    var fns = {
        setPermissions: function(permissions) {
            permissionList = permissions;
            $rootScope.$broadcast('permissionsChanged');
        },
        hasPermission: function(permission) {
            permission = permission.trim();
            return _.some(permissionList, function(item) {
                if (_.isString(item))
                    return item.trim() === permission;
            });
        },
        checkRoute: function(permissions, fn) {
            _.each(permissions, function(perm) {
                if (_.isString(perm) && !fns.hasPermission(perm))
                    $state.transitionTo('/');
            });
        }
    };

    return fns;
});