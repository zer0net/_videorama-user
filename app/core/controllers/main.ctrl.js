angular.module('ZeroVidzUser').controller('MainCtrl', ['$scope',
	function($scope) {

		var reader = new FileReader();

		// open file
		$scope.openFile = function() {

		    reader.onload = function(){
				var dataURL = reader.result;
				var output = document.getElementById('output');
				output.src = dataURL;
				var imageUrl = dataURL.split(',')[1];
				var inner_path = "uploads/images/" + $scope.myFile.name;
				Page.cmd("fileWrite",[inner_path, imageUrl], function(res) {
					Page.cmd("wrapperNotification", ["done", "File Uploaded!", 10000]);
				});
		    };
		    reader.readAsDataURL($scope.myFile);
		};

	}
]);