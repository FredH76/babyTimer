angular.module('app.controllers')

.controller('babySettingsCtrl', function ($rootScope, $scope, $state, $stateParams, $ionicHistory, $ionicNavBarDelegate, $ionicPopup, $cordovaCamera, $cordovaFile, $filter, $timeout, utils, ionicDatePicker, DBrecord) {

  var vm = this;
  vm.baby = null;
  vm.selectedBabyUID = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.selectBaby = selectBaby;
  vm.changeName = changeName;
  vm.changeFirstname = changeFirstname;
  vm.openDatePicker = openDatePicker;
  vm.onClickMale = onClickMale;
  vm.onClickFemale = onClickFemale;
  vm.changeWeight = changeWeight;
  vm.changeHeight = changeHeight;
  //vm.deleteBaby = deleteBaby;

  /******************************       POPUP  DECLARATION             ************************/
  var picturePopup = null;
  $scope.pop_pictureMenu = pop_pictureMenu;
  $scope.openCamera = openCamera;
  $scope.openGallery = openGallery;
  $scope.deletePicture = deletePicture;
  $scope.cancel_menu = cancel_menu;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;
  vm.BABY_DEMO_UID = DBrecord.getBabyDemoUID();

  /******************************         INITIALISATION               ************************/
  vm.baby = DBrecord.getBabyInfo($stateParams.babyUID);
  vm.selectedBabyUID = DBrecord.getCurBaby().uid;
  $ionicNavBarDelegate.showBackButton(false);

  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: new Date(vm.baby.birthday),
      titleLabel: $filter('translate')('POPUP.DATEPICKER_TITLE'),
      setLabel: $filter('translate')('BUTTON.OK'),
      todayLabel: $filter('translate')('BUTTON.TODAY'),
      closeLabel: $filter('translate')('BUTTON.CANCEL'),
      mondayFirst: true,
      weeksList: utils.getWeekList(),
      monthsList: utils.getMonthList(),
      templateType: 'popup',
      from: new Date(2017, 6, 1),
      to: new Date(2025, 7, 1),
      showTodayButton: false,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: true,
      disableWeekdays: []
    };
    ionicDatePicker.openDatePicker(datePickerConf);

    $timeout(function () {
      var elt = document.getElementsByClassName("selected_date_full");
      elt[0].firstChild.data = $filter('translate')('POPUP.DATEPICKER_TITLE');
    }, 200);
  };

  function _onDatePicked(val) { //Mandatory
    vm.baby.birthday = new Date(val);
    console.log('Return value from the datepicker popup is : ' + val, vm.baby.birthday);
    DBrecord.saveBaby(vm.baby);
  }

  /****************************        GO back         ****************************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    if (backView) {
      backView.go();
    } else {
      $state.go('tab.settings');
    }
    //$state.go('tab.settings');
  }

  /*********************                 Open Camera                          *****************/
  function openCamera() {
    picturePopup.close();

    var options = {
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    // 3 - call cordova camera function
    $cordovaCamera.getPicture(options).then(function (imageFile) {
      vm.baby.picture = imageFile;
      DBrecord.saveBaby(vm.baby);
      if (vm.selectedBabyUID == vm.baby.uid)
        $rootScope.$broadcast('update_baby_infos');
    });
  }


  /*********************                 Open Gallery                         *****************/
  function openGallery() {
    picturePopup.close();

    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };

    // 3 - call cordova camera function
    $cordovaCamera.getPicture(options).then(function (imageFile) {
      vm.baby.picture = imageFile;
      DBrecord.saveBaby(vm.baby);
      if (vm.selectedBabyUID == vm.baby.uid)
        $rootScope.$broadcast('update_baby_infos');

    });

  }

  /*********************                 Delete Picture                       *****************/
  function deletePicture() {
    picturePopup.close();
    vm.baby.picture = null;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                   SELECT BABY                        *****************/
  function selectBaby() {
    if (vm.selectedBabyUID != vm.baby.uid) {
      vm.selectedBabyUID = vm.baby.uid;
      DBrecord.setCurBaby(vm.selectedBabyUID);
      $rootScope.$broadcast('update_baby_selection');
    }
  }

  /*********************                 change Name                          *****************/
  function changeName() {
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Firstame                      *****************/
  function changeFirstname() {
    DBrecord.saveBaby(vm.baby);
    if (vm.selectedBabyUID == vm.baby.uid)
      $rootScope.$broadcast('update_baby_infos');
  }

  /*********************          Click on MALE RADIO BUTTON                  *****************/
  function onClickMale() {
    vm.baby.gender = MALE;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************          Click on FEMALE RADIO BUTTON                *****************/
  function onClickFemale() {
    vm.baby.gender = FEMALE;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Weight                        *****************/
  function changeWeight() {
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Height                        *****************/
  function changeHeight() {
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                DELETE BABY                          *****************/
  /*function deleteBaby() {
    // delete baby
    DBrecord.deleteBaby(baby);

    //
    goBack();
  }*/


  /****************************        POPUP MANAGEMENT             ***************************/

  /*// SHOW popup to validate deletion
  function pop_deleteBaby(baby) {
    $scope.baby = baby;
    picturePopup = $ionicPopup.show({
      title: $filter('translate')('POPUP.TITLE_PICTURE_MENU'),
      cssClass: 'popup-title',
      templateUrl: 'templates/pop_picture.html',
      scope: $scope,
    });
  }*/


  //--------------------------            PICTURE                   ---------------------------/
  // SHOW popup to choose between Picture/Gallery/delete/cancel
  function pop_pictureMenu(baby) {
    $scope.baby = baby;
    picturePopup = $ionicPopup.show({
      title: $filter('translate')('POPUP.TITLE_PICTURE_MENU'),
      cssClass: 'popup-title',
      templateUrl: 'templates/pop_picture.html',
      scope: $scope,
    });
  }

  /*********************                 Cancel picture Menu                   ****************/
  function cancel_menu() {
    picturePopup.close();
  }

})