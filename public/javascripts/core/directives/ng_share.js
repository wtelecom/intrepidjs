angular.module('IntrepidJS').directive('ngShare', ['$location', 'i18n', function($location, i18n) {
    return {
        restrict: "E",
        template:   "<div class='btn-group'><span data-toggle='dropdown' " +
                    "class='dropdown-toggle pointer'> " +
                    "<i class='fa fa-share-alt fa-fw'></i></span>" +
                    "<ul role='menu' class='dropdown-menu'></ul></div>",
        replace: true,
        link: function ($scope, element, attrs) {
            var path = $location.absUrl().replace($location.url(), '');
            var ul = angular.element(element).find('ul');
            var doAll = function () {
                var items = angular.copy(share_widgets);
                var text = attrs.text ? attrs.text : document.title;
                var link = attrs.link ? path + attrs.link : $location.absUrl();
                ul.empty();
                _.each(items, function(w) {
                    w.link = w.link.replace('@text', encodeURIComponent(text));
                    w.link = w.link.replace('@link', encodeURIComponent(link));
                    var li =    "<li><a href='" + w.link + "' target='_blank'>" +
                                "<i class='" + w.icon + " fa-fw'></i>&nbsp; " +
                                "<span>" + i18n.__('Share on') + " " + w.name +
                                "</span></a></li>";
                    ul.append(li);
                });
            };
            attrs.$observe('text', function(text) {
                if (text) doAll();
            });
            attrs.$observe('link', function(link) {
                if (link) doAll();
            });
        }
    };
}]);