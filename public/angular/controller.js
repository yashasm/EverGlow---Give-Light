var myApp = angular.module('myApp',['ngRoute', 'ngMaterial']);

myApp.config(function($routeProvider) {
   $routeProvider
   .when('/',{
     templateUrl: 'views/main.html',
      controller: 'HomeController'
   })
   .when('/search', {
     templateUrl: 'views/search.html',
     controller: 'SearchController',
   })
});
console.log("Loading main page");

myApp.directive('regularCard', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/regularCard.tmpl.html',
      scope: {
        name: '@',
        address: '@',
        contactno: '@',
      }
    }
  })

myApp.controller('HomeController',['$scope','$http','$location',function($scope,$http,$location){
  console.log("directory controller");
  $scope.go = function ( path ) {
  $location.path( path );
};
}]);

myApp.controller('SearchController',['$scope','$http', '$q', '$timeout','$mdDialog',function($scope,$http,$q, $timeout,$mdDialog){
  console.log("search controller");
  $scope.search_simulateQuery = false;
  $scope.search_isDisabled    = false;

    // list of `state` value/display objects
    $scope.search_states        = loadAll();
    $scope.search_querySearch   = querySearch;
    $scope.search_selectedItemChange = selectedItemChange;
    $scope.search_searchTextChange   = searchTextChange;

    $scope.search_newState = newState;

    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? $scope.search_states.filter( createFilterFor(query) ) : $scope.search_states,
          deferred;
      if ($scope.search_simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      console.log('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      console.log('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  $scope.get_query_results = function(){
    $http({
		      method: 'GET',
		      url: '/searchall?search=Elaf'
			   }).then(function (success){
			   		console.log("Success");
			   		console.log(success.data);
			   },function (error){
			   		console.log("Failure");
				});
  }
  function FilterDialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
  $scope.entered_search = function(){
    console.log("entered search");
  }
  $scope.showAdvanced = function(ev) {
    console.log("Show advanced filter dialog");
    $mdDialog.show({
      controller: FilterDialogController,
      templateUrl: 'views/filter-dialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

}]);
