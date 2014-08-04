/**
 * @file main_controller.js
 * @namespace Index Controller
 * This module manage AngularJS index operations
 */

// This controller is a dummy controller.
// It's only purpose is to show the highlights of the modules
angular.module('WeTalk').controller('SignupController',
    [
        '$scope',
        '$modal',
        '$log',
        function ($scope, $modal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];

            $scope.open = function () {

                var modalInstance = $modal.open({
                    templateUrl: '/accounts/signup',
                    controller: ModalInstanceController,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    ]
);

angular.module('WeTalk').controller('ModalInstanceController',
    [
        '$scope',
        '$modalInstance',
        function ($scope, $modalInstance, items) {
            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function () {
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }
    ]
);