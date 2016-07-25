angular.module('ngZeroBlog').factory('Comments', [
	function() {

		var Comments = {};

		Comments.getPostComments = function(){
			
			var comments = [{
				id:1,
				post_id:1,
				user_name:'someUser',
				comment_text:'it will be the biggest step ever!',
				date_created:'2016-06-13 14:29:52'
			},{
				id:2,
				post_id:2,
				user_name:'anotherUser',
				comment_text:'Shout if youd like a hand from a web developer with 15 years commercial experience!',
				date_created:'2016-06-13 14:29:52'
			}];

			return comments;

		};

		return Comments;
	}
]);