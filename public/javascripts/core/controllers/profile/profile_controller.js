/**
 * @file profile_controller.js
 * @namespace Profile Controller
 * This module manage AngularJS profile operations
 */


 // This controller loads the profile interface.
angular.module('IntrepidJS').controller('ProfileController',
    [
        '$scope',
        '$state',
        profileController
    ]
);

function profileController($scope, $state) {
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if (toState.name == 'profile') {
            $state.transitionTo('profile.detail');
        }
    });
}