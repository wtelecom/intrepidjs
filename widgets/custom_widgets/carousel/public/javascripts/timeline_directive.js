angular.module('IntrepidJS')
  .directive('twitterTimelineWidget',['restService', function(restService) {
    return {
        restrict: 'E',
        compile: function(element, attrs)
        {
            restService.get(
                {
                    attrs: {
                            name: {
                                value: 'timeline',
                                type: 'text'
                            }
                        },
                },
                apiPrefix + '/widget/twitter/timeline',
                function(data, status, headers, config) {
                    if (data.success) {
                        if (!_.isEmpty(data.widgets)) {
                            var d_timeline = _.first(data.widgets);
                            var htmlText = '<a class="twitter-timeline" data-dnt="true"' +
                            'href="https://twitter.com/' + d_timeline.fields.username + '"' +
                            'data-widget-id="' + d_timeline.fields.widgetid + '">Tweets por @' + d_timeline.fields.username + '</a>' +
                            '<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],' +
                            'p=/^http:/.test(d.location)?\'http\':\'https\';' +
                            'if(!d.getElementById(id)){js=d.createElement(s);' +
                            'js.id=id;js.src=p+"://platform.twitter.com/widgets.js";' +
                            'fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>';
                            element.replaceWith(htmlText);
                        }
                    }
                },
                function(data, status, headers, config) {

                }
            );
        }
    };
}]);