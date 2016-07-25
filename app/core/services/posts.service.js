angular.module('ngZeroBlog').factory('Posts', [
	function() {

		var Posts = {};

		Posts.getPosts = function(){
			Page.cmd("dbQuery", ["SELECT * FROM post ORDER BY date_added"], (function(posts) {
				console.log(posts);
				return posts;
			})(Page));
		};

		return Posts;
	}
]);