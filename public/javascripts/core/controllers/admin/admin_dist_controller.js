/**
 * @file admin_dist_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin distribution operations
 */

// This controller loads the interface needed to make a modules distribution.

angular
    .module('IntrepidJS').controller('AdminDistController',
        [
            '$scope',
            '$templateCache',
            'restService',
            adminDistController        
        ]
    );

function adminDistController($scope, $templateCache, restService) {
    // This array contains all modules
    var all_modules = [];
    // This array contains all social widgets
    var all_social_widgets = [];
    // This array contains all custom widgets
    var all_custom_widgets = [];
    // This array contains all modules enabled
    $scope.modules_availabled = [];
    // This array contains the right modules enabled
    $scope.elements_enabled_right = [];
    // This array contains the left modules enabled
    $scope.elements_enabled_left = [];
     // This array contains the left and right modules enabled
    $scope.elements_enabled_center = [];
    // This array contains all social widgets enabled
    $scope.social_widgets_availabled = [];
    // This array contains all custom widgets enabled
    $scope.custom_widgets_availabled = [];
    // Elements total counts
    var total_modules = 0,
        total_social_widgets = 0,
        total_custom_widgets = 0;
    // Gets all modules enabled
    // Available positions:
    // 1: Left position
    // 2: Right position
    restService.get(
        {},
        apiPrefix + '/admin/modules/?available=true',
        function(data, status, headers, config) {
            if (data.modules) {
                _.each(data.modules, function(module) {
                    module['ui_type'] = 'module';
                    all_modules.push(module);
                });
                
                total_modules = data.modules.length;
            }
            // Gets all widgets enabled
            // Available positions:
            // 1: Left position
            // 2: Right position
            restService.get(
                {
                    attrs: {
                        enabled: {
                            value: true,
                            type: 'boolean'
                        }
                    },
                },
                apiPrefix + '/admin/widgets',
                function(data, status, headers, config) {
                    if (data.success) {
                        if (!_.isEmpty(data.widgets)) {
                            _.each(data.widgets, function(widget) {
                                if (widget.type == 'social') {
                                    widget['ui_type'] = 'social_widget';
                                    all_social_widgets.push(widget);
                                } else {
                                    widget['ui_type'] = 'custom_widget';
                                    all_custom_widgets.push(widget);
                                }
                            });
                            total_social_widgets = all_social_widgets.length;
                            total_custom_widgets = all_custom_widgets.length;
                        }
                        if (all_modules || all_social_widgets || all_custom_widgets)
                            stackElementsInOrder(all_modules.concat(all_social_widgets).concat(all_custom_widgets));
                    }
                },
                function(data, status, headers, config) {
                }
            );
        },
        function(data, status, headers, config) {  
        }
    );

    function stackElementsInOrder(elements) {
        
        _.each(elements, function(el) {
            // Adding left elements
            if (el.position && el.position == 1) {
                $scope.elements_enabled_left.push(el);
                // Adding right elements
            } else if (el.position && el.position == 2) {
                $scope.elements_enabled_right.push(el);
                // Adding center elements
            } else if (el.position === 0) {
                $scope.elements_enabled_center.push(el);
                // Adding availables and not located elements
            } else {
                $scope.modules_availabled = _.reject(all_modules, function(module) {
                    if (_.isNull(module.position)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                $scope.social_widgets_availabled = _.reject(all_social_widgets, function(widget) {
                    if (_.isNull(widget.position)) {
                        return false;
                    } else {
                        return true;
                    }
                });
                $scope.custom_widgets_availabled = _.reject(all_custom_widgets, function(widget) {
                    if (_.isNull(widget.position)) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        });
        
        // Adding empty elements to the available arrays
        if (elements) {
            $scope.elements_enabled_left = get_empty_items($scope.elements_enabled_left, $scope.elements_enabled_left, elements.length);
            $scope.elements_enabled_right = get_empty_items($scope.elements_enabled_right, $scope.elements_enabled_right, elements.length);
            $scope.elements_enabled_center = get_empty_items($scope.elements_enabled_center, $scope.elements_enabled_center, 1);        $scope.modules_availabled = get_empty_items($scope.modules_availabled, $scope.modules_availabled, all_modules.length);
            $scope.social_widgets_availabled = get_empty_items($scope.social_widgets_availabled, $scope.social_widgets_availabled, all_social_widgets.length);
            $scope.custom_widgets_availabled = get_empty_items($scope.custom_widgets_availabled, $scope.custom_widgets_availabled, all_custom_widgets.length);
        }
    }          
    // This function adds empty items to the arrays
    function get_empty_items(src_list, dst_list, total_count) {
        if (src_list.length < total_count) {
            var diff = total_count - src_list.length;
            for (var index = 0; index < diff; index ++) {
                dst_list.push({});
            }
        }
        return _.sortBy(dst_list, 'order');
    }

    $scope.startCallback = function(event, ui, module) {
        $scope.draggedModule = module;
    };

    $scope.dropCallback = function(event, ui, element, order, position) {
        $templateCache.removeAll();
        
        switch(element.ui_type) {
            case "module":
                restService.post(
                    {
                        module: element.name,
                        position: position,
                        order: order
                    },
                    apiPrefix + '/admin/modules/update',
                    function(data, status, headers, config) {},
                    function(data, status, headers, config) {}
                );
                break;
            case "social_widget":
                restService.post(
                    {
                        name: element.name,
                        position: position,
                        order: order
                    },
                    apiPrefix + '/admin/widgets/update',
                    function(data, status, headers, config) {},
                    function(data, status, headers, config) {}
                );
                break;
            case "custom_widget":
                restService.post(
                    {
                        name: element.name,
                        position: position,
                        order: order
                    },
                    apiPrefix + '/admin/widgets/update',
                    function(data, status, headers, config) {},
                    function(data, status, headers, config) {}
                );
                break;
            default:
                break;
        }
    }
};
