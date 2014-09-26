/**
 * @file controller.js
 * @namespace Twitter widget controller
 * @desc Controller to load twitter widgets
 */

/**
 * @desc  Twitter timeline widget controller
 * @param object $scope - The controller scope var
 */
angular.module('IntrepidJS').controller('TwitterTimelineController',
    [
        '$scope',
        '$state',
        'restService',
        '$window',
        function ($scope, $state, restService, $window) {
            $scope.formData = {};
            restService.get(
                {
                    attrs: {
                            name: {
                                value: 'timeline',
                                type: 'text'
                            }
                        },
                },
                apiPrefix + '/widget/twitter/timeline',
                function(data, status, headers, config) {
                    if (data.success) {
                        if (!_.isEmpty(data.widgets)) {
                            var d_timeline = _.first(data.widgets);
                            $scope.formData.username = d_timeline.fields.username;
                            $scope.formData.widget_id = d_timeline.fields.widgetid;
                            $scope.enabled = d_timeline.enabled;
                            $scope.$watch(
                                function () { return $scope.enabled; },
                                function (vnew, vold) {
                                    if (vnew != vold) {
                                        var formData = {};

                                        formData.enabled = {
                                            value: vnew,
                                            type: 'boolean'
                                        };
                                        if ($scope.formData.username && $scope.formData.widget_id) {
                                            restService.post(formData, apiPrefix + '/widget/twitter/timeline',
                                                function(data, status, headers, config) {
                                                    if (data.success) {
                                                        // $scope.enabled = vnew;
                                                        $window.location.reload();
                                                    }
                                                },
                                                function(data, status, headers, config) {

                                                }
                                            );
                                        }
                                    }
                            }, true);
                        }
                    }
                },
                function(data, status, headers, config) {

                }
            );



            $scope.validator = function() {
                var formData = {};

                formData.type = {
                    value: 'social',
                    type: 'text'
                };

                formData.parent = {
                    value: 'twitter',
                    type: 'text'
                };

                formData.name = {
                    value: 'timeline',
                    type: 'text'
                };

                formData.real_name = {
                    value: 'Twitter timeline',
                    type: 'text'
                };

                formData.header = {
                    value: null,
                    type: 'boolean'
                };

                formData.fields = {
                    value: {
                        username: $scope.formData.username,
                        widgetid: $scope.formData.widget_id
                    },
                    type: 'array'
                };

                restService.post(formData, apiPrefix + '/widget/twitter/timeline',
                    function(data, status, headers, config) {
                        if (data.success) {
                            
                        }
                    },
                    function(data, status, headers, config) {

                    }
                );
            };
        }
    ]
);

/**
 * @desc  Twitter highlight controller
 * @param object $scope - The controller scope var
 */
angular.module('IntrepidJS').controller('TwitterHighlightController',
    [
        '$scope',
        function ($scope) {
        }
    ]
);