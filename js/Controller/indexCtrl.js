angular.module('app.controllers')

.controller('indexCtrl', function ($rootScope, $scope, $ionicHistory, $state, $ionicPlatform, $ionicPopup, $filter, DBrecord) {
  var vm = this;

  vm.baby = DBrecord.getCurBaby();
  vm.modeDayOn = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.toggleLuminosity = toggleLuminosity;
  vm.pop_SelBaby = pop_SelBaby;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;

  /******************************       POPUP  DECLARATION             ************************/
  var selBabyPopup = null;
  $scope.pop_SelBaby = pop_SelBaby;
  $scope.selectBaby = selectBaby;
  $scope.cancel = cancel;

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

  /******************************     SWITCH INTENSITY                 ************************/
  function toggleLuminosity() {
    var dayNightConf = DBrecord.getDayNightConf();

    vm.modeDayOn = !vm.modeDayOn;
    dayNightConf.modeDayOn = vm.modeDayOn;

    //save change in DB
    DBrecord.setDayNightConf(dayNightConf);

    _setLuminosity();
  }

  /******************************      POP SELECT BABY                 ************************/
  function pop_SelBaby() {
    $scope.babyList = DBrecord.getBabyInfoList();
    $scope.selectedBabyUID = DBrecord.getCurBaby().uid;
    $scope.MALE = MALE;
    selBabyPopup = $ionicPopup.show({
      title: $filter('translate')('POPUP.TITLE_SELECT_BABY_MENU'),
      cssClass: 'popup-title sel-popup',
      templateUrl: 'templates/pop_baby_list.html',
      scope: $scope,
    });
  }

  /*********************                 Select Baby                           ****************/
  function selectBaby(baby) {
    var l_curBaby = DBrecord.getCurBaby();
    if (l_curBaby.uid != baby.uid) {
      DBrecord.setCurBaby(baby.uid);
      $rootScope.$broadcast('update_baby_selection');
      selBabyPopup.close();
    }
  }

  /*********************                 Cancel Select Baby                    ****************/
  function cancel() {
    selBabyPopup.close();
  }

  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('update_baby_selection', function () {
    vm.baby = DBrecord.getCurBaby();
  })

  $rootScope.$on('update_baby_infos', function () {
    vm.baby = DBrecord.getCurBaby();
  })

  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/

  /******************************        SET INTENSITY                 ************************/
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