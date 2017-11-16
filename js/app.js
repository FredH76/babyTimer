// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'pascalprecht.translate',
  'app.routes',
  'app.controllers',
  'app.factory',
  'app.filters'
])

.run(function ($ionicPlatform, utils, DBrecord) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // get version number in database
    var dbVersion = DBrecord.getAppVersion();
    // if database version lower than current app version: update DB.
    if (utils.compVersion(dbVersion, app_version) < 0) {
      if (utils.compVersion(dbVersion, "0.1.1") < 0) {
        DBrecord.patchToV0_1_1();
      }
      DBrecord.storeAppVersion(app_version);
    }

  });
})

.config(function ($ionicConfigProvider, $translateProvider) {
  $ionicConfigProvider.tabs.position('bottom'); //bottom
  $ionicConfigProvider.navBar.alignTitle('center');

  // add translation table
  $translateProvider.translations('en', translationsEN);
  $translateProvider.translations('fr', translationsFR);
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.fallbackLanguage('fr');
  $translateProvider.determinePreferredLanguage();

});