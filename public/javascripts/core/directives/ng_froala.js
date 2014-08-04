angular.module('froala', [])
    .directive("ngFroala", [
        function(){
            return {
                retrict: "A",
                template: "<section id='editor'><textarea id='edit' style='margin-top: 30px;' data-ng-model='textStuff'></textarea></section></br><button ng-click='show()'>grab</button></br> ",
                controller: ["$scope", function($scope){
                    $scope.show = function(){
                        var html = $('#edit')[0].value;
                        $scope.textStuff = html;
                    };
                }],
                link: function(scope, elem, attrs) {
                    $('#edit').editable({inlineMode: false, buttons: ['undo', 'redo' , 'sep', 'bold', 'italic', 'underline', "fontSize", "insertUnorderedList", "createLink", "insertImage"]});
                }
            };
        }
    ]
);