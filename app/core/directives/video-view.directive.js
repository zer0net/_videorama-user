angular.module('ZeroVidzUser').directive('videoView', ['$sce','$location',
	function($sce,$location) {

		var controller = function($scope,$element) {

			// get video
			$scope.getVideo = function () {
				var videoId = $location.$$absUrl.split('w=')[1].split('&')[0];
				videoId = parseInt(videoId);
				var inner_path = 'data.json';
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data); 
		        	data.videos.forEach(function(video,index) {
		        		if (video.video_id === videoId){
		        			$scope.video = video;
		        			$scope.video.comments = [];
		        			$scope.getChannel(video.channel);
		        			$scope.$apply(function() {
		        				$scope.createVideoView(video);
		        				$scope.countViews(video);
			        			$scope.loadPlayer();
		        			});
		        		}
	        		});
			    });
			};

			// get channel
			$scope.getChannel = function(channelId) {
				// TEMP FUNCTION!!
				var inner_path = 'data.json';
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data); 
					$scope.channel = data.channel;
		        	$scope.$apply();

			    });				
			};

			// count views
			$scope.countViews = function(video) {
				// TEMP FUNCTION!!
				video.views = 0;
				var inner_path = 'views.json';
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
					data = JSON.parse(data);
					console.log(data);
					data.views.forEach(function(view,index){
						if (view.video_id === video.video_id){
							video.views += 1;
						}
					});
					$scope.$apply();
			    });				
			};

			// load player
			$scope.loadPlayer = function() {
				$scope.player = {
					autoPlay:true,
					sources: [
						{
							src:'../uploads/videos/' + $scope.video.file_name,
							type:'video/' + $scope.video.file_type.split('/')[1]
						}
					],
					theme: "../assets/lib/videogular-themes-default/videogular.css"
				};
			};

			// create video view
			$scope.createVideoView = function(video) {

				var inner_path = 'views.json'
				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
		        	// data
					if (data) { data = JSON.parse(data); }
					else { data = {"next_item_id":1,"views": [] }; }
					var view = {
						"video_id":video.video_id,
						"channel":$scope.site_address,
						"user_id":$scope.user,
						"date_added":+(new Date)
					};
					// save
					data.next_item_id += 1;
					data.views.push(view);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));

					// write to file
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						video.views += 1;
						$scope.$apply();
					});
			    });

			};

			$scope.onFullScreenClick = function() {
				if ($scope.screenSize === 'full-screen'){
					$scope.screenSize = 'normal';
				} else {
					$scope.screenSize = 'full-screen';						
				}
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller,
		}

	}
]);