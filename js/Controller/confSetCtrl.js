angular.module('app.controllers')

.controller('confSettingsCtrl', function ($rootScope, $scope, $state, $ionicHistory, $translate, utils, DBrecord) {
  var vm = this;
  vm.medecine = null;
  vm.diapper = null;
  vm.bath = null;
  vm.measure = null;
  vm.note = null;
  vm.language = null;
  vm.languageList = null;
  vm.lumSlider = {};

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.onClickMedecine = onClickMedecine;
  vm.onClickDiapper = onClickDiapper;
  vm.onClickBath = onClickBath;
  vm.onClickMeasure = onClickMeasure;
  vm.onClickNote = onClickNote;
  vm.changeLanguage = changeLanguage;


  /******************************         INITIALISATION               ************************/
  var displayConf = DBrecord.getDisplayConf();
  vm.medecine = displayConf.medecine;
  vm.diapper = displayConf.diapper;
  vm.bath = displayConf.bath;
  vm.measure = displayConf.measure;
  vm.note = displayConf.note;
  vm.languageList = utils.getLangList();

  switch (DBrecord.getCountryConf().language) {
  case FRENCH:
    vm.language = vm.languageList[0];
    break;
  case ENGLISH:
  default:
    vm.language = vm.languageList[1];
  }

  vm.lumSlider = {
    value: DBrecord.getDayNightConf().nightLuminosity * 100,
    options: {
      onStart: _onLumSliderStart,
      onChange: _onLumSliderChange,
      onEnd: _onLumSliderEnd,
      floor: 0,
      ceil: 30,
      minLimit: 0,
      step: 1,
      showTicks: true,
      ticksArray: [0, 5, 10, 15, 20, 25, 30],
      translate: function (value) {
        return value + '%';
      },
    }
  };

  /****************************        GO back         ****************************************/
  function goBack() {
    // animate exit
    //var elt = document.getElementById('confView').className += " close-right-to-left";
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

  /*********************          Click on NOTE RADIO BUTTON                  *****************/
  function onClickNote() {
    vm.note = !vm.note;
    displayConf.note = vm.note;
    DBrecord.saveDisplayConf(displayConf);
    $rootScope.$broadcast('display_configuration_updated');
  }

  /*********************               CHANGE LANGUAGE                        *****************/
  function changeLanguage() {
    // update list and selected language
    switch (vm.language.country) {
    case (FRENCH):
      $translate.use('fr');
      vm.languageList = utils.getLangList();
      vm.language = vm.languageList[0];
      break;
    case (ENGLISH):
    default:
      $translate.use('en');
      vm.languageList = utils.getLangList();
      vm.language = vm.languageList[1];
    }
    // update DB
    var l_fullConf = DBrecord.getCountryConf();
    l_fullConf.language = vm.language.country;
    DBrecord.setCountryConf(l_fullConf);

    $rootScope.$broadcast('language_changed');
  }

  /*********************           Start LUMINOSITY SLIDER                   *****************/
  function _onLumSliderStart() {
    // if we are in a WEBVIEW: use Cordova features
    if (ionic.Platform.isWebView()) {
      cordova.plugins.brightness.setBrightness(parseFloat(vm.lumSlider.value / 100));
    }
  }

  /*********************           Change LUMINOSITY SLIDER                   *****************/
  function _onLumSliderChange() {
    // if we are in a WEBVIEW: use Cordova features
    if (ionic.Platform.isWebView()) {
      cordova.plugins.brightness.setBrightness(parseFloat(vm.lumSlider.value / 100));
    }
  }

  /*********************             End  LUMINOSITY SLIDER                   *****************/
  function _onLumSliderEnd() {
    var dayNightConf = DBrecord.getDayNightConf();

    //save change in DB
    dayNightConf.nightLuminosity = parseFloat(vm.lumSlider.value / 100);
    DBrecord.setDayNightConf(dayNightConf);

    // if we are in a WEBVIEW: use Cordova features
    if (ionic.Platform.isWebView()) {
      if (dayNightConf.modeDayOn) // if DayMode: go back to system luminosity    
        cordova.plugins.brightness.setBrightness(10); // invalid parameter to let system take brightness control
    }
  }


});