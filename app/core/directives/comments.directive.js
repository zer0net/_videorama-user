angular.module('ZeroVidzUser').directive('comments', [
	function() {

		var controller = function($scope,$element) {

			$scope.postComment = function(comment,video) {

				var inner_path = 'data/comments.json'
				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
		        	// data
					if (data) { data = JSON.parse(data); }
					else { data = {"next_item_id":1,"comments": [] }; }

			    	// new video
					comment = {
						"video_id":video.video_id,
						"user_id":$scope.user,
						"channel":$scope.site_address,
						"comment":comment,
						"date_added": +(new Date)
					};

					// save
					data.next_item_id += 1;
					data.comments.push(comment);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));

					// write to file
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						// publish site
						//Page.cmd("sitePublish",{"inner_path": inner_path}, function(res){
							// apply to scope
							$scope.$apply(function() {
								$scope.comments.push(comment);
								$scope.comment = '';
							});

						//});
					});
			    });

			};

			$scope.getComments = function(video) {
				// TEMP FUNCTION!!
				var inner_path = 'data/comments.json';
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data); 
					$scope.comments = [];
					data.comments.forEach(function(comment,index) {
						if (comment.video_id === video.video_id){
							$scope.comments.push(comment);
						}
					});
		        	$scope.$apply();
			    });
			};
		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);