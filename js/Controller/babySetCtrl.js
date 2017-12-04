angular.module('app.controllers')

.controller('babySettingsCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $cordovaCamera, $cordovaFile, $filter, utils, ionicDatePicker, DBrecord) {

  var vm = this;
  vm.nbBaby = 1; // this will be set from DBrecord when several babies
  vm.baby = null;
  vm.picture = null;
  vm.name = null;
  vm.firstname = null;
  vm.birthday = null;
  vm.gender = null;
  vm.weight = null;
  vm.height = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.changeName = changeName;
  vm.changeFirstname = changeFirstname;
  vm.openDatePicker = openDatePicker;
  vm.onClickMale = onClickMale;
  vm.onClickFemale = onClickFemale;
  vm.changeWeight = changeWeight;
  vm.changeHeight = changeHeight;

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

  /******************************         INITIALISATION               ************************/
  // load the first baby in UID list
  vm.babyUID = DBrecord.getBabyUIDList()[0];
  vm.baby = DBrecord.getBabyInfo(vm.babyUID);
  vm.picture = vm.baby.picture;
  vm.name = vm.baby.name;
  vm.firstname = vm.baby.firstname;
  vm.birthday = new Date(vm.baby.birthday);
  vm.gender = vm.baby.gender;
  vm.weight = vm.baby.weight;
  vm.height = vm.baby.height;


  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: vm.birthday,
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
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePicker.openDatePicker(datePickerConf);
  };

  function _onDatePicked(val) { //Mandatory
    vm.birthday = new Date(val);
    console.log('Return value from the datepicker popup is : ' + val, vm.birthday);
    vm.baby.birthday = vm.birthday;
    DBrecord.saveBaby(vm.baby);
  }

  /****************************        GO back         ****************************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    if (backView) {
      backView.go();
    } else {
      $state.go('tab.historic');
    }
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
    $cordovaCamera.getPicture(options).then(function(imageFile) {

      /*// 4
      onImageSuccess(imageData);

      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }

      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }

      // 5
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = vm.babyUID + name;

        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(fileSystem2) {
            fileEntry.copyTo(
              fileSystem2,
              newName,
              onCopySuccess,
              fail
            );
          },
          fail);
      }

      // 6
      function onCopySuccess(entry) {
        $scope.$apply(function() {
          vm.picture = urlForImage(entry.nativeURL);
        });
      }

      // 7
      function urlForImage(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.externalDataDirectory + name;
        return trueOrigin;
      }

      function fail(error) {
        console.log("fail: " + error.code);
      }


      //vm.picture = imageData;
      }, function(err) {
        console.log(err);
      });*/
      vm.picture = imageFile;
      vm.baby.picture = vm.picture;
      DBrecord.saveBaby(vm.baby);
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

    $cordovaCamera.getPicture(options).then(function(imageFile) {
      vm.picture = imageFile;
      vm.baby.picture = vm.picture;
      DBrecord.saveBaby(vm.baby);
    }, function(err) {
      // An error occured. Show a message to the user
    });

  }

  /*********************                 Delete Picture                       *****************/
  function deletePicture() {
    picturePopup.close();
    vm.picture = null;
    vm.baby.picture = vm.picture;
    DBrecord.saveBaby(vm.baby);
  }


  /*********************                 change Name                          *****************/
  function changeName() {
    vm.baby.name = vm.name;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Firstame                      *****************/
  function changeFirstname() {
    vm.baby.firstname = vm.firstname;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************          Click on MALE RADIO BUTTON                  *****************/
  function onClickMale() {
    vm.gender = MALE;
    vm.baby.gender = vm.gender;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************          Click on FEMALE RADIO BUTTON                *****************/
  function onClickFemale() {
    vm.gender = FEMALE;
    vm.baby.gender = vm.gender;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Weight                      *****************/
  function changeWeight() {
    vm.baby.weight = vm.weight;
    DBrecord.saveBaby(vm.baby);
  }

  /*********************                 change Height                      *****************/
  function changeHeight() {
    vm.baby.height = vm.height;
    DBrecord.saveBaby(vm.baby);
  }


  /****************************        POPUP MANAGEMENT             ****************************/

  //--------------------------            PICTURE                   ----------------------------/
  // SHOW popup to choose between Picture/Gallery/delete/cancel
  function pop_pictureMenu() {
    picturePopup = $ionicPopup.show({
      title: $filter('translate')('POPUP.TITLE_PICTURE_MENU'),
      cssClass: 'popup-title',
      templateUrl: 'templates/pop_picture.html',
      scope: $scope,
    });
  }

  /*********************                 Cancel picture Menu                   *****************/
  function cancel_menu() {
    picturePopup.close();
  }

})