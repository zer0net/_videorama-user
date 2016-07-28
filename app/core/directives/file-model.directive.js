angular.module('ZeroVidzUser').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    var File = element[0].files[0];
                    modelSetter(scope, File);
                    if (File.type.indexOf('image') > -1){
                        scope.showPreviewImage(File);
                    } else if (File.type.indexOf('video') > -1){
                        scope.showPreviewVideo(File);
                    }
                });
            });
        }
    };
}]);