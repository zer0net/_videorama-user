angular.module('ngZeroBlog').directive("uiEvent", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                scope.headerClass = 'small-header';
                scope.headerWidthLeft = '50';
                scope.headerWidthRight = '50';
            } else {
                scope.headerClass = '';
                scope.headerWidthLeft = '75';
                scope.headerWidthRight = '25';                
            }
            scope.$apply();
        });
    };
});