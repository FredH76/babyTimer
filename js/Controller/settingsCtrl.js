angular.module('app.controllers')

.controller('settingsCtrl', function ($scope, ionicDatePicker, DBrecord) {
  var vm = this;
  vm.baby = null;
  vm.name = null;
  vm.firstname = null;
  vm.birthday = null;
  vm.gender = null;
  vm.weight = null;
  vm.height = null;

  /******************************      FUNCTION DECLARATION            ************************/
  vm.changeName = changeName;
  vm.changeFirstname = changeFirstname;
  vm.openDatePicker = openDatePicker;
  vm.onClickMale = onClickMale;
  vm.onClickFemale = onClickFemale;
  vm.changeWeight = changeWeight;
  vm.changeHeight = changeHeight;


  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;

  /******************************         INITIALISATION               ************************/
  // load the first baby in UID list
  vm.babyUID = DBrecord.getBabyUIDList()[0];
  vm.baby = DBrecord.getBabyInfo(vm.babyUID);
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
      inputDate: new Date(vm.birthday),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: true,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
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


})