angular.module('IntrepidJS').directive('dctype', function() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, element, attr, model) {
            scope.$watch(function() {
                var type = null;
                switch (element.prop('tagName')) {
                    case 'INPUT':
                        type = element.attr('type');
                        break;
                    case 'TEXTAREA':
                        type = 'textarea';
                        break;
                    case 'SELECT':
                        type = 'select';
                        break;
                }
                model.$setViewValue({value: element.val(), type: type});
            });
        }
    };
});