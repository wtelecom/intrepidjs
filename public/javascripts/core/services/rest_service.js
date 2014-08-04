/**
 * @file rest_service.js
 * @namespace RESTful services
 * This service manage RESTful operations
 */

var restService = angular.module('RESTservice', []);

restService.factory('restService', function ($rootScope, $http) {
    return {
        get: function(data, relative_url, success_cb, error_cb) {
            $http({method: 'GET', params: data, url: relative_url}).
                success(success_cb).
                error(error_cb);
        },
        post: function(data, relative_url, success_cb, error_cb) {
            $http({method: 'POST', data: data, url: relative_url}).
                success(success_cb).
                error(error_cb);
        },
    };
});