/**
 * @file app.js
 * @namespace AngularJS Main App
 * AngularJS needs controllers to operate, this file create the main app.
 */

angular.module(
    'WeTalk',
    [
        'ngSanitize',
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

angular.module('WeTalk').run(
    function($permission) {
        $permission.setPermissions(permissionList);
    }
);

var apiPrefix = null,
    permissionList = [],
    user = null;

angular.element(document).ready(function() {
    $.get('/info', function(data) {
        apiPrefix = data.api_prefix;
        user = data.user;
        $.get(apiPrefix + '/perms', function(data) {
            permissionList = data.perms;
            angular.bootstrap(document, ['WeTalk']);
        });
    });
});