angular.module('IntrepidJS').directive('ngThumb', ['$parse', function($parse) {
    return {
        restrict: "EA",
        template: "<input type='file' class='btn-md' />",
        replace: true,
        link: function (scope, element, attrs) {
 
            var modelGet = $parse(attrs.ngThumb);
            var modelSet = modelGet.assign;
            var onChange = $parse(attrs.onChange);
 
            var updateModel = function () {
                scope.$apply(function () {
                    modelSet(scope, element[0].children[0].files[0]);
                    onChange(scope);
                });
            };

            element.bind('change', updateModel);
        }
    };
}]);