angular.module('aj.crop', [])
    .directive('imgCropped', function($window) {
        var bounds = {};

        return {
            restrict: 'E',
            replace: true,
            scope: { src:'=', selected:'&' },
            link: function (scope, element) {
            var myImg,
                clear = function() {
                    if (myImg) {
                        myImg.next().remove();
                        myImg.remove();
                        myImg = undefined;
                    }
                };

            scope.$watch('src', function (nv) {
                clear();
                
                if (!nv) {
                    // newValue
                    return;
                }

                element.after('<img style="max-width: 100%;"/>');
                myImg = element.next();
                myImg.attr('src', nv);
                $window.jQuery(myImg).Jcrop(
                    {
                        trackDocument: true,
                        onSelect: function(cords) {
                            scope.$apply(function() {
                                cords.bx = bounds.x;
                                cords.by = bounds.y;
                                scope.selected({cords: cords});
                            });
                        },
                        aspectRatio: 1.333333333333333333
                    },
                    function () {
                        // Use the API to get the real image size  
                        var boundsArr = this.getBounds();
                        bounds.x = boundsArr[0];
                        bounds.y = boundsArr[1];
                    }
                );
            });

            scope.$on('$destroy', clear);
            }
        };
    }
);