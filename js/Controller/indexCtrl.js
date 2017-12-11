angular.module('app.controllers')

.controller('indexCtrl', function ($rootScope, $scope, $ionicHistory, $state, $ionicPlatform, $ionicPopup, DBrecord) {
  var vm = this;

  vm.baby = DBrecord.getCurBaby();
  vm.modeDayOn = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.toggleLuminosity = toggleLuminosity;


  /******************************         INITIALISATION               ************************/
  vm.modeDayOn = DBrecord.getDayNightConf().modeDayOn;
  $ionicPlatform.ready(function () {
    _setLuminosity();

    /******************************       EXIT APP CONTROL             ************************
    $ionicPlatform.registerBackButtonAction(function (event) {
      console.log($state.current.name);
      $ionicPopup.confirm({
        title: 'System warning',
        template: 'Are you sure you want to exit?'
      }).then(function (res) {
        var temp = $ionicHistory;
        if (res) {
          navigator.app.exitApp();
        }
      });
    }, 100);
    */

  });

  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('dayNight_updated', function () {
    vm.modeDayOn = DBrecord.getDayNightConf().modeDayOn;
    _setLuminosity();
  })


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /******************************     SWITCH INTENSITY                ************************/
  function toggleLuminosity() {
    var dayNightConf = DBrecord.getDayNightConf();

    vm.modeDayOn = !vm.modeDayOn;
    dayNightConf.modeDayOn = vm.modeDayOn;

    //save change in DB
    DBrecord.setDayNightConf(dayNightConf);

    _setLuminosity();
  }

  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/

  /******************************     SET INTENSITY                ************************/
  function _setLuminosity() {
    var dayNightConf = DBrecord.getDayNightConf();

    // if we are in a WEBVIEW: use Cordova features
    if (ionic.Platform.isWebView()) {
      if (dayNightConf.modeDayOn)
        cordova.plugins.brightness.setBrightness(10); // invalid parameter to let system take brightness control
      else
        cordova.plugins.brightness.setBrightness(dayNightConf.nightLuminosity);
    }
  }

});