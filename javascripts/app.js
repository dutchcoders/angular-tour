var app =  angular.module('app', ['duco.tour']);

app.controller('TourController', ['$rootScope', '$scope', '$tour', function($rootScope, $scope, $tour) {
        tour = {
            skipLabel: 'Skip',
            doneLabel: 'Done',
            previousLabel: 'Previous',
            nextLabel: 'Next',
            showStepNumbers:false,
            scope: $scope,
            steps:[
            {
            element: '.step1',
            intro: "<b>Step 1</b><br/><p>Step 1 intro.</p>",
            position: 'left'
            },
            {
            element: '.step2',
            intro: "<b>Step 2</b><br/><p>Step 2 intro.</p>",
            position: 'bottom'
            },
            {
            element: '.step3',
            intro: "<b>Step 3</b><br/><p>Step 3 intro.</p>",
            position: 'right'
            }]
    }

    $tour.open(tour);
}]);
