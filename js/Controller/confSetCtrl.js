angular.module('app.controllers')

.controller('confSettingsCtrl', function($rootScope, $scope, $state, $ionicHistory, $filter, utils, DBrecord) {
  var vm = this;
  vm.medecine = null;
  vm.diapper = null;
  vm.bath = null;
  vm.measure = null;
  vm.note = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.onClickMedecine = onClickMedecine;
  vm.onClickDiapper = onClickDiapper;
  vm.onClickBath = onClickBath;
  vm.onClickMeasure = onClickMeasure;
  vm.onClickNote = onClickNote;


  /******************************         INITIALISATION               ************************/
  var displayConf = DBrecord.getDisplayConf();
  vm.medecine = displayConf.medecine;
  vm.diapper = displayConf.diapper;
  vm.bath = displayConf.bath;
  vm.measure = displayConf.measure;
  vm.note = displayConf.note;


  /****************************        GO back         ****************************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    if (backView) {
      backView.go();
    } else {
      $state.go('tab.historic');
    }
  }

  /*********************          Click on MEDECINE RADIO BUTTON              *****************/
  function onClickMedecine() {
    vm.medecine = !vm.medecine;
    displayConf.medecine = vm.medecine;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

  /*********************          Click on DIAPPER RADIO BUTTON               *****************/
  function onClickDiapper() {
    vm.diapper = !vm.diapper;
    displayConf.diapper = vm.diapper;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

  /*********************          Click on BATH RADIO BUTTON                  *****************/
  function onClickBath() {
    vm.bath = !vm.bath;
    displayConf.bath = vm.bath;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

  /*********************          Click on MEASURE RADIO BUTTON               *****************/
  function onClickMeasure() {
    vm.measure = !vm.measure;
    displayConf.measure = vm.measure;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

  /*********************          Click on NOTE RADIO BUTTON               *****************/
  function onClickNote() {
    vm.note = !vm.note;
    displayConf.note = vm.note;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

});