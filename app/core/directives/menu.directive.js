angular.module('ngZeroBlog').directive('siteMenu', ['$rootScope',
	function($rootScope) {

		var controller = function($scope,$element) {

			// init site menu
			$scope.siteMenu = function(){
				$scope.getMenuItems();
			};

			// get menu items
			$scope.getMenuItems = function(){
				Page.cmd("dbQuery", ["SELECT * FROM menu_item"],function(menuItems) {
					$scope.menu = menuItems;
					$scope.$apply();
				});
			};

			// menu item click event
			$scope.menuItemClicked = function(menuItem){
				if (menuItem.view_type === 'post'){
					$scope.viewPost(menuItem.view_item_id);
				} else if (menuItem.view_type === 'category'){
					$scope.viewCategory(menuItem.view_item_id);
				}
			};

			// init create menu item form
			$scope.createMenuItemForm = function(){
				$scope.menuItemViewTypes = [{
					key:"post",
					value:"post"
				},{
					key:"category",
					value:"category"
				}];
				$scope.getMenuItems();
			};

			// create menu item
			$scope.createItem = function(menuItem){

				// check user account
				if (!Page.site_info.cert_user_id) {
					Page.cmd("wrapperNotification", ["info", "Please, select your account."]);
					$scope.selectUser();
				}

				// inner path
				var inner_path = "data/menu_item.json";

				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false }, function (data) {
			        	
					if (data) { data = JSON.parse(data); } 
					else { data = { "next_menu_item_id":1,"menu_item": [] }; }

			    	// new menu item
			    	menuItem.active = 1;
			    	menuItem.menu_item_id = data.next_menu_item_id;
					data.next_menu_item_id +=1;

					data.menu_item.push(menuItem);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function (res) { 

						Page.cmd("wrapperNotification", ["done", "Menu Item "+menuItem.label+" created!", 10000]);
						if (!$scope.menu) $scope.menu = [];
						$scope.menu.push(menuItem);
						$scope.$apply();
					
					});
			    
			    });
			};

			// delete category
			$scope.deleteItem = function(menuItemId){
				// inner path
				var inner_path = "data/menu_item.json";

				// get file
				Page.cmd("fileGet", { "inner_path": inner_path, "required": false }, function (data) {
   	
					data = JSON.parse(data); 
		        	var itemIndex;
		        	data.menu_item.forEach(function(item,index){
		        		if (item.menu_item_id === menuItemId)
		        		menuItemIndex = index;
		        	});

		        	data.menu_item.splice(menuItemIndex,1);
					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
					Page.cmd("fileWrite", [inner_path, btoa(json_raw)], function (res) { 
						Page.cmd("wrapperNotification", ["done", "menu item deleted!", 10000]);
						$scope.menu.splice(menuItemIndex,1);
						$scope.$apply();					
					});
			    
			    });				
			};

		};

		return {
			restrict: 'AE',
			replace:false,
			controller: controller
		}

	}
]);