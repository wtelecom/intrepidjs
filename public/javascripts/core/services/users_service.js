(function(){
	'use strict';

	angular.module('IntrepidJS')
		.factory('usersService', ['$http','socketIO','uSession', usersService]);

	function usersService($http,socketIO,uSession){
		var usersService = {
			user : null,
			getUser : function (){
				return $http.get('api/v1/info')
					.success(function(data, status, headers, config) {
	                    // Set user in scope.
	                    usersService.user = data.user;

	                    if(usersService.user) {
	                        var emitData = {
	                            user: usersService.user._id,
	                            session: data.session
	                        };
	                        socketIO.emit('userConnect', emitData);
	                        // Open/close chat window
	                        uSession.setChatVisibility(false);
	                    }
	                })
	                .error(function(data, status, headers, config) {
	                    console.log("User has not been logged successfully.");
	                })
			}
		};
		return usersService;
	}

})();