/**
 * @file index.js
 * @namespace @name angular routes
 * @desc @name angular routes
 */


angular.module('IntrepidJS').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('@iname', {
                    url: '/@iname',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/@iname",
                                controller: '@nameIndexController'
                            }
                    }
                });
        }
    ]
);