/**
 * @file admin_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin general operations
 */
// This controller loads the admin interface.
angular.module('IntrepidJS').controller('AdminController',
    [
        '$scope',
        '$state',
        adminController
    ]
);
function adminController($scope, $state) {
    // Function to expand menu children.
    $scope.expand = function (v) {
        var old = $scope[v];
        $scope[v] = !old;
    };
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name == 'admin') {
            $state.transitionTo('admin.dashboard');
        }
    });
}