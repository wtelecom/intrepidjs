angular.module('IntrepidJS').directive('ngEditInPlace', function() {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            cid: '='
        },
        template: '<span ng-bind="value"></span>' +
                '<input ng-model="value" class="form-control"></input>' +
                '<a href="" ng-click="remove()"><i class="fa fa-trash-o fa-fw pull-right"></i></a>' +
                '<a href="" ng-click="edit()"><i class="fa fa-pencil fa-fw pull-right"></i></a>',
        link: function($scope, element, attrs) {
            var inputElement = angular.element(element.children()[1]),
                oldValue = $scope.value,
                newValue = null;

            $scope.$watch('value', function(newVal, oldVal) {
                newValue = newVal;
            });

            element.addClass('edit-in-place');

            $scope.editing = false;

            $scope.edit = function() {
                $scope.editing = true;
                element.addClass('active');
                inputElement[0].focus();
            };

            $scope.remove = function() {
                $scope.$parent.removeCategory($scope.cid);
            };

            inputElement.blur(function() {
                if (newValue != oldValue && newValue.length > 0) {
                    $scope.$parent.updateCategory($scope.cid, $scope.value);
                }
                $scope.editing = false;
                element.removeClass('active');
            });
        }
    };
});