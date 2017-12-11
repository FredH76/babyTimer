angular.module('app.controllers')

.controller('babyListCtrl', function ($scope, $state, $ionicHistory, $ionicPopup, $cordovaCamera, $cordovaFile, $filter, $timeout, utils, ionicDatePicker, DBrecord) {

  var vm = this;
  vm.editMode = null;
  vm.babyList = null;
  vm.selectedBabyUID = null;
  vm.demoBabyExist = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.switchEditMode = switchEditMode;
  vm.selectBaby = selectBaby;
  vm.editBaby = editBaby;
  vm.addBaby = addBaby;
  vm.deleteBaby = deleteBaby;
  vm.createDemoBaby = createDemoBaby;
  vm.importBaby = importBaby;
  vm.exportBaby = exportBaby;

  /******************************       POPUP  DECLARATION             ************************/


  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;

  /******************************         INITIALISATION               ************************/
  vm.editMode = false;
  vm.babyList = DBrecord.getBabyInfoList();
  vm.selectedBabyUID = DBrecord.getCurBaby().uid;
  vm.demoBabyExist = DBrecord.doesDemoBabyExist();


  /****************************              GO back             ******************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    if (backView) {
      backView.go();
    } else {
      $state.go('tab.historic');
    }
  }


  /******************************         SWITCH EDIT MODE             ************************/
  function switchEditMode() {
    vm.editMode = !vm.editMode;

    if (vm.babyList.length == 1)
      vm.editMode = false;
  }


  /*********************                   SELECT BABY                        *****************/
  function selectBaby(baby) {
    vm.selectedBabyUID = baby.uid
    DBrecord.setCurBaby(vm.selectedBabyUID);
  }


  /*********************                  EDIT BABY                           *****************/
  function editBaby(baby) {
    if (angular.element(event.target).hasClass('click-baby'))
      return;
    $state.go('babySettings', {
      babyUID: baby.uid
    });
  }

  /*********************                  ADD BABY                            *****************/
  function addBaby() {
    // reset edit mode
    vm.editMode = false;

    // create a new baby
    var babyUid = DBrecord.createNewBaby();

    // set as current baby
    vm.selectedBabyUID = babyUid;
    DBrecord.setCurBaby(babyUid);

    //refresh babyList
    vm.babyList = DBrecord.getBabyInfoList();
  }

  /*********************                DELETE BABY                          *****************/
  function deleteBaby(baby) {
    // delete baby
    DBrecord.deleteBaby(baby);

    //refresh babyList and babyDemo
    vm.babyList = DBrecord.getBabyInfoList();
    vm.demoBabyExist = DBrecord.doesDemoBabyExist();

    // refresh current Baby
    if (baby.uid == vm.selectedBabyUID) {
      if (vm.babyList.length == 0)
        vm.selectedBabyUID = null;
      else
        vm.selectedBabyUID = vm.babyList[0].uid;
    }

    if (vm.babyList.length == 1)
      vm.editMode = false;
  }

  /*********************                CREATE DEMO BABY                     *****************/
  function createDemoBaby() {
    // reset edit mode
    vm.editMode = false;

    // create a demo baby
    var babyUid = DBrecord.createDemoBaby();

    // set as current baby
    vm.selectedBabyUID = babyUid;
    DBrecord.setCurBaby(babyUid);

    //refresh babyList
    vm.babyList = DBrecord.getBabyInfoList();
    vm.demoBabyExist = DBrecord.doesDemoBabyExist();
  }

  /*********************                 IMPORT BABY                          *****************/
  function importBaby() {
    // reset edit mode
    vm.editMode = false;

    //DBrecord.importBaby(vm.baby.uid);
  }

  /*********************                 EXPORT BABY                          *****************/
  function exportBaby() {
    // reset edit mode
    vm.editMode = false;

    //DBrecord.exportBaby(vm.baby.uid);
  }

})