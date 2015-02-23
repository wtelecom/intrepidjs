// Directive to send message when enter is pressed.
angular.module('IntrepidJS').directive('bindEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                event.preventDefault();
                scope.$apply(function (){
                    scope.$eval(attrs.bindEnter);
                });
            }
        });
    };

});