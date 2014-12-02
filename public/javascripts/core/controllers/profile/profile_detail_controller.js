/**
 * @file profile_detail_controller.js
 * @namespace Profile Controller
 * This module manage AngularJS profile operations
 */


 // This controller manage the personal profile page interface.

angular.module('IntrepidJS').controller('ProfileDetailController',
    [
        '$scope',
        '$upload',
        'restService',
        profDetailController
    ]
);

        function profDetailController($scope, $upload, restService) {
            $scope.user = user;
            $scope.pass = {};
            var user_old = _.clone(user);

            $scope.editEmail = function() {
                $scope.showEditEmail = !$scope.showEditEmail;
            };
            $scope.editFirstName = function() {
                $scope.showEditFirstName = !$scope.showEditFirstName;
            };
            $scope.editLastName = function() {
                $scope.showEditLastName = !$scope.showEditLastName;
            };

            $scope.updateUser = function(prop,event) {
                if(!angular.isDefined(event) || event.which== 13){
                    restService.post(user, apiPrefix + '/users/' + user._id + '/update',
                        function(data, status, headers, config) {
                            switch (prop) {
                                case 'firstName':
                                    $scope.editFirstName();
                                    break;
                                case 'lastName':
                                    $scope.editLastName();
                                    break;
                                case 'email':
                                    $scope.editEmail();
                                    break;
                            }
                            user_old = _.clone(data.object);
                        },
                        function(data, status, headers, config) {}
                    );
                }
            };

            $scope.cancelEmail = function() {
                $scope.user.email = user_old.email;
                $scope.editEmail();
            };
            $scope.cancelFirstName = function() {
                $scope.user.firstName = user_old.firstName;
                $scope.editFirstName();
            };
            $scope.cancelLastName = function() {
                $scope.user.lastName = user_old.lastName;
                $scope.editLastName();
            };

            $scope.checkPass = function() {
                if ($scope.pass.password) {
                    restService.post($scope.pass, apiPrefix + '/user/password',
                        function(data, status, headers, config) {
                            if (data.success) {
                                $scope.oldPassClass = 'has-success';
                                $scope.oldPassIcon = 'glyphicon-ok';
                            } else {
                                $scope.oldPassClass = 'has-error';
                                $scope.oldPassIcon = 'glyphicon-remove';
                            }
                        },
                        function(data, status, headers, config) {}
                    );
                }
                $scope.checkAllPass();
            };

            $scope.checkNewPass = function () {
                if ($scope.pass.newPass && $scope.pass.confirmationPass) {
                    if ($scope.pass.newPass === $scope.pass.confirmationPass) {
                        $scope.newPassClass = 'has-success';
                        $scope.newPassIcon = 'glyphicon-ok';
                    } else {
                        $scope.newPassClass = 'has-error';
                        $scope.newPassIcon = 'glyphicon-remove';
                    }
                }
                $scope.checkAllPass();
            };

            $scope.$watch('pass.newPass', function() {
                $scope.checkNewPass();
            });
            $scope.$watch('pass.confirmationPass', function() {
                $scope.checkNewPass();
            });

            $scope.checkAllPass = function() {
                var incomplete = _.some([
                    $scope.pass.password ? true : false,
                    $scope.pass.newPass ? true : false,
                    $scope.pass.confirmationPass ? true : false,
                    $scope.pass.newPass === $scope.pass.confirmationPass
                ], function(prerequisite) {
                    return prerequisite === false;
                });

                if (incomplete) {
                    $scope.canSendPass = true;
                } else {
                    $scope.canSendPass = false;
                }
                
            };

            $scope.changePass = function () {
                restService.post($scope.pass, apiPrefix + '/user/password/change',
                        function(data, status, headers, config) {
                            if (data.success) {
                                $scope.pass = {};
                                $scope.collapsein = false;
                                $scope.oldPassClass = '';
                                $scope.oldPassIcon = '';
                                $scope.newPassClass = '';
                                $scope.newPassIcon = '';
                            }
                        },
                        function(data, status, headers, config) {}
                    );
            };

            $scope.onFileSelect = function($files) {
                $scope.selectedFile = $files[0];
                $scope.hasFile = true;
                updateImage();
            };

            var updateImage = function(){
                $scope.upload = $upload.upload({
                    url: apiPrefix + '/users/' + user._id + '/update',
                    file: $scope.selectedFile
                }).success(function(data, status, headers, config) {
                    $scope.user = data.object;
                    angular.element('.file-input-name').remove();
                });
            };
            $('input[type=file]').bootstrapFileInput();

        }