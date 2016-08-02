angular.module('ZeroVidzUser').directive('videoList', ['$sce','$location',
	function($sce,$location) {

		var controller = function($scope,$element) {

			// get videos 
			$scope.getVideos = function(){
				// get file
				Page.cmd("fileGet", { "inner_path": "data/data.json", "required": false },function(data) {
		        	// data
					if (data) { 
						data = JSON.parse(data); 
						$scope.videos = data.videos;
						$scope.$apply();
					} else {
						$scope.message = 'no videos yet. upload now!';
						$scope.$apply();
					}
			    });
			};

			// render video
			$scope.renderVideo = function (video) {
				video.imgSrc = 'uploads/posters/' + video.file_name.split('.')[0] + '.png';
				// count views
				// TEMP FUNCTION!!
				video.views = 0;
				var inner_path = 'data/views.json';
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data);
					data.views.forEach(function(view,index){
						if (view.video_id === video.video_id){
							video.views += 1;
						}
					});
					$scope.$apply();
			    });
			};

			// delet video
			$scope.deleteVideo = function(vid) {

				var inner_path = 'data/data.json'
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {

					if (data) { 
						data = JSON.parse(data); 
					}
					
					var videoIndex;
					data.videos.forEach(function(video,index) {
						if (video.video_id === vid.video_id){
							videoIndex = index;
						}
					});

					data.videos.splice(videoIndex,1);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));

					var videoPath = 'uploads/videos/' + vid.file_name;
					Page.cmd("fileDelete", [videoPath], function(res) {
						var posterPath = 'uploads/posters' + vid.file_name.split('.')[0] + '.png';
						Page.cmd("fileDelete", [videoPath], function(res) {
							Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function (res) { 
								Page.cmd("wrapperNotification", ["done", "video deleted!", 10000]);
								$scope.videos.splice(videoIndex,1);
								$scope.$apply();
							});	
						});
					});

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