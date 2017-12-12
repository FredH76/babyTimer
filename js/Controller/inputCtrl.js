angular.module('app.controllers')

.controller('inputCtrl', function ($document, $rootScope, $scope, $state, $stateParams, $ionicHistory, $interval, $timeout, $filter, ionicDatePicker, ionicTimePicker, utils, DBrecord) {
  var vm = this;

  vm.displayConf = null;
  vm.babyName = $filter('translate')('SETTINGS.BABY_DEFAULT_NAME');
  vm.babyGender = MALE;
  vm.curMode = 0;
  vm.autoMode = false;
  vm.manualMode = false;
  var startRunTime = null;
  vm.chrHour = "";
  vm.chrMin = "";
  vm.chrSec = "";
  vm.leftSide = false;
  vm.rightSide = false;
  vm.curState = null;
  vm.curDuration = 0;
  vm.curRecord = {};
  vm.startTime = null;
  vm.selDay = null;
  vm.selHour = "";
  vm.selMin = "";
  vm.diapper = false;
  vm.bath = false;
  vm.medecine = false;
  vm.vitamin = false;
  vm.paracetamol = false;
  vm.paracetamolAlarm = false;
  vm.otherMed = false;
  vm.otherMedName = "";
  vm.measure = false;
  vm.height = null;
  vm.weight = null;
  vm.message = false;
  vm.msgTxt = "";
  vm.bottleSlider = {};
  vm.breastSlider = {};
  vm.peeSlider = {};
  vm.pooSlider = {};
  vm.enableSave = false;

  vm.test = function () {
    /*var elt = document.getElementById("test");
    elt.setAttribute("style", "height:200px");*/
  }

  /******************************      FUNCTION DECLARATION            ************************/
  vm.goBack = goBack;
  vm.openDatePicker = openDatePicker;
  vm.openTimePicker = openTimePicker;
  vm.onLeftSideClick = onLeftSideClick;
  vm.onRightSideClick = onRightSideClick;
  vm.onToggleBreast = onToggleBreast;
  vm.onToggleBottle = onToggleBottle;
  vm.onToggleDiapper = onToggleDiapper;
  vm.onToggleBath = onToggleBath;
  vm.onToggleMedecine = onToggleMedecine;
  vm.onVitaminClick = onVitaminClick;
  vm.onParacetamolClick = onParacetamolClick;
  vm.onOtherMedClick = onOtherMedClick;
  vm.pop_paracetamolAlarm = pop_paracetamolAlarm;
  vm.onOtherMedName = onOtherMedName;
  vm.onToggleMeasure = onToggleMeasure;
  vm.changeWeight = changeWeight;
  vm.changeHeight = changeHeight;
  vm.onToggleMessage = onToggleMessage;
  vm.changeMessage = changeMessage;
  vm.run = run;
  vm.pause = pause;
  vm.save = save;
  vm.reset = reset;
  vm.cancel = cancel;

  /******************************      DEFINE CONSTANT for HTML        ************************/
  vm.STATE_IDLE = 0x00;
  vm.STATE_PAUSED = 0x01
  vm.STATE_RUNNING = 0x02;

  vm.MODE_AUTO = MODE_AUTO;
  vm.MODE_MANUAL = MODE_MANUAL;
  vm.MODE_EDIT = MODE_EDIT;

  vm.LEFT = LEFT;
  vm.RIGHT = RIGHT;
  vm.UNDEF = UNDEF;
  vm.MALE = MALE;
  vm.FEMALE = FEMALE;

  /******************************         INITIALISATION               ************************/

  // set up current mode (AUTO/EDIT/MANUAL)
  switch (parseInt($stateParams.mode)) {
  case MODE_AUTO:
    vm.curMode = MODE_AUTO;
    break;
  case MODE_EDIT:
    vm.curMode = MODE_EDIT;
    break;
  default:
    vm.curMode = MODE_MANUAL;
  }

  vm.displayConf = DBrecord.getDisplayConf();

  vm.baby = DBrecord.getCurBaby();
  vm.babyName = vm.baby.firstname;
  vm.babyGender = vm.baby.gender;

  vm.peeSlider = {
    value: 0,
    options: {
      onEnd: _onSliderPee,
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.pooSlider = {
    value: 0,
    options: {
      onEnd: _onSliderPoo,
      floor: 0,
      ceil: 3,
      step: 1,
      showTicks: true
    }
  };

  vm.breastSlider = {
    value: 0,
    options: {
      onEnd: _onSliderBreast,
      floor: 0,
      ceil: 40,
      step: 5,
      showTicks: true,
    }
  };

  vm.bottleSlider = {
    value: 0,
    options: {
      onEnd: _onSliderBottle,
      floor: 0,
      ceil: 200,
      step: 10,
      ticksArray: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
    }
  };

  // init displayed data
  _initData();

  // start timer for each second
  $interval(function () {
      // if running state
      if (vm.curState == vm.STATE_RUNNING) {

        // init time data
        var l_durationTotal = vm.duration; // init total with already stored duration
        var l_elapsedTime = 0;

        // compute elapsed time
        l_elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
        l_durationTotal += l_elapsedTime;

        // display current HOUR duration
        vm.chrHour = utils.formatHour(Math.floor(l_durationTotal / (60 * 60)));
        var minutesLeft = l_durationTotal - vm.chrHour * 60 * 60;

        // display current MINUTE duration
        vm.chrMin = utils.formatMinute(Math.floor(minutesLeft / 60));
        var secondsLeft = minutesLeft - vm.chrMin * 60;

        // display current SECOND duration
        vm.chrSec = utils.formatSecond(Math.floor(secondsLeft));
      }
    },
    1000
  );

  // update diapper slider after the DOM is loaded
  $document.ready(function () {
    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    }, 10);
  });


  /********************************************************************************************/
  /*                              PUBLIC FUNCTIONS IMPLEMENTATION
  /********************************************************************************************/

  /****************************        GO back         ****************************************/
  function goBack() {
    var backView = $ionicHistory.backView();
    backView.go();
  }

  /*********************          Click on LEFT SIDE  BUTTON                  *****************/
  function onLeftSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.leftSide = !vm.leftSide;
  }

  /*********************          Click on RIGHT SIDE BUTTON                  *****************/
  function onRightSideClick() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // update display
    vm.rightSide = !vm.rightSide;
  }


  /*********************           Click on BREAST BUTTON                   *****************/
  function onToggleBreast() {
    vm.breast = !vm.breast;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    }, 10);
  }

  /*********************         Change Manual BREAST SLIDER                *****************/
  function _onSliderBreast() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }


  /*********************           Click on BOTTLE BUTTON                   *****************/
  function onToggleBottle() {
    vm.bottle = !vm.bottle;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    }, 10);
  }

  /*********************            Change BOTTLE SLIDER                    *****************/
  function _onSliderBottle() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }


  /*********************           Click on DIAPPER BUTTON                  *****************/
  function onToggleDiapper() {
    vm.diapper = !vm.diapper;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
    $timeout(function () {
      $scope.$broadcast('rzSliderForceRender');
    }, 10);
  }

  /*********************            Change PEE DIAPPER SLIDER               *****************/
  function _onSliderPee() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Change POO DIAPPER SLIDER               *****************/
  function _onSliderPoo() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Click on BATH BUTTON                    *****************/
  function onToggleBath() {
    vm.bath = !vm.bath;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            Click on MEDECINE BUTTON                *****************/
  function onToggleMedecine() {
    vm.medecine = !vm.medecine;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************          Click on VITAMIN RADIO BUTTON             *****************/
  function onVitaminClick() {
    vm.vitamin = !vm.vitamin;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************          Click on PARACETAMOL RADIO BUTTON         *****************/
  function onParacetamolClick() {
    vm.paracetamol = !vm.paracetamol;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************          Click on OTHER MED RADIO BUTTON           *****************/
  function onOtherMedClick() {
    vm.otherMed = !vm.otherMed;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************            POP_PARACETAMOL ALARM                   *****************/
  function pop_paracetamolAlarm() {}

  /*********************            SET OTHER MEDECINE NAME                 *****************/
  function onOtherMedName() {
    vm.otherMed = true;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  };

  /*********************            Click on MEASURE BUTTON                *****************/
  function onToggleMeasure() {
    vm.measure = !vm.measure;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************                 change Weight                      *****************/
  function changeWeight() {
    vm.enableSave = true;
  }

  /*********************                 change Height                      *****************/
  function changeHeight() {
    vm.enableSave = true;
  }

  /*********************            Click on MESSAGE BUTTON                 *****************/
  function onToggleMessage() {
    vm.message = !vm.message;
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************                Edit on MESSAGE                     *****************/
  function changeMessage() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;
  }

  /*********************                  RUN                               *****************/
  function run() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // store start time if first run
    if (vm.curState == vm.STATE_IDLE)
      vm.startTime = new Date();

    // switch to RUNNING state
    vm.curState = vm.STATE_RUNNING;

    // store run time start
    if (startRunTime === null)
      startRunTime = new Date();
  }


  /*********************                  PAUSE                               *****************/
  function pause() {
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    // switch to PAUSED state
    vm.curState = vm.STATE_PAUSED;

    // add elapsed time to stored duration
    var elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
    vm.duration += elapsedTime;

    // reset run time start
    startRunTime = null;
  }


  /*********************               OPEN DATE PICKER                     *******************/
  function openDatePicker() {
    var datePickerConf = {
      callback: _onDatePicked, //WARNING: callback is Mandatory!
      inputDate: vm.selDay,
      titleLabel: $filter('translate')('POPUP.DATEPICKER_TITLE'),
      setLabel: $filter('translate')('BUTTON.OK'),
      todayLabel: $filter('translate')('BUTTON.TODAY'),
      closeLabel: $filter('translate')('BUTTON.CANCEL'),
      mondayFirst: true,
      weeksList: utils.getWeekList(),
      monthsList: utils.getMonthList(),
      templateType: 'popup',
      from: new Date(2017, 6, 1),
      to: new Date(2025, 11, 31),
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
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    vm.selDay = new Date(val);;
    console.log('Return value from the datepicker popup is : ' + val, vm.selDay);
  }


  /*********************               OPEN TIME PICKER                     *******************/
  function openTimePicker() {
    var timePickerConf = {
      callback: _onTimePicked, //WARNING: callback is Mandatory!
      inputTime: vm.selHour * 60 * 60 + parseInt(vm.selMin / 5) * 5 * 60,
      format: 24,
      step: 5,
      setLabel: $filter('translate')('BUTTON.OK'),
      closeLabel: $filter('translate')('BUTTON.CANCEL'),
    };
    ionicTimePicker.openTimePicker(timePickerConf);
  };

  function _onTimePicked(val) { //Mandatory
    // enable SAVE/CANCEL BUTTON
    vm.enableSave = true;

    var selTime = new Date(val * 1000);
    console.log('Return value from the datepicker popup is : ' + val, selTime);
    vm.selHour = utils.formatHour(selTime.getUTCHours());
    vm.selMin = utils.formatMinute(selTime.getUTCMinutes());
  }

  /*********************                  SAVE                                *****************/
  /*  update and save current record according to following format
  /*  rec.startTime
  /*  rec.breast
  /*  rec.duration
  /*  rec.leftSide
  /*  rec.rightSide
  /*  rec.bottle
  /*  rec.quantity
  /*  rec.medecine
  /*  rec.vitamin
  /*  rec.paracetamol
  /*  rec.otherMed
  /*  rec.otherMedName
  /*  rec.diapper
  /*  rec.peeLevel
  /*  rec.pooLevel
  /*  rec.bath
  /*  rec.measure
  /*  rec.weight
  /*  rec.height
  /*  rec.message
  /*  rec.msgTxt
  /*  rec.babyUID
  /********************************************************************************************/
  function save() {
    var l_rec = {};

    // if mode AUTO
    if (vm.curMode == MODE_AUTO) {
      // add START TIME info
      if (vm.curState == vm.STATE_IDLE) // force start ime to be right now time 
        vm.startTime = new Date();
      //var truncMin = utils.formatMinute(parseInt(vm.startTime.getMinutes() / 5) * 5);
      //vm.startTime.setMinutes(truncMin);
      l_rec.startTime = vm.startTime;

      // add DURATION info
      //if still running : compute elapsed time and add it to duration
      if (vm.curState == vm.STATE_RUNNING) {
        var elapsedTime = ((new Date()).getTime() - startRunTime.getTime()) / 1000;
        vm.duration += elapsedTime;
      }
      l_rec.breast = true;
      l_rec.duration = vm.duration; // in secondes

      // add SIDE info
      l_rec.leftSide = vm.leftSide;
      l_rec.rightSide = vm.rightSide;
    }

    // if mode MANUAL or EDIT
    if (vm.curMode == MODE_MANUAL || vm.curMode == MODE_EDIT) {
      // add START TIME info
      var l_startTime = vm.selDay;
      l_startTime.setHours(vm.selHour);
      l_startTime.setMinutes(vm.selMin);
      l_rec.startTime = l_startTime;

      // add BREAST and SIDE info
      // breast
      if (vm.breast) {
        l_rec.breast = vm.breast;
        l_rec.duration = vm.breastSlider.value * 60; // in secondes
        l_rec.leftSide = vm.leftSide;
        l_rec.rightSide = vm.rightSide;
      } else {
        delete l_rec.breast;
        delete l_rec.duration;
        delete l_rec.leftSide;
        delete l_rec.rightSide;
      }
    }

    // add BOTTLE info
    if (vm.bottle) {
      l_rec.bottle = vm.bottle;
      if (l_rec.bottle)
        l_rec.quantity = vm.bottleSlider.value;
      else
        l_rec.quantity = 0;
    } else {
      delete l_rec.bottle;
      delete l_rec.quantity;
    }

    // add MEDECINE info
    if (vm.medecine) {
      l_rec.medecine = vm.medecine;
      l_rec.vitamin = vm.vitamin;
      l_rec.paracetamol = vm.paracetamol;
      l_rec.otherMed = vm.otherMed;
      l_rec.otherMedName = vm.otherMedName;
    } else {
      delete l_rec.medecine;
      delete l_rec.vitamin;
      delete l_rec.paracetamol;
      delete l_rec.otherMed;
      delete l_rec.otherMedName;
    }

    // add DIAPPER/PEE/POO info
    if (vm.diapper) {
      l_rec.diapper = vm.diapper;
      l_rec.peeLevel = vm.peeSlider.value;
      l_rec.pooLevel = vm.pooSlider.value;
    } else {
      delete l_rec.diapper;
      delete l_rec.peeLevel;
      delete l_rec.pooLevel;
    }

    // add BATH info
    if (vm.bath)
      l_rec.bath = vm.bath;
    else
      delete l_rec.bath;

    // add MEASURE info
    if (vm.measure) {
      l_rec.measure = vm.measure;
      l_rec.weight = vm.weight;
      l_rec.height = vm.height;
    } else {
      delete l_rec.measure;
      delete l_rec.weight;
      delete l_rec.height;
    }

    // add MESSAGE info
    if (vm.message) {
      l_rec.message = vm.message;
      l_rec.msgTxt = vm.msgTxt;
    } else {
      delete l_rec.message;
      delete l_rec.msgTxt;
    }

    // if MODE_EDIT : delete original record
    if (vm.curMode == MODE_EDIT) {
      DBrecord.delRec($stateParams.recUID);
      $stateParams.recUID = DBrecord._createRecUID(l_rec);
    }

    // add baby UID
    l_rec.babyUID = vm.baby.uid;

    // save records in DB
    DBrecord.saveRec(l_rec);

    // disable SAVE/CANCEL BUTTON
    vm.enableSave = false;

    // reset data
    _initData();

    // go to historic
    $state.go('tab.historic', {});
  }

  /*********************                  CANCEL                              *****************/
  function cancel() {
    //TODO : define cancel behavior
  }

  /*********************                  RESET                              *****************/
  function reset() {
    _initData();
  }

  /********************************************************************************************/
  /*                                      EVENT MANAGEMENT
  /********************************************************************************************/
  $rootScope.$on('display_configuration_updated', function () {
    vm.displayConf = DBrecord.getDisplayConf();
  })

  $rootScope.$on('update_baby_selection', function () {
    vm.baby = DBrecord.getCurBaby(); //xxx
  })


  /********************************************************************************************/
  /*                                      TOOL BOX
  /********************************************************************************************/
  function _initData() {

    // if mode AUTO
    if (vm.curMode === MODE_AUTO) {
      // day
      vm.startTime = new Date();
      //vm.startTime = null;
      // chrono
      startRunTime = null;
      vm.chrHour = utils.formatHour(0);
      vm.chrMin = utils.formatMinute(0);
      vm.chrSec = utils.formatSecond(0);
      // side 
      vm.leftSide = false;
      vm.rightSide = false;
      // state
      vm.curState = vm.STATE_IDLE;
      // duration
      vm.duration = 0;
      // bootle
      vm.bottle = false;
      vm.bottleSlider.value = 0;
      // diapper
      vm.diapper = false;
      vm.peeSlider.value = 0;
      vm.pooSlider.value = 0;
      // bath
      vm.bath = false;
      // medecine
      vm.medecine = false;
      vm.vitamin = false;
      vm.paracetamol = false;
      vm.otherMed = false;
      vm.otherMedName = "";
      // measure
      vm.measure = false;
      vm.weight = 0;
      vm.height = 0;
      // message
      vm.message = false;
      vm.msgTxt = "";
    }

    //if mode MANUAL
    if (vm.curMode === MODE_MANUAL) {
      // day
      vm.startTime = new Date();
      // side 
      vm.leftSide = false;
      vm.rightSide = false;
      // breast
      vm.breast = false;
      vm.breastSlider.value = 0;
      // bootle
      vm.bottle = false;
      vm.bottleSlider.value = 0;
      // diapper
      vm.diapper = false;
      vm.peeSlider.value = 0;
      vm.pooSlider.value = 0;
      // bath :
      vm.bath = false;
      // medecine
      vm.medecine = false;
      vm.vitamin = false;
      vm.paracetamol = false;
      vm.otherMed = false;
      vm.otherMedName = "";
      // measure
      vm.measure = false;
      vm.weight = 0;
      vm.height = 0;
      // message
      vm.message = false;
      vm.msgTxt = "";
    }

    //if mode EDIT
    if (vm.curMode === MODE_EDIT) {
      // control that recUID is linked to a valid record in DB
      var loaded_rec = DBrecord.loadRec($stateParams.recUID);
      if (loaded_rec === null) {
        //TODO : display warning popup
        // go back to historic
        $state.go('tab.historic', {});
        return;
      }
      // day
      vm.startTime = new Date(loaded_rec.startTime);
      // side
      vm.leftSide = loaded_rec.leftSide || false;
      vm.rightSide = loaded_rec.rightSide || false;
      // breast
      vm.breast = loaded_rec.breast || false;
      vm.breastSlider.value = loaded_rec.duration / 60 || 0;
      // bootle
      vm.bottle = loaded_rec.bottle || false;
      vm.bottleSlider.value = loaded_rec.quantity || 0;
      // diapper
      vm.diapper = loaded_rec.diapper || false;
      vm.peeSlider.value = loaded_rec.peeLevel || 0;
      vm.pooSlider.value = loaded_rec.pooLevel || 0;
      // bath 
      vm.bath = loaded_rec.bath || false;
      // medecine
      vm.medecine = loaded_rec.medecine || false;
      vm.vitamin = loaded_rec.vitamin || false;
      vm.paracetamol = loaded_rec.paracetamol || false;
      vm.otherMed = loaded_rec.otherMed || false;
      vm.otherMedName = loaded_rec.otherMedName || "";
      // measure
      vm.measure = loaded_rec.measure || false;
      vm.weight = loaded_rec.weight || 0;
      vm.height = loaded_rec.height || 0;
      // message
      vm.message = loaded_rec.message || false;
      vm.msgTxt = loaded_rec.msgTxt || "";
    }

    // string day
    vm.selDay = vm.startTime;

    // hour and minute
    vm.selHour = utils.formatHour(vm.startTime.getHours());
    vm.selMin = utils.formatMinute(vm.startTime.getMinutes());
    //vm.selMin = utils.formatMinute(parseInt(vm.startTime.getMinutes() / 5) * 5);

    // disable save button
    vm.enableSave = false;

  }


  /*********************         EXTRACT HOUR/MINUTE/SECOND                   *****************
  function _extractHMS(date) {
    var curTime = date.toTimeString(); // format = 23:19:34 GMT+0200 (Paris, Madrid (heure d’été))

    vm.curHour = curTime.slice(0, 2);
    vm.curMin = curTime.slice(3, 5);
    vm.curSec = curTime.slice(6, 8);
  }*/

})