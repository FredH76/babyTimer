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
        url: '/auto',
        views: {
            'tab-auto': {
                templateUrl: 'templates/tab-auto.html',
                controller: 'autoCtrl',
                controllerAs: 'autoVM'
            }
        }
    })

    .state('tab.manual', {
        cache: true,
        url: '/manual',
        views: {
            'tab-manual': {
                templateUrl: 'templates/tab-manual.html',
                controller: 'manualCtrl'
            }
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
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/auto');

  }]);