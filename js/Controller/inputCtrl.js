angular.module('app.controllers')

.controller('inputCtrl', function ($document, $scope, $state, $stateParams, $ionicHistory, $interval, $ionicScrollDelegate, $timeout, $filter, ionicDatePicker, ionicTimePicker, utils, DBrecord) {
  var vm = this;

  vm.babyName = $filter('translate')('SETTINGS.BABY_DEFAULT_NAME');
  vm.babyGender = MALE;
  vm.curMode = 0;
  vm.autoMode = false;
  vm.manualMode = false;
  //vm.curHour = null;
  //vm.curMin = null;
  //vm.curSec = null;
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

  vm.baby = DBrecord.getBabyInfo(DBrecord.getBabyUIDList()[0]);
  vm.babyName = vm.baby.firstname;
  vm.babyGender = vm.baby.gender;

  vm.peeSlider = {
    value: 2,
    options: {
      onEnd: _onSliderPee,
      floor: 0,
      ceil: 3,
      showTicks: true
    }
  };

  vm.pooSlider = {
    value: 3,
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
      weeksList: utils.transWeek,
      monthsList: utils.transMonth,
      templateType: 'popup',
      from: new Date(2017, 7, 1),
      to: new Date(2025, 7, 1),
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
      setLabel: 'Set',
      closeLabel: 'Cancel'
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
  /*  rec.bottleContent
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
    }

    // if mode MANUAL or EDIT
    if (vm.curMode == MODE_MANUAL || vm.curMode == MODE_EDIT) {
      // add START TIME info
      var l_startTime = vm.selDay;
      l_startTime.setHours(vm.selHour);
      l_startTime.setMinutes(vm.selMin);
      l_rec.startTime = l_startTime;

      // add BREAST info
      // breast
      l_rec.breast = vm.breast;
      l_rec.duration = vm.breastSlider.value * 60; // in secondes
    }

    // add BOTTLE info
    l_rec.bottle = vm.bottle;
    if (l_rec.bottle)
      l_rec.bottleContent = vm.bottleSlider.value;
    else
      l_rec.bottleContent = 0;

    // add SIDE info
    l_rec.leftSide = vm.leftSide;
    l_rec.rightSide = vm.rightSide;

    // add MEDECINE info
    l_rec.medecine = vm.medecine;
    if (l_rec.medecine) {
      l_rec.medecine = vm.medecine;
      l_rec.vitamin = vm.vitamin;
      l_rec.paracetamol = vm.paracetamol;
      l_rec.otherMed = vm.otherMed;
      l_rec.otherMedName = vm.otherMedName;
    } else {
      l_rec.medecine = false;
      l_rec.vitamin = false;
      l_rec.paracetamol = false;
      l_rec.otherMed = false;
      l_rec.otherMedName = "";
    }

    // add DIAPPER/PEE/POO info
    l_rec.diapper = vm.diapper;
    if (l_rec.diapper) {
      l_rec.peeLevel = vm.peeSlider.value;
      l_rec.pooLevel = vm.pooSlider.value;
    } else {
      l_rec.peeLevel = 0;
      l_rec.pooLevel = 0;
    }

    // add BATH info
    l_rec.bath = vm.bath;

    // add MEASURE info
    l_rec.measure = vm.measure;
    if (l_rec.measure) {
      l_rec.weight = vm.weight;
      l_rec.height = vm.height;
    } else {
      l_rec.weight = 0;
      l_rec.height = 0;
    }

    // add MESSAGE info
    l_rec.message = vm.message;
    if (l_rec.message)
      l_rec.msgTxt = vm.msgTxt;
    else
      l_rec.msgTxt = "";

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
      vm.peeSlider.value = null;
      vm.pooSlider.value = null;
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
      vm.peeSlider.value = null;
      vm.pooSlider.value = null;
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
      vm.leftSide = loaded_rec.leftSide;
      vm.rightSide = loaded_rec.rightSide;
      // breast
      vm.breast = loaded_rec.breast;
      vm.breastSlider.value = loaded_rec.duration / 60;
      // bootle
      vm.bottle = loaded_rec.bottle;
      vm.bottleSlider.value = loaded_rec.bottleContent;
      // diapper
      vm.diapper = loaded_rec.diapper;
      vm.peeSlider.value = loaded_rec.peeLevel;
      vm.pooSlider.value = loaded_rec.pooLevel;
      // bath 
      vm.bath = loaded_rec.bath;
      // medecine
      vm.medecine = loaded_rec.medecine;
      vm.vitamin = loaded_rec.vitamin;
      vm.paracetamol = loaded_rec.paracetamol;
      vm.otherMed = loaded_rec.otherMed;
      vm.otherMedName = loaded_rec.otherMedName;
      // measure
      vm.measure = loaded_rec.measure;
      vm.weight = loaded_rec.weight;
      vm.height = loaded_rec.height;
      // message
      vm.message = loaded_rec.message;
      vm.msgTxt = loaded_rec.msgTxt;
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