angular.module('app.routes', [])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.auto', {
    cache: true,
    url: '/auto/:mode',
    views: {
      'tab-auto': {
        templateUrl: 'templates/tab-input.html',
        controller: 'inputCtrl',
        controllerAs: 'inVM',
        params: {
          mode: MODE_AUTO
        }
      }
    }
  })

  .state('tab.manual', {
    cache: true,
    url: '/manual/:mode/:recUID',
    views: {
      'tab-manual': {
        templateUrl: 'templates/tab-input.html',
        controller: 'inputCtrl',
        controllerAs: 'inVM',
        params: {
          mode: MODE_MANUAL,
          recUID: null
        }
      }
    }
  })

  .state('edit_record', {
    cache: false,
    url: '/edit/:mode/:recUID',
    templateUrl: 'templates/tab-input.html',
    controller: 'inputCtrl',
    controllerAs: 'inVM',
    params: {
      mode: MODE_EDIT,
      recUID: null
    }
  })

  .state('tab.historic', {
    cache: false,
    url: '/historic',
    views: {
      'tab-historic': {
        templateUrl: 'templates/tab-historic.html',
        controller: 'histCtrl',
        controllerAs: 'histVM'
      }
    }
  })

  .state('tab.graphic', {
    cache: false,
    url: '/graphic',
    views: {
      'tab-graphic': {
        templateUrl: 'templates/tab-graph.html',
        controller: 'graphCtrl',
        controllerAs: 'grphVM',
      }
    }
  })

  .state('tab.settings', {
    cache: false,
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'settingsCtrl',
        controllerAs: 'setVM',
      }
    }
  })

  .state('babyList', {
    cache: false,
    url: '/babyList',
    templateUrl: 'templates/babyList.html',
    controller: 'babyListCtrl',
    controllerAs: 'lstVM'
  })

  .state('babySettings', {
    cache: false,
    url: '/babySettings',
    templateUrl: 'templates/babySettings.html',
    controller: 'babySettingsCtrl',
    controllerAs: 'babyVM',
    params: {
      babyUID: null,
    }
  })

  .state('confSettings', {
    cache: false,
    url: '/confSettings',
    templateUrl: 'templates/confSettings.html',
    controller: 'confSettingsCtrl',
    controllerAs: 'confVM'
  })

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/manual/1/null');
  $urlRouterProvider.otherwise('/tab/settings');
  //$urlRouterProvider.otherwise('/tab/historic');
  //$urlRouterProvider.otherwise('/tab/graphic');
  //$urlRouterProvider.otherwise('/babyList');


}]);