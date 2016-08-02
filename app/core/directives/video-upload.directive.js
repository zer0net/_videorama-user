angular.module('ZeroVidzUser').directive('videoUpload', ['$sce','$location','$timeout',
	function($sce,$location,$timeout) {

		var controller = function($scope,$element) {

			// file reader instance
			var reader = new FileReader();

			// initiate video player directive
			$scope.init = function() {

				// video object
				$scope.video = {};
				$scope.tags = [];

				// dropzone config
				$scope.dropzoneConfig = {	
				    'options': { // passed into the Dropzone constructor
				      'url': 'upload.php'
				    },
					'eventHandlers': {
						'sending': function (file, xhr, formData) {
							$scope.showPreviewVideo(file);
						}
					}
				};

			};

			// on player ready
			$scope.onPlayerReady = function(API,video) {
				$scope.api = API;
			};

			// add tag
			$scope.addTag = function(tag) {
				$scope.tags.push(tag);
			};

			$scope.removeTag = function(index) {
				$scope.tags.splice(index,1);
			}

			// create preview image
			$scope.createPreviewImage = function(vid){
			    var canvas = document.getElementById('canvas');
			    var video = document.getElementsByTagName('video')[0];
			    canvas.getContext('2d').drawImage(video, 0, 0, 350, 200);
				$scope.uploadPreviewImage(vid);
			};

			// capture preview image
			$scope.capturePreviewImage = function(vid){
			    var canvas = document.getElementById('canvas');
			    var video = document.getElementsByTagName('video')[0];
			    canvas.getContext('2d').drawImage(video, 0, 0, 350, 200);
			    $scope.previewImage = true;
			};


			// upload preview image
			$scope.uploadPreviewImage = function(video){
				var fileName = video.file.name.split('.')[0];
			    var path = 'uploads/posters/' + fileName + '.png';
			    var canvas =  document.getElementById('canvas');
			    var previewImgUrl = canvas.toDataURL("image/png").split(',')[1];
				Page.cmd("fileWrite",[path, previewImgUrl], function(res) {
					if (res === 'ok'){
						console.log(res);
					}
				});
			}

			// show preview video
			$scope.showPreviewVideo = function(file){
				$scope.video.file = file;
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
					$scope.$apply(function() {
					    $timeout(function () {
					    	$scope.capturePreviewImage();
					    }, 1000);
					});
				};
				reader.readAsDataURL(file);
			};

			// upload video file
			$scope.uploadVideo = function(video) {
				$scope.loading = true;
				// file reader
			    reader.onload = function(){
					var path = 'uploads/videos/' + video.file.name;
					var fileUrl = reader.result.split(',')[1];
					Page.cmd("fileWrite",[path, fileUrl], function(res) {
						if (res === 'ok'){
							// create video
							$scope.createVideo(video);
							// create preview image
							$scope.createPreviewImage(video);
						}
					});
			    };
			    reader.readAsDataURL(video.file);
			};


			// create video
			$scope.createVideo = function(video){

				var inner_path = "data/data.json";
				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false },function(data) {
		        	// data
					if (data) { data = JSON.parse(data); }
					else { data = {"next_item_id":1,"videos": [] }; }

					// break down tags array
					var tags = '';
					$scope.tags.forEach(function(tag,index) {
						tags += tag + ',';
					});
			    	// new video
					video = {
						"video_id":data.next_item_id,
						"user_id":Page.site_info.cert_user_id,
						"channel":$scope.site_address,
						"title":video.title,
						"description":video.description,
						"tags":tags,
						"file_name": video.file.name,
						"file_type": video.file.type,
						"file_size": video.file.size,
						"total_time": $scope.api.totalTime,
						"date_added": +(new Date)
					};

					// save
					data.next_item_id += 1;
					data.videos.push(video);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));

					// write to file
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
						Page.cmd("wrapperNotification", ["done", "Video Uploaded!", 10000]);
						var newVideoUrl  = 'video.html?w=' + video.video_id;
						window.location.href = newVideoUrl;
						$scope.$apply();
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