/**
 * @file app.js
 * @namespace AngularJS Main App
 * AngularJS needs controllers to operate, this file create the main app.
 */

angular.module(
    'IntrepidJS',
    [
        'ngSanitize',
        // 'ngRoute',
        'ui.router',
        //'ui.bootstrap',
        'i18n',
        'RESTservice',
        'Socketio',
        'ngDragDrop',
        'permService',
        'angular-inview',
        'luegg.directives',
        'toggle-switch',
        'angularFileUpload',
        // 'aj.crop',
        'infinite-scroll',
        // 'angular-medium-editor',
        // 'textAngular'
        'summernote',
        'angular-loading-bar',
        // 'ngICheck'
        'ngDraggable'
    ],
    permissionList
);

var apiPrefix = null,
    permissionList = [],
    user = null,
    lastPath = null;

angular.module('IntrepidJS').run(
    function($permission, $rootScope, $location) {
        $permission.setPermissions(permissionList);
        $rootScope._ = _;
    }
);


angular.element(document).ready(function() {
    $.get('/info', function(data) {
        apiPrefix = data.api_prefix;
        user = data.user;
        $.get(apiPrefix + '/perms', function(data) {
            permissionList = data.perms;
            angular.bootstrap(document, ['IntrepidJS']);
        });
    });
});