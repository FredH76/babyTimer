angular.module('app.controllers')

.controller('settingsCtrl', function ($scope, ionicDatePicker, DBrecord) {
  var vm = this;
  vm.baby = DBrecord.getCurBabyUID();
  vm.babyGender = MALE;
  vm.birthday = new Date();

  /******************************      FUNCTION DECLARATION            ************************/
  vm.openDatePicker = openDatePicker;
  vm.onMaleGenderClick = onMaleGenderClick;
  vm.onFemaleGenderClick = onFemaleGenderClick;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;

  /******************************         INITIALISATION               ************************/
  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: new Date(vm.selDayStr),
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
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    var selDate = new Date(val);
    console.log('Return value from the datepicker popup is : ' + val, selDate);
    vm.selDayStr = selDate.toLocaleDateString();
  }


  /*********************          Click on MALE RADIO BUTTON                  *****************/
  function onMaleGenderClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.leftSide = !vm.leftSide;
  }

  /*********************          Click on FEMALE RADIO BUTTON                *****************/
  function onFemaleGenderClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.leftSide = !vm.leftSide;
  }

})