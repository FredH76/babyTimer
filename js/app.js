// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'ngCordova',
  'pascalprecht.translate',
  'chart.js',
  'app.routes',
  'app.controllers',
  'app.factory',
  'app.filters'
])

.run(function ($rootScope, $ionicPlatform, $ionicGesture, $translate, $filter, utils, DBrecord) {

  // get version number in database
  var dbVersion = DBrecord.getAppVersion();
  // if database version lower than current app version: update DB.
  if (utils.compVersion(dbVersion, app_version) < 0) {

    if (utils.compVersion(dbVersion, "1.1.2") < 0) {
      DBrecord.patchToV1_1_2(); // create baby demo + add country prefs + add day/night prefs + add display prefs
    }

    DBrecord.storeAppVersion(app_version);
  }

  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // set LANGUAGE (according to user prefs)
    var countryConf = DBrecord.getCountryConf();
    switch (countryConf.language) {
    case (FRENCH):
      $translate.use('fr');
      break;
    case (ENGLISH):
    default:
      $translate.use('en');
    }

    /* this code is for AUTOMATIC LIGHT SENSOR
     // initalize luminosity sensor (first reading is often 0)
     window.plugin.lightsensor.getReading();

     // check luminosity on each user gesture
     var element = angular.element(document.querySelector('#body'));
     $ionicGesture.on('tap', function (e) {
       console.log("catch a user event");

       // check if luminosity is in mode automatique
       if (DBrecord.getDayNightConf().modeAuto) {
         //get luminosity value
         window.plugin.lightsensor.getReading(readLightSuccess);

         function readLightSuccess(params) {
           console.log("get light success : " + params.intensity, params);
           var l_dayNightConf = DBrecord.getDayNightConf();

           if (params.intensity > l_dayNightConf.autoThreshold) {
             l_dayNightConf.modeDayOn = true;
           } else {
             // switch to NIGHT mode
             l_dayNightConf.modeDayOn = false;
           }

           //save changes
           DBrecord.setDayNightConf(l_dayNightConf);
           $rootScope.$broadcast('dayNight_updated');
         }
       }
     }, element);
     */ // END OF AUTOMATIC LIGHT SENSOR
  });
})

.config(function ($ionicConfigProvider, $translateProvider) {
  $ionicConfigProvider.tabs.position('bottom'); //bottom
  $ionicConfigProvider.navBar.alignTitle('center');

  // add translation tables and set fallbacklanguage
  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('fr', translationsFR);
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.fallbackLanguage('fr');
  $translateProvider.determinePreferredLanguage();
});