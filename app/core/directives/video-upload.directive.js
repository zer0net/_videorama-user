angular.module('ZeroVidzUser').directive('videoUpload', ['$sce',
	function($sce) {

		var controller = function($scope,$element) {
			
			delete $scope.player;

			// file reader instance
			var reader = new FileReader();

			// show preview video
			$scope.showPreviewVideo = function(file){
				reader.onload = function(){
					// file url
					var dataURL = reader.result;
					var src = $sce.trustAsResourceUrl(dataURL);
					// video player
					$scope.player = {
						sources: [{src:src,type:'video/' + file.type.split('/')[1]}],
						theme: "assets/lib/videogular-themes-default/videogular.css"
					};
					// apply to scope
					$scope.$apply();
					// create preview image
					$scope.createPreviewImage();				
				};
				reader.readAsDataURL(file);
			};

			// create preview image
			$scope.createPreviewImage = function(){
			    var canvas = document.getElementById('canvas');
			    var video = document.getElementsByTagName('video')[0];
			    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
			};

			// upload video file
			$scope.uploadVideo = function(video) {
			    reader.onload = function(){
					var path = 'uploads/videos/' + video.file.name;
					var fileUrl = reader.result.split(',')[1];
					Page.cmd("fileWrite",[path, fileUrl], function(res) {
						console.log(res);
						if (res === 'ok'){
							Page.cmd("wrapperNotification", ["done", "File Uploaded!", 10000]);
						    path = 'uploads/posters/' + video.title + '.png';
						    var canvas =  document.getElementById('canvas');
						    var previewImgUrl = canvas.toDataURL("image/png").split(',')[1];
						    console.log(previewImgUrl);
							Page.cmd("fileWrite",[path, previewImgUrl], function(res) {
								console.log(res);
								if (res === 'ok'){
									Page.cmd("wrapperNotification", ["done", "File Uploaded!", 10000]);
									$scope.createVideo(video);
								}
							});
						}
					});
			    };
			    reader.readAsDataURL(video.file);
			};

			// create video
			$scope.createVideo = function(video){
				var inner_path = "data.json";
				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
		        	// data
					if (data) { data = JSON.parse(data); }
					else { data = {"next_item_id":1,"videos": [] }; }
			    	// new video
					video = {
						"video_id":data.next_item_id,
						"user_id":Page.site_info.cert_user_id,
						"title":video.title,
						"description":video.description,
						"file_name": video.file.name,
						"file_type": video.file.type,
						"file_size": video.file.size,
						"date_added": +(new Date)
					};
					// save
					data.next_item_id += 1;
					data.videos.push(video);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));

					// write to file
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						Page.cmd("wrapperNotification", ["done", "Video Created!", 10000]);
						$scope.video = {};
					});
			    });
			};

		};

		var template = 
			'<form name="videoUpload" id="video-upload-form">' +
				'<h3>Upload Video</h3>' +
	            '<md-input-container class="md-block" flex-gt-sm>' +
	              	'<label>Title</label>' +
					'<input type="text" ng-model="video.title">' +
	            '</md-input-container>' +
	            '<md-input-container class="md-block" flex-gt-sm>' +
	              	'<label>description</label>' +
					'<textarea ng-model="video.description"></textarea>' +
	            '</md-input-container>' +
	            '<md-input-container class="md-block" flex-gt-sm>' +
					'<input type="file" accept="video/*" file-model="video.file"><br>' +
	            '</md-input-container>' +
				'<videogular vg-theme="player.theme" ng-if="player">' +
					'<vg-media vg-src="player.sources"' +
							'vg-tracks="player.tracks">' +
					'</vg-media>' +
					'<vg-controls>' +
						'<vg-play-pause-button></vg-play-pause-button>' +
						'<vg-time-display>{{ currentTime | date:"mm:ss" }}</vg-time-display>' +
						'<vg-scrub-bar>' +
							'<vg-scrub-bar-current-time></vg-scrub-bar-current-time>' +
						'</vg-scrub-bar>' +
						'<vg-time-display>{{ timeLeft | date:"mm:ss" }}</vg-time-display>' +
						'<vg-volume>' +
							'<vg-mute-button></vg-mute-button>' +
							'<vg-volume-bar></vg-volume-bar>' +
						'</vg-volume>' +
						'<vg-fullscreen-button></vg-fullscreen-button>' +
					'</vg-controls>' +
					'<vg-overlay-play></vg-overlay-play>' +
					'<vg-poster vg-url="player.plugins.poster" ng-if="player.plugins"></vg-poster>' +
				'</videogular>' +
				'<canvas id="canvas"></canvas>' +
				'<a ng-click="createPreviewImage()">capture image</a>' +
	            '<md-button class="md-primary md-raised edgePadding pull-right" ng-click="uploadVideo(video)" >' +
	            	'<label>Upload Video</label>' +
	            '</md-button>' +
			'</form>';

		return {
			restrict: 'AE',
			replace:true,
			controller: controller,
			template:template
		}

	}
]);