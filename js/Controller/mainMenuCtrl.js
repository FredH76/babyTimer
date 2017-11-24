angular.module('app.controllers')

.controller('mainMenuCtrl', function ($scope, utils, DBrecord) {
  var vm = this;

  vm.nbBaby = 1;
  vm.version = app_version;
});