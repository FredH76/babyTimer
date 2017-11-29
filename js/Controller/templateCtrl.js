angular.module('app.controllers')

.controller('myCtrl', function ($rootScope, $scope, $filter) {
  var vm = this;

  vm.myVar = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.doRefresh = doRefresh;
  vm.myFunc = myFunc;


  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.myConst = $filter('translate')('INPUT.MY_TEXT');


  /******************************         INITIALISATION               ************************/
  vm.myVar = "my init";


  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('my_event_mesg', function () {
    vm.myVar = "change value";
  })


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /******************************       REFRESH DISPLAY                ************************/
  function doRefresh() {
    $scope.$broadcast('scroll.refreshComplete');
  }

  /******************************       MY FUNCTION                    ************************/
  function myFunc() {
    vm.myVar = "other value";
  }


  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/
  function myLocalfunction() {}
})