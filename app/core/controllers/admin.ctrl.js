angular.module('ngZeroBlog').controller('AdminCtrl', ['$scope','$location','FileUploader',
	function($scope,$location,FileUploader) {

        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

		// init admin panel
		$scope.init = function(){

			// admin menu
			$scope.adminMenu = [
				{label:'general',section:'general'},
				{label:'menus',section:'menus'},
				{label:'categories',section:'categories'},
				{label:'posts',section:'posts'},
				{label:'comments',section:'comments'}
			];

			if ($location.$$absUrl.indexOf('?Section') > -1){
				$scope.adminSection = $location.$$absUrl.split('&')[0].split('?Section:')[1];
			} else {
				$scope.adminSection = 'general';
			}

			// menu item type
			$scope.menuItemViewTypes = [
				{key:'post',value:'post'},
				{key:'category',value:'category'}
			];

			// posts order
			$scope.postsOrderByOptions = [{
				key:"post id",
				value:"post_id"
			},{
				key:"date added",
				value:"date_added"
			},{
				key:"alphabetically",
				value:"title"
			}];

			// posts order direction
			$scope.postsOrderDirOptions = [{
				key:"ascending",
				value:"ASC"
			},{
				key:"descending",
				value:"DESC"
			}];

			// finish loading
			$scope.finishLoading();

		};

	    // save settings
	    $scope.saveSettings = function(config){
			// check user account
			if (!Page.site_info.cert_user_id) {
				Page.cmd("wrapperNotification", ["info", "Please, select your account."]);
				$scope.selectUser();
			}
			// inner path
			var inner_path = "data/config.json";
			// data json
			var data = {"config":[]};
        	data.config.push(config);
			var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));		        
			// write to file
			Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function(res) {
				Page.cmd("wrapperNotification", ["done", "Settings Saved!", 10000]);
				$scope.$apply();
			});
	    };

	}
]);