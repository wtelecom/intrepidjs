/**
 * @file admin_socialNetwork_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS socialNetwork elements operations
 */

angular.module('IntrepidJS').controller('AdminSocialNetworkController',
    [
        '$scope',
        'restService',
        'i18n',
        adminSocialNetworkController
    ]
);
function adminSocialNetworkController($scope, restService, i18n) {}