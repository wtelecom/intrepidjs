/**
 * @file admin_style_controller.js
 * @namespace Admin Controller
 * @desc This module manage AngularJS admin style operations
 */

// This controller loads the interface needed to make a custom style.
angular
    .module('IntrepidJS').controller('AdminStyleController',
        [
            '$scope',
            'restService',
            adminStyleController
        ]
    );

function adminStyleController($scope, restService) {
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