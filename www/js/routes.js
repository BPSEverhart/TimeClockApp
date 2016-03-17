angular.module('tcApp.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('timeClock', {
        url: '/my-time',
        templateUrl: 'templates/timeClock.html',
        controller: 'timeClockCtrl'
      })

      .state('settings', {
        url: '/my-setting',
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      })

    $urlRouterProvider.otherwise('/my-time')



  });
