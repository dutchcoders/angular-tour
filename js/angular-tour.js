/**
 * angular-tour v0.1
 * https://github.com/dutchcoders/angular-tour
 *
 * based on Intro.js v0.8.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2014 dutchcoders 
 */

var tour = angular.module('duco.tour', []);

tour.run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/tour.html",
		"<div class=\"introjsFloatingElement\"></div>" +
		"<div class=\"introjs-overlay\" style=\"top: 0;bottom: 0; left: 0;right: 0;position: fixed;opacity: .8;\" ng-click=\"next()\"></div>" +
		"<div class=\"introjs-helperLayer\" style=\"width: 102px; height:38px; top:5px;left: 155px;\" mj-tour-step=\"tour.steps[step]\">" +
		"<div class=\"introjs-tooltip\" style=\"\"><div class=\"introjs-tooltiptext\" tour-html=\"tour.steps[step].intro\"></div>" + 
		"<div class=\"introjs-bullets\">" +
		"	<ul>" +
		"		<li ng-repeat=\"item in tour.steps\">" +
		"		<a ng-show=\"$index>step\" class=\"disabled\">&nbsp;</a>" +
		"		<a ng-hide=\"$index>step\" ng-class=\"{active:$index==step}\" ng-disabled=\"\" ng-click=\"go($index)\">&nbsp;</a>" +
		"		</li></ul></div><div class=\"introjs-arrow top\" style=\"display: inherit;\"></div>" +
		"<div class=\"introjs-tooltipbuttons\">" +
		"	<a class=\"introjs-button introjs-skipbutton\" ng-hide=\"isLast()\" ng-click=\"skip()\" ng-bind-html=\"tour.skipLabel\">Skip</a>" +
		"	<a ng-click=\"previous()\" ng-hide=\"isFirst()\" class=\"introjs-button introjs-prevbutton\" ng-class=\"{'introjs-disabled': step}\" ng-bind-html=\"tour.previousLabel\">Previous</a>" +
		"	<a ng-click=\"next();\" ng-hide=\"isLast()\" class=\"introjs-button introjs-nextbutton\" ng-bind=\"tour.nextLabel\">Next</a>" +
		"	<a ng-click=\"close();\" ng-hide=\"!isLast()\" class=\"introjs-button introjs-donebutton\" ng-bind=\"tour.doneLabel\">Ready</a>" +
		"</div>" +
		"</div></div>");
}]);

tour.factory('$tour', ['$transition', '$timeout', '$document', '$compile', '$rootScope',
    function ($transition, $timeout, $document, $compile, $rootScope) {
	    var $tour = {};
	    var tourDomEl = null;
            var scope = null;

	    $tour.open = function(tourOptions) {
		var angularDomEl = angular.element('<mj-tour></mj-tour>');

		// scope = tourOptions.scope.$new(true) || $rootScope.$new(true);
              	scope = $rootScope.$new();
		scope.tour = tourOptions;
		scope.step = 0;

		tourDomEl = $compile(angularDomEl)(scope);
		var body = $document.find('body').eq(0);
		body.append(tourDomEl);
	    };

	    $rootScope.$on('tour.close', function() {
		    $tour.close();
	    });
	    
	    $tour.close = function() {
		    scope.$destroy();
		    tourDomEl.remove();
	    }

	    return ($tour);
}]);

tour.directive('mjTourStep', ['$timeout', '$window', '$compile', '$location', '$document', function($timeout, $window, $compile, $location, $document) {
  return {
	restrict:'A',
	priority: 1001,
	controller: function () {
	},
	link: function(scope, element, attrs){

	angular.element($window).bind('resize', function() {
	});
	
	currentStep = null;

	scope.$on('$destroy', function() {
		$oldElement = $(scope.$eval(attrs.mjTourStep).element);	
		$oldElement.removeClass('introjs-showElement introjs-relativePosition');
		$oldElement.parents().removeClass('introjs-fixParent');
		if (currentStep) {
			$oldElement.removeClass(currentStep.class || '');
		}
	});

	scope.$watch(attrs.mjTourStep, function(newVal, oldVal) {
			if (oldVal) {
				$oldElement = $(oldVal.element);	
				$oldElement.removeClass('introjs-showElement introjs-relativePosition');
				$oldElement.parents().removeClass('introjs-fixParent');
				$oldElement.removeClass(oldVal.class || '');

				$('.introjsFloatingElement').remove();
			}

			currentStep = newVal;

			$newElement = $(newVal.element);
		
			position = newVal.position || 'bottom';
			url = newVal.url || null;

			$('.introjs-tooltiptext').html($compile(newVal.intro)(scope));
			$('.introjs-arrow').removeClass('top bottom left right');
			$('.introjs-tooltip').css({'margin-left': ''});

			if ($newElement.length == 0) {
				$newElement = $("<div class='introjsFloatingElement'/>");
				var body = $document.find('body').eq(0);
				body.append($newElement);
				position='floating';
			} 

			$newElement.addClass('introjs-showElement introjs-relativePosition');
			$newElement.addClass(newVal.class || '');
			$newElement.parents().addClass('introjs-fixParent');
			
			element.offset({left: $newElement.offset().left, top: $newElement.offset().top  });
			element.css({width: $newElement.outerWidth(), height:  $newElement.outerHeight() });

			
			$('.introjs-tooltip').css({'margin-top': 0, 'margin-left': 0});

			switch (position) {
				case 'left':
					$('.introjs-tooltip').css({top: 0, bottom: '', left: '', right: $newElement.outerWidth() + 10});
					$('.introjs-arrow').addClass('right');			
					break;
				case 'right':
					$('.introjs-tooltip').css({top: 0, bottom: '', right: '', left: $newElement.outerWidth() + 10});
					$('.introjs-arrow').addClass('left');		
					// unimplemented	
					break;
				case 'top':
					$('.introjs-arrow').addClass('bottom');			
					// unimplemented	
					break;
				case 'floating':
					$('.introjs-tooltip').css({top: '50%', 'margin-top': '-' + (($newElement.outerHeight() / 2) + 10) + 'px' , bottom: '', left: '50%', 'margin-left': '-' + (($newElement.outerWidth() /2) + 10) + 'px', right: ''});
					$('.introjs-tooltip').css({top: '50%', 'margin-top': '-100px' , bottom: '', left: '50%', 'margin-left': '-125px', right: ''});
					break;
				default:
					$('.introjs-tooltip').css({top: $newElement.outerHeight() + 10, bottom: '', left: '', right: ''});
					$('.introjs-arrow').addClass('top');			
			}

			if (url) {	
				$location.url(url);
			}

			$('.introjs-tooltip').css(newVal.css || {});
		});
		// element.
	}
  };
}]);
	
tour.directive('mjTour', ['$document', '$timeout', '$window', function($document, $timeout, $window) {
  return {
	restrict:'E',
	priority: 1001,
	templateUrl: 'template/tour.html',
	controller: function () {
	},
	link: function(scope, element, attrs){
	        $document.bind('keyup', function($evt) {
			switch ($evt.keyCode) {
				case 39:
					scope.$apply(function() {
						scope.next();
					});
					break;
				case 37:
					scope.$apply(function() {
						scope.previous();
					});
					break;
				case 27: 
					scope.close();
					break;
			}
		});

	scope.previous = function() {
		if (scope.step==0) {
			return;
		}

		scope.step--;
	}

	scope.next= function() {
		if (scope.step>=scope.tour.steps.length-1) {
			// close
			scope.close();
			return;
		}

		scope.step++;
	}

	scope.isFirst = function() {
		return (scope.step == 0);
	}

	scope.isLast = function() {
		return (scope.step == scope.tour.steps.length - 1);
	}

	scope.dismiss = function() {

	}

	scope.skip = function() {
		scope.close();
	}

	scope.go = function(step) {
		scope.step=step;	
	}
	scope.close = function() {
		scope.$emit('tour.close');
	}
    }
  };
}]);


