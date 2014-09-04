/**
 * @file admin_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin operations
 */

/**
  * @desc  Toggle module state
  * @param bool $module - Set module to change 
  * @param bool $state - Current module state
  * @return array - Modules requested
*/
angular.module('WeTalk').controller('AdminModulesController',
    [
        '$scope',
        '$templateCache',
        'restService',
        'i18n',
        function($scope, $templateCache, restService, i18n) {
            restService.get(
                {},
                '/api/v1/admin/modules/',
                function(data, status, headers, config) {
                    $scope.modules = {};
                    _.each(data.modules, function (m) {
                        $scope.modules[m.name] = m;
                        $scope.modules[m.name].real_name = i18n.__(m.real_name);
                        $scope.$watch(
                            function () { return $scope.modules[m.name].enabled; },
                            function (vnew, vold) {
                                if (vnew != vold) {
                                    restService.post(
                                        {
                                            module: m.name,
                                            enabled: vnew
                                        },
                                        '/api/v1/admin/modules/update',
                                        function(data, status, headers, config) {

                                        },
                                        function(data, status, headers, config) {}
                                    );
                                }
                        }, true);
                    });
                },
                function(data, status, headers, config) {}
            );
        }
    ]
);

// This controller loads the interface needed to make a modules distribution.
angular.module('WeTalk').controller('AdminDistController',
    [
        '$scope',
        '$templateCache',
        'restService',
        function ($scope, $templateCache, restService) {

            // This array contains all modules enabled
            $scope.modules_availabled = [];

            // This array contains the right modules enabled
            $scope.modules_enabled_right = [];

            // This array contains the left modules enabled
            $scope.modules_enabled_left = [];

            // Gets all modules enabled
            // Available positions:
            // 1: Left position
            // 2: Right position
            restService.get(
                {},
                '/api/v1/admin/modules/?available=true',
                function(data, status, headers, config) {
                    if (data.modules) {
                        for (var index in data.modules) {
                            // Adding left modules
                            if (data.modules[index].position && data.modules[index].position == 1) {
                                $scope.modules_enabled_left.push(data.modules[index]);

                            // Adding right modules
                            } else if (data.modules[index].position && data.modules[index].position == 2) {
                                $scope.modules_enabled_right.push(data.modules[index]);

                            // Adding availables and not located modules
                            } else {
                                $scope.modules_availabled.push(data.modules[index]);
                            }
                        }
                    }

                    // Adding empty elements to the available arrays
                    if (data.modules) {
                        $scope.modules_enabled_left = get_empty_items($scope.modules_enabled_left, $scope.modules_enabled_left, data.modules.length);
                        $scope.modules_enabled_right = get_empty_items($scope.modules_enabled_right, $scope.modules_enabled_right, data.modules.length);
                        $scope.modules_availabled = get_empty_items($scope.modules_availabled, $scope.modules_availabled, data.modules.length);
                    }
                },
                function(data, status, headers, config) {
                    
                }
            );
            
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

            $scope.dropCallback = function(event, ui, module, order, position) {
                $templateCache.removeAll();
                restService.post(
                    {
                        module: module.name,
                        position: position,
                        order: order
                    },
                    '/api/v1/admin/modules/update',
                    function(data, status, headers, config) {

                    },
                    function(data, status, headers, config) {}
                );
            };

        }
    ]
);

// This controller loads the interface needed to make a custom style.
angular.module('WeTalk').controller('AdminStyleController',
    [
        '$scope',
        'restService',
        function ($scope, restService) {
            $scope.themes = [];
            $scope.default_themes = [];

            // RegExps
            $scope.text = /^\w*$/;
            $scope.color = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

            // Errors
            $scope.err_text = 'Single word only.';
            $scope.err_color = 'Hexadecimal color only.';
            
            // Default variables
             $scope.defVars = {
                name: {
                    value: 'NewTheme',
                    desc: 'Theme name. This cannot be modified in the future.',
                    type: 'text',
                    pattern: 'text',
                    error: $scope.err_text
                },
                'body-background-color': {
                    value: '#FFFFFF',
                    desc: 'Body background color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'body-font-color': {
                    value: '#434A54',
                    desc: 'Body font color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'link-font-color': {
                    value: '#3BAFDA',
                    desc: 'Links color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'link-font-color-hover': {
                    value: '#3BAFDA',
                    desc: 'Links color hover.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'navbar-background-color': {
                    value: '#FFFFFF',
                    desc: 'Header background color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'navbar-background-color-active': {
                    value: '#FFFFFF',
                    desc: 'Header tab active background color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'navbar-font-color': {
                    value: '#3BAFDA',
                    desc: 'Header font color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                },
                'navbar-item-background-color-hover': {
                    value: '#FFFFFF',
                    desc: 'Tab header hover background color.',
                    type: 'color',
                    pattern: 'color',
                    error: $scope.err_color
                }
            };
            // This var is used by the form to render errors.
            $scope.strkey = "{{key}}";
            // FormData is the preload vars to edit.
            $scope.formData = $scope.defVars;


            // Watch changes in name var for validate.
            var theme_name = $scope.formData.name;
            $scope.$watch('formData.name.value', function(name) {
                // If the name already exists.
                $scope.nameExists = _.some($scope.themes, function(theme) {
                    return name==theme.name.value;
                });
                // If the name is used by a default theme.
                $scope.nameDefault = _.some($scope.default_themes, function(theme) {
                    return name==theme;
                });
            });

            
            // Get themes from mongodb
            restService.get(
                {},
                '/api/v1/admin/themes',
                function(data, status, headers, config) {
                    $scope.themes = data.themes;
                    var active = _.filter($scope.themes, function(th) {
                        return th.name.value == data.active;
                    });
                    $scope.selectTheme = active[0];
                    $scope.default_themes = data.default;
                },
                function(data, status, headers, config) {}
            );


            // When change theme in use.
            // This set a theme as theme in use.
            $scope.$watch('selectTheme', function (vnew, vold) {
                if (vold) {
                    if (vnew.name.value != vold.name.value) {
                        restService.post(
                            {theme: vnew.name.value},
                            '/api/v1/admin/themes/active',
                            function(data, status, headers, config) {},
                            function(data, status, headers, config) {}
                        );
                    }
                }
            });


            // When change theme to edit.
            // This get a theme vars to edit.
            $scope.$watch('editTheme', function (vnew, vold) {
                if (vnew != vold && vnew) {
                    restService.post(
                        {
                            theme: vnew.name.value
                        },
                        '/api/v1/admin/themes/edit',
                        function(data, status, headers, config) {
                            $scope.formData = data.theme;
                        },
                        function(data, status, headers, config) {}
                    );
                } else {
                    $scope.formData = $scope.defVars;
                }
            });


            // It's called when click on submit button
            $scope.validator = function() {
                if (!$scope.styleForm.$error.pattern) {
                    restService.post($scope.formData, '/admin/customstyle',
                        function(data, status, headers, config) {
                            // $scope.errors = {};
                            // if (data.errors){
                            //     for (var index in data.errors) {
                            //         $scope.errors[data.errors[index].name] = data.errors[index].message;
                            //     }
                            // }
                        },
                        function(data, status, headers, config) {}
                    );
                }
            };
        }
    ]
);


// This controller loads the admin interface.
angular.module('WeTalk').controller('AdminController',
    [
        '$scope',
        function($scope) {
            // Function to expand menu children.
            $scope.expand = function (v) {
                var old = $scope[v];
                $scope[v] = !old;
            };
        }
    ]
);



angular.module('WeTalk').controller('AdminDashboardController',
    [
        '$scope',
        'restService',
        'i18n',
        function($scope, restService, i18n) {

            restService.get(
                {},
                apiPrefix + '/admin/models',
                function(data, status, headers, config) {
                    if (data.success) {
                          moduleVolumeGraph(data.models);
                    }
                },
                function(data, status, headers, config) {}
            );

            restService.get(
                {},
                apiPrefix + '/admin/users',
                function(data, status, headers, config) {
                    if (data.success) {
                        usersEvolutionGraph(data.users);
                    }
                },
                function(data, status, headers, config) {}
            );

            function moduleVolumeGraph(data) {
                $(function () {
                    var dataParsed = [];

                    _.each(data, function(d) {
                        var tmpList = [];
                        tmpList.push(_.str.capitalize(d.module));
                        var count = 0;
                        _.each(d.models, function(m) {
                            count += m.count;
                        });
                        tmpList.push(count);
                        dataParsed.push(tmpList);
                    });

                    $('#module_volume_graph').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: 0,
                            plotShadow: false
                        },
                        title: {
                            text: i18n.__('Module volumes')
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: true,
                                    distance: -50,
                                    style: {
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textShadow: '0px 1px 2px black'
                                    }
                                },
                                startAngle: -90,
                                endAngle: 90,
                                center: ['50%', '75%']
                            }
                        },
                        series: [{
                            type: 'pie',
                            name: i18n.__('Module volumes'),
                            innerSize: '50%',
                            data: dataParsed
                        }],
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        }
                    });
                });
            }

            function usersEvolutionGraph(data) {
                $(function () {
                    var currentTmpObj = {
                        name: i18n.__('Registered users in the day'),
                        data: []
                    };

                    _.each(data, function(d) {
                        var c_d = new Date(d._id);
                        currentTmpObj.data.push([Date.UTC(c_d.getFullYear(), c_d.getMonth(), c_d.getDate()), d.current_count]);
                    });
                    
                    var totalTmpObj = {
                        name: i18n.__('Total users'),
                        data: []
                    };

                    _.each(data, function(d) {
                        var c_d = new Date(d._id);
                        totalTmpObj.data.push([Date.UTC(c_d.getFullYear(), c_d.getMonth(), c_d.getDate()), d.global_count]);
                    });

                    var dataParsed = [
                        currentTmpObj,
                        totalTmpObj
                    ];

                    $('#users_evolution_graph').highcharts({
                        chart: {
                            type: 'spline'
                        },
                        title: {
                            text: i18n.__('Users info')
                        },
                        exporting: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                millisecond: '%H:%M:%S.%L',
                                second: '%H:%M:%S',
                                minute: '%H:%M',
                                hour: '%H:%M',
                                day: '%e. %b',
                                week: '%e. %b',
                                month: '%b \'%y',
                                year: '%Y'
                            },
                            title: {
                                text: i18n.__('Date')
                            }
                        },
                        yAxis: {
                            title: {
                                text: i18n.__('Users count')
                            },
                            min: 0
                        },
                        tooltip: {
                            headerFormat: '<b>{series.name}</b><br>',
                            pointFormat: '{point.x:%e. %b}: {point.y}'
                        },
                        series: dataParsed
                    });
                });
            }
        }
    ]
);

angular.module('WeTalk').controller('AdminUsersController',
    [
        '$scope',
        'restService',
        'i18n',
        function($scope, restService, i18n) {
            restService.get(
                {},
                apiPrefix + '/users',
                function(data, status, headers, config) {
                    $scope.users = data.users;
                },
                function(data, status, headers, config) {}
            );
            
            var getRoles = function() {
                restService.get(
                    {},
                    apiPrefix + '/admin/roles',
                    function(data, status, headers, config) {
                        $scope.roles = data.roles;
                    },
                    function(data, status, headers, config) {}
                );
            };
            getRoles();

            $scope.addRole = function (u) {
                if (u.newRole) {
                    if (u.roles.indexOf(u.newRole) === -1) {
                        u.roles.push(u.newRole);

                        restService.post(u,
                            apiPrefix + '/users/' + u._id + '/update',
                            function(data, status, headers, config) {
                                delete u.newRole;
                                getRoles();
                                u.roles = data.object.roles;
                            },
                            function(data, status, headers, config) {}
                        );
                        
                    }
                    
                }

            };

            $scope.selectRole = function (u, r) {
                u.newRole = r;
                $scope.addRole(u);
            };

            $scope.removeRole = function (u, r) {
                if (u && r) {
                    if (u.roles.indexOf(r)+1) {
                        u.roles.splice(u.roles.indexOf(r), 1);

                        restService.post(u,
                            apiPrefix + '/users/' + u._id + '/update',
                            function(data, status, headers, config) {
                                getRoles();
                                u.roles = data.object.roles;
                            },
                            function(data, status, headers, config) {}
                        );
                        
                    }
                    
                }

            };

        }
    ]
);

angular.module('WeTalk').controller('AdminUIController',
    [
        '$scope',
        'restService',
        'i18n',
        function($scope, restService, i18n) {
        }
    ]
);

angular.module('WeTalk').controller('AdminSocialNetworkController',
    [
        '$scope',
        'restService',
        'i18n',
        function($scope, restService, i18n) {
        }
    ]
);
