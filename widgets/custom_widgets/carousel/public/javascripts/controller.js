/**
 * @file controller.js
 * @namespace Twitter widget controller
 * @desc Controller to load twitter widgets
 */

/**
 * @desc  Twitter timeline widget controller
 * @param object $scope - The controller scope var
 */
angular.module('IntrepidJS').controller('UICarouselController',
    [
        '$scope',
        '$state',
        'restService',
        'fileReader',
        '$upload',
        '$window',
        function ($scope, $state, restService, fileReader, $upload, $window) {

            // Beauty upload button
            $('input[type=file]').bootstrapFileInput();

            var hasFile = false;

            $scope.selectedFiles = [];

            $scope.images = [];

            // File events
            $scope.onFileSelect = function($files) {
                $scope.selectedFiles.push(_.first($files));
                if ($scope.selectedFiles.length === 3) {
                    hasFile = true;
                }
            };

            $scope.readFile = function () {
                fileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                });
            };

            $scope.formData = {};
            restService.get(
                {
                    attrs: {
                            name: {
                                value: 'carousel',
                                type: 'text'
                            }
                        },
                },
                apiPrefix + '/widget/carousel/detail',
                function(data, status, headers, config) {
                    if (data.success) {
                        if (!_.isEmpty(data.widgets)) {

                            var d_carousel = _.first(data.widgets);
                            $scope.enabled = d_carousel.enabled;

                            $scope.$watch(
                                function () { return $scope.enabled; },
                                function (vnew, vold) {
                                    if (vnew != vold) {
                                        var formData = {};

                                        formData.enabled = {
                                            value: vnew,
                                            type: 'boolean'
                                        };
                                        
                                        restService.post(formData, apiPrefix + '/widget/carousel/detail',
                                            function(data, status, headers, config) {
                                                if (data.success) {
                                                    
                                                    $window.location.reload();
                                                    // $scope.enabled = vnew;
                                                }
                                            },
                                            function(data, status, headers, config) {

                                            }
                                        );
                                    }
                            }, true);

                            $scope.images = d_carousel.fields;
                            if (d_carousel.fields.length === 3) {
                                hasFile = true;
                            }
                        }
                    }
                },
                function(data, status, headers, config) {

                }
            );


            $scope.validator = function() {
                var formData = {};

                formData.type = {
                    value: 'custom',
                    type: 'text'
                };

                formData.parent = {
                    value: 'carousel',
                    type: 'text'
                };

                formData.name = {
                    value: 'carousel',
                    type: 'text'
                };

                formData.real_name = {
                    value: 'Carousel',
                    type: 'text'
                };

                if (hasFile) {
                    $scope.upload = $upload.upload({
                        url: apiPrefix + '/widget/carousel/detail',
                        data: formData,
                        file: $scope.selectedFiles
                    }).success(function(data, status, headers, config) {
                        if (data.success) {
                            $scope.selectedFiles = [];
                        }
                    });
                } else if (_.isEmpty($scope.selectedFiles)) {
                    restService.post(formData, apiPrefix + '/widget/carousel/detail',
                        function(data, status, headers, config) {
                            if (data.success) {
                                
                            }
                        },
                        function(data, status, headers, config) {

                        }
                    );
                }
            };
        }
    ]
);

/**
 * @desc  Twitter highlight controller
 * @param object $scope - The controller scope var
 */
angular.module('IntrepidJS').controller('CarouselHighlightController',
    [
        '$scope',
        'restService',
        function ($scope, restService) {
            $scope.images = [];
            restService.get(
                {
                    attrs: {
                            name: {
                                value: 'carousel',
                                type: 'text'
                            }
                        },
                },
                apiPrefix + '/widget/carousel/detail',
                function(data, status, headers, config) {
                    if (data.success) {
                        if (!_.isEmpty(data.widgets)) {
                            var d_carousel = _.first(data.widgets);
                            $scope.images = d_carousel.fields;
                            setTimeout(function() {
                                $('#carousel-home').carousel({
                                    interval: 5000
                                });
                            }, 0);
                        }
                    }
                },
                function(data, status, headers, config) {

                }
            );
        }
    ]
);