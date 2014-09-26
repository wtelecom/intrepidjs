// App main ng routes

angular.module('IntrepidJS').config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.
                state('/', {
                    url: '/',
                    views: {
                        "main_content":
                            {
                                templateUrl: "/highlights",
                                controller: 'HighLightsController',
                            }
                    }
                });
        }
    ]
);