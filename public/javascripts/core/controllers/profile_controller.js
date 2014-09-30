/**
 * @file profile_controller.js
 * @namespace Profile Controller
 * This module manage AngularJS profile operations
 */


 // This controller loads the profile interface.
angular.module('IntrepidJS').controller('ProfileController',
    [
        '$scope',
        '$state',
        function($scope, $state) {
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                if (toState.name == 'profile') {
                    $state.transitionTo('profile.detail');
                }
            });
        }
    ]
);


angular.module('IntrepidJS').controller('ProfileDetailController',
    [
        '$scope',
        'restService',
        '$upload',
        function ($scope, restService, $upload) {
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

            $scope.updateUser = function(prop) {
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
    ]
);


angular.module('IntrepidJS').controller('ProfileMailController',
    [
        '$scope',
        'restService',
        '$state',
        function ($scope, restService, $state) {

            $scope.theOther = function (users) {
                return _.find(users, function(u) {
                    return String(u._id) != String(user._id);
                });
            };
            $scope.user = user;

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                if (toState.name == 'profile.mail') {
                    $state.transitionTo('profile.mail.inbox');
                }
            });

            $scope.writeBtnShow = true;
            $scope.formData = {};
            $scope.dateFormat = 'EEEE MMMM d, y - HH:mm';

            $scope.create = function () {
                restService.post($scope.formData, apiPrefix + '/mails/create',
                    function(data, status, headers, config) {
                        if (data.success) {
                            $scope.getMails();
                        }
                    },
                    function(data, status, headers, config) {}
                );
            };

            $scope.getMails = function() {
                $scope.backBtnShow = false;
                $scope.replyBtnShow = false;

                restService.get({}, apiPrefix + '/mails',
                    function(data, status, headers, config) {
                        if (data.success) {
                            if ($state.current.name === 'profile.mail.inbox') {
                                $scope.mails = data.mails.inbox;
                                $scope.isInbox = true;
                            } else if ($state.current.name === 'profile.mail.sent') {
                                $scope.mails = data.mails.sent;
                                $scope.isInbox = false;
                            }
                           
                        }
                    },
                    function(data, status, headers, config) {}
                );
            };

            $scope.readMail = function (mail) {
                $scope.backBtnShow = true;
                // $scope.mail = mail;
                $scope.replyBtnShow = true;
                $state.transitionTo('profile.mail.read', {mail: mail._id});
            };

        }
    ]
);

angular.module('IntrepidJS').controller('ProfileMailReadController',
    [
        '$scope',
        'restService',
        '$sce',
        '$state',
        function ($scope, restService, $sce, $state) {
            var forMe = function (us) {
                return String(us._id ? us._id : us) === String(user._id);
            };

            $scope.readMail = function () {
                if ($state.params && $state.params.mail) {
                    restService.get({}, apiPrefix + '/mails/' + $state.params.mail,
                        function(data, status, headers, config) {
                            if (data.success) {
                                if (data.mail) {
                                    if (data.mail.children.length) {
                                        _.each(data.mail.children, function(child) {
                                            if (forMe(child.user_dst)) {
                                                _.extend(child.user_dst, {me: true});
                                            }
                                            child.text = $sce.trustAsHtml(child.text);
                                        });
                                    }
                                    $scope.$parent.mail = data.mail;
                                    if (forMe(data.mail.user_dst)) {
                                        _.extend($scope.$parent.mail.user_dst, {me: true});
                                    }
                                    $scope.$parent.mail.text = $sce.trustAsHtml($scope.$parent.mail.text);

                                    $scope.$parent.backState = forMe($scope.$parent.mail.user_dst) ? 'profile.mail.inbox' : 'profile.mail.sent';
                                    $scope.$parent.replyBtnShow = true;
                                    $scope.$parent.backBtnShow = true;
                                }
                            }
                        },
                        function(data, status, headers, config) {}
                    );
                }
            };

            $scope.$on('mailSent', function(event, data) {
                if (data.success) {
                    $scope.readMail();
                }
            });

        }
    ]
);