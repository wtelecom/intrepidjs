angular.module('IntrepidJS').directive('ngSlideShow', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var expression = attrs.ngSlideShow;
            var duration = (attrs.slideShowDuration || "fast");
            if (!scope.$eval(expression)) {
                element.hide();
            }
            scope.$watch(expression, function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
 
                // Show element.
                if (newValue) {
                    element
                    .stop(true, true)
                    .slideDown(duration);

                // Hide element.
                } else {
                    element
                    .stop(true, true)
                    .slideUp(duration);
                }
            });
        }
    };
});