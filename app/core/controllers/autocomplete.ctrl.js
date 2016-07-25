
angular.module('ngZeroBlog').controller('AutoCompleteCtrl', ['$q','$timeout',
  function($q,$timeout) {

    this.querySearch = function(){
        return Page.cmd("dbQuery", ["SELECT * FROM tag ORDER BY date_added"], function(tags) {
            return tags;
            $scope.$apply();
        });
    }
  }
]);