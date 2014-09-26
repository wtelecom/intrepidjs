angular.module('IntrepidJS').directive('ngDynAttr', function($compile) {
    return {
        restrict: "A",
        scope: {
            ngDynAttr: '='
        },
        compile: function(el, scope) {
            console.log(scope.ngDynAttr);
            el.attr(scope.ngDynAttr, scope.ngDynAttr);
        }
        // link: function(scope, elem, attrs) {
        //     attrs.$set(scope.ngDynAttr, scope.ngDynAttr);
        // }
    };
});